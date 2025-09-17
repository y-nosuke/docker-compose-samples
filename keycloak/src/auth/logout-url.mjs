import { config } from "../config.mjs";

// ログアウトURL生成
export function generateLogoutUrl() {
  const baseUrl = `${config.keycloak.baseUrl}${config.keycloak.endpoints.logout}`;
  const params = new URLSearchParams({
    client_id: config.keycloak.clientId,
    post_logout_redirect_uri: config.oidc.logoutRedirectUri,
  });

  return baseUrl + "?" + params.toString();
}

function displayLogoutUrl() {
  const logoutUrl = generateLogoutUrl();

  console.log("=== OIDCログアウトURL ===");
  console.log(logoutUrl);
  console.log("\n=== 使用方法 ===");
  console.log("1. 上記のURLをブラウザで開く");
  console.log("2. Keycloakのログアウト確認画面が表示される");
  console.log("3. 「ログアウト」をクリック");
  console.log(
    `4. 自動的に ${config.oidc.logoutRedirectUri} にリダイレクトされる`
  );
  console.log("5. ログアウト完了メッセージが表示される");
}

// 直接実行された場合
if (import.meta.url === `file://${process.argv[1]}`) {
  displayLogoutUrl();
}
