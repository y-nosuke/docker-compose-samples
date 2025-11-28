import { generateAuthUrl } from "../../auth/auth-url.mjs";
import { getTokenFromCode, parseIdToken } from "../../utils/token.mjs";
import {
  getSession,
  deleteSession,
  saveSession,
} from "../../utils/session.mjs";
import {
  createCallbackPage,
  createProcessingPage,
} from "../templates/index.mjs";
import { config } from "../../config.mjs";

// 進行中の認証処理を保存（学習用の簡易実装）
const processingCallbacks = new Map();

// 認証URL生成処理関数
export function handleAuthUrl(_req, res) {
  try {
    // 認証URLを生成（PKCEパラメータとセッション管理を含む）
    const result = generateAuthUrl();

    // JSON形式でレスポンス
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        success: true,
        authUrl: result.authUrl,
        state: result.state,
        codeChallenge: result.codeChallenge,
      })
    );

    console.log("認証URL生成完了");
  } catch (error) {
    console.error("認証URL生成エラー:", error.message);

    res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        success: false,
        error: "認証URL生成に失敗しました",
      })
    );
  }
}

// コールバック処理関数
export async function handleCallback(req, res, parsedUrl) {
  const code = parsedUrl.query.code;
  const state = parsedUrl.query.state;
  const error = parsedUrl.query.error;

  console.log(
    "OIDC Callback受信 - State:",
    state,
    error ? `Error: ${error}` : "Success"
  );

  if (error) {
    // エラーの場合は従来通りエラーページを表示
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(createCallbackPage(code, state, error, req));
    return;
  }

  if (!code || !state) {
    res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
    res.end(
      createCallbackPage(null, null, "必要なパラメータが不足しています", req)
    );
    return;
  }

  // 処理済みかチェック
  if (processingCallbacks.has(state)) {
    const result = processingCallbacks.get(state);
    if (result.completed) {
      // 処理完了済み - リダイレクト用の画面を表示
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(createProcessingPage(result.userSessionKey));
      return;
    }
  }

  // まず処理中画面を表示
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(createProcessingPage());

  // 処理中フラグを設定
  processingCallbacks.set(state, { completed: false });

  // 非同期でトークン取得処理を実行
  setTimeout(async () => {
    try {
      // セッションからcode_verifierを取得
      const sessionData = getSession(state);
      if (!sessionData || !sessionData.codeVerifier) {
        console.error("セッションデータが見つかりません");
        processingCallbacks.delete(state);
        return;
      }

      // トークン取得
      const tokens = await getTokenFromCode(code, sessionData.codeVerifier);
      console.log("トークン取得成功");

      // IDトークンからユーザー情報を解析
      const userInfo = parseIdToken(tokens.id_token);

      // ユーザーデータをセッションに保存（新しいセッションキーで）
      const userSessionKey = `user_${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}`;
      saveSession(userSessionKey, { userInfo, tokens, timestamp: Date.now() });

      // 処理完了フラグを設定
      processingCallbacks.set(state, { completed: true, userSessionKey });

      // 元のセッションを削除
      deleteSession(state);

      console.log("認証完了 - ユーザーページへリダイレクト準備完了");

      // 処理結果をクリーンアップ
      setTimeout(() => {
        processingCallbacks.delete(state);
      }, config.processing.resultCleanupDelay);
    } catch (error) {
      console.error("トークン取得エラー:", error.message);
      processingCallbacks.delete(state);
    }
  }, config.processing.callbackDelay); // 処理中画面を見せるため
}
