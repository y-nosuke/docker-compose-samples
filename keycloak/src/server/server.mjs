import http from "http";
import url from "url";
import { startSessionCleanup } from "../utils/session.mjs";
import {
  config,
  validateConfig,
  displayConfig,
  loadDiscoveryConfig,
} from "../config.mjs";
import { routeRequest } from "./routes.mjs";

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // CORSヘッダーを設定
  res.setHeader("Access-Control-Allow-Origin", config.cors.origin);
  res.setHeader("Access-Control-Allow-Methods", config.cors.methods);
  res.setHeader("Access-Control-Allow-Headers", config.cors.headers);

  // ルーティング処理を委譲
  routeRequest(req, res, parsedUrl);
});

// サーバー起動処理
async function startServer() {
  try {
    // ディスカバリーエンドポイントから設定を読み込み
    console.log("ディスカバリーエンドポイントから設定を読み込み中...");
    const discoveryLoaded = await loadDiscoveryConfig();

    if (!discoveryLoaded) {
      console.log("フォールバック設定でサーバーを起動します");
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
  } catch (error) {
    console.error("サーバー起動エラー:", error.message);
    process.exit(1);
  }
}

// サーバーを起動
startServer();

export default server;
