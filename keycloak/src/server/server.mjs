import http from "http";
import url from "url";
import {
  createCallbackPage,
  createLogoutPage,
  createHomePage,
  createUserPage,
  createProcessingPage,
} from "./templates/index.mjs";
import { getTokenFromCode, parseIdToken } from "../utils/token.mjs";
import {
  getSession,
  deleteSession,
  saveSession,
  startSessionCleanup,
} from "../utils/session.mjs";
import { generateAuthUrl } from "../auth/auth-url.mjs";
import { config, validateConfig, displayConfig } from "../config.mjs";

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // CORSヘッダーを設定
  res.setHeader("Access-Control-Allow-Origin", config.cors.origin);
  res.setHeader("Access-Control-Allow-Methods", config.cors.methods);
  res.setHeader("Access-Control-Allow-Headers", config.cors.headers);

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (parsedUrl.pathname === "/callback") {
    // OIDC認証のコールバック処理
    handleCallback(req, res, parsedUrl);
  } else if (parsedUrl.pathname === "/auth-url") {
    // 認証URL生成エンドポイント
    handleAuthUrl(req, res);
  } else if (parsedUrl.pathname === "/user") {
    // ユーザーページ
    handleUserPage(req, res, parsedUrl);
  } else if (parsedUrl.pathname === "/logout") {
    // ログアウト処理
    console.log("ログアウトコールバック受信");

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(createLogoutPage());
  } else {
    // その他のパス
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(createHomePage());
  }
});

// 進行中の認証処理を保存（学習用の簡易実装）
const processingCallbacks = new Map();

// 認証URL生成処理関数
function handleAuthUrl(req, res) {
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
async function handleCallback(req, res, parsedUrl) {
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

// ユーザーページ処理関数
function handleUserPage(req, res, parsedUrl) {
  const sessionKey = parsedUrl.query.session;

  console.log("ユーザーページアクセス - Session:", sessionKey);

  if (!sessionKey) {
    res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`
      <h1>セッションが見つかりません</h1>
      <p>有効なセッションキーが必要です。</p>
      <a href="/">ホームに戻る</a>
    `);
    return;
  }

  const sessionData = getSession(sessionKey);
  if (!sessionData) {
    res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`
      <h1>セッションが無効です</h1>
      <p>セッションが見つからないか、期限切れです。</p>
      <a href="/">ホームに戻る</a>
    `);
    return;
  }

  console.log("ユーザーページ表示完了");

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(createUserPage(sessionData.userInfo, sessionData.tokens));
}

// 設定を検証
validateConfig();

const PORT = config.server.port;
const HOST = config.server.host;

server.listen(PORT, HOST, () => {
  console.log(`OIDCテストサーバーが起動しました: http://${HOST}:${PORT}`);
  console.log("Ctrl+C で停止できます");
  console.log("\n=== 使用方法 ===");
  console.log(`1. http://${HOST}:${PORT} にアクセス`);
  console.log("2. '認証URLを生成して開く'ボタンをクリック");
  console.log("3. Keycloakでログイン");
  console.log("4. コールバック処理後、ユーザーページにリダイレクト");

  // 設定を表示
  displayConfig();

  // セッションクリーンアップを開始
  startSessionCleanup(config.session.cleanupInterval);
});

export default server;
