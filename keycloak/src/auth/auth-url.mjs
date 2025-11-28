import { generatePKCE, generateState } from "../utils/pkce.mjs";
import { saveSession } from "../utils/session.mjs";
import { config } from "../config.mjs";

// 認証URLを生成
export function generateAuthUrl() {
  const { codeVerifier, codeChallenge } = generatePKCE();
  const state = generateState();

  // セッション保存（stateをキーにしてcode_verifierを保存）
  saveSession(state, { codeVerifier, timestamp: Date.now() });

  const baseUrl = config.keycloak.endpoints.auth;
  const params = new URLSearchParams({
    client_id: config.keycloak.clientId,
    redirect_uri: config.oidc.redirectUri,
    response_type: config.oidc.responseType,
    scope: config.oidc.scopes,
    code_challenge: codeChallenge,
    code_challenge_method: config.oidc.codeChallengeMethod,
    state: state,
  });

  const authUrl = `${baseUrl}?${params.toString()}`;

  console.log("認証URL生成完了 - State:", state);

  return { authUrl, codeVerifier, codeChallenge, state };
}

// 直接実行された場合
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAuthUrl();
}
