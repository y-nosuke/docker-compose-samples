import { getSession } from "../../utils/session.mjs";
import { createUserPage } from "../templates/index.mjs";

// ユーザーページ処理関数
export function handleUserPage(_req, res, parsedUrl) {
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
