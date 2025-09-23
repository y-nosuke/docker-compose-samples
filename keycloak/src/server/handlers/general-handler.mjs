import { createLogoutPage, createHomePage } from "../templates/index.mjs";

// ログアウト処理関数
export function handleLogout(_req, res) {
  console.log("ログアウトコールバック受信");

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(createLogoutPage());
}

// ホームページ処理関数
export function handleHome(_req, res) {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(createHomePage());
}
