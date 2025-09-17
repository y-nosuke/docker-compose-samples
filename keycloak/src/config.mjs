// OIDCテストサーバーの設定ファイル

export const config = {
  // サーバー設定
  server: {
    port: 3000,
    host: "localhost",
  },

  // Keycloak設定
  keycloak: {
    baseUrl: "http://keycloak.localhost",
    realm: "app-realm",
    clientId: "test-server",
    endpoints: {
      auth: "/realms/app-realm/protocol/openid-connect/auth",
      token: "/realms/app-realm/protocol/openid-connect/token",
      logout: "/realms/app-realm/protocol/openid-connect/logout",
      userinfo: "/realms/app-realm/protocol/openid-connect/userinfo",
    },
  },

  // OIDC設定
  oidc: {
    redirectUri: "http://localhost:3000/callback",
    logoutRedirectUri: "http://localhost:3000/logout",
    scopes: "openid profile email",
    responseType: "code",
    codeChallengeMethod: "S256",
  },

  // セッション設定
  session: {
    maxAge: 30 * 60 * 1000, // 30分
    cleanupInterval: 10 * 60 * 1000, // 10分
  },

  // 処理設定
  processing: {
    callbackDelay: 2000, // 2秒
    resultCleanupDelay: 30000, // 30秒
  },

  // CORS設定
  cors: {
    origin: "*",
    methods: "GET, POST, OPTIONS",
    headers: "Content-Type",
  },
};

// 設定の検証
export function validateConfig() {
  const required = [
    "keycloak.baseUrl",
    "keycloak.realm",
    "keycloak.clientId",
    "oidc.redirectUri",
  ];

  for (const path of required) {
    const value = path.split(".").reduce((obj, key) => obj?.[key], config);
    if (!value) {
      throw new Error(`設定値が不足しています: ${path}`);
    }
  }

  console.log("設定の検証完了");
  return true;
}

// 設定の表示（デバッグ用）
export function displayConfig() {
  console.log("=== 現在の設定 ===");
  console.log("サーバー:", `${config.server.host}:${config.server.port}`);
  console.log(
    "Keycloak:",
    `${config.keycloak.baseUrl}/realms/${config.keycloak.realm}`
  );
  console.log("クライアントID:", config.keycloak.clientId);
  console.log("リダイレクトURI:", config.oidc.redirectUri);
  console.log("スコープ:", config.oidc.scopes);
}
