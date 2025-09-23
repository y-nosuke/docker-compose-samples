import { handleAuthUrl, handleCallback } from "./handlers/auth-handler.mjs";
import { handleUserPage } from "./handlers/user-handler.mjs";
import { handleLogout, handleHome } from "./handlers/general-handler.mjs";

// ルーティング処理
export function routeRequest(req, res, parsedUrl) {
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  const pathname = parsedUrl.pathname;

  switch (pathname) {
    case "/callback":
      // OIDC認証のコールバック処理
      handleCallback(req, res, parsedUrl);
      break;

    case "/auth-url":
      // 認証URL生成エンドポイント
      handleAuthUrl(req, res);
      break;

    case "/user":
      // ユーザーページ
      handleUserPage(req, res, parsedUrl);
      break;

    case "/logout":
      // ログアウト処理
      handleLogout(req, res);
      break;

    default:
      // その他のパス（ホームページ）
      handleHome(req, res);
      break;
  }
}
