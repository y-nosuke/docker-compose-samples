// OIDCテストサーバーの設定ファイル

// 基本設定（動的に変更されない部分）
const baseConfig = {
  // サーバー設定
  server: {
    port: 3000,
    host: "localhost",
  },

  // Keycloak基本設定
  keycloak: {
    baseUrl: "http://keycloak.localhost",
    realm: "app-realm",
    clientId: "test-server",
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

// 動的設定（ディスカバリーエンドポイントから取得）
let dynamicConfig = {
  keycloak: {
    ...baseConfig.keycloak,
    endpoints: {
      auth: "",
      token: "",
      logout: "",
      userinfo: "",
    },
  },
};

// 設定をマージした最終的な設定
export let config = {
  ...baseConfig,
  ...dynamicConfig,
};

// ディスカバリーエンドポイントから設定を取得
export async function loadDiscoveryConfig() {
  try {
    const discoveryUrl = `${baseConfig.keycloak.baseUrl}/realms/${baseConfig.keycloak.realm}/.well-known/openid-configuration`;
    console.log(
      `ディスカバリーエンドポイントから設定を取得中: ${discoveryUrl}`
    );

    const response = await fetch(discoveryUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const discoveryData = await response.json();

    // エンドポイント設定を更新
    dynamicConfig.keycloak.endpoints = {
      auth: discoveryData.authorization_endpoint,
      token: discoveryData.token_endpoint,
      logout: discoveryData.end_session_endpoint,
      userinfo: discoveryData.userinfo_endpoint,
    };

    // 設定を再マージ
    config = {
      ...baseConfig,
      ...dynamicConfig,
    };

    console.log("ディスカバリーエンドポイントから設定を取得完了");
    return true;
  } catch (error) {
    console.error(
      "ディスカバリーエンドポイントからの設定取得に失敗:",
      error.message
    );
    console.log("フォールバック設定を使用します");
    return false;
  }
}

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

  // エンドポイント設定の検証
  const endpointRequired = [
    "keycloak.endpoints.auth",
    "keycloak.endpoints.token",
    "keycloak.endpoints.logout",
    "keycloak.endpoints.userinfo",
  ];

  for (const path of endpointRequired) {
    const value = path.split(".").reduce((obj, key) => obj?.[key], config);
    if (!value) {
      console.warn(`エンドポイント設定が不足しています: ${path}`);
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

  if (config.keycloak.endpoints) {
    console.log("=== エンドポイント設定 ===");
    console.log("認証エンドポイント:", config.keycloak.endpoints.auth);
    console.log("トークンエンドポイント:", config.keycloak.endpoints.token);
    console.log("ログアウトエンドポイント:", config.keycloak.endpoints.logout);
    console.log(
      "ユーザー情報エンドポイント:",
      config.keycloak.endpoints.userinfo
    );
  }
}
