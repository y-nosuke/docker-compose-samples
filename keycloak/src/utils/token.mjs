import http from "http";
import { config } from "../config.mjs";

// トークン取得関数（学習用のシンプル実装）
export async function getTokenFromCode(code, codeVerifier) {
  const tokenUrl = config.keycloak.endpoints.token;

  const postData = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: config.keycloak.clientId,
    code: code,
    redirect_uri: config.oidc.redirectUri,
    code_verifier: codeVerifier,
  }).toString();

  console.log("トークン取得処理開始");

  return new Promise((resolve, reject) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = http.request(tokenUrl, options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          try {
            const tokenData = JSON.parse(data);
            console.log("トークン取得成功");
            resolve(tokenData);
          } catch (error) {
            console.error("JSON解析エラー:", error);
            reject(error);
          }
        } else {
          console.error("トークン取得失敗:", res.statusCode, data);
          reject(new Error(`Token request failed: ${res.statusCode} ${data}`));
        }
      });
    });

    req.on("error", (error) => {
      console.error("リクエストエラー:", error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// IDトークンからユーザー情報を取得（簡易版）
export function parseIdToken(idToken) {
  try {
    // JWTの中間部分（payload）をデコード（学習用の簡易実装）
    const parts = idToken.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    const payload = parts[1];
    // Base64URLデコード
    const decoded = Buffer.from(
      payload.replace(/-/g, "+").replace(/_/g, "/"),
      "base64"
    ).toString();
    const userInfo = JSON.parse(decoded);

    console.log(
      "IDトークン解析完了 - ユーザー:",
      userInfo.preferred_username || userInfo.sub
    );

    return userInfo;
  } catch (error) {
    console.error("IDトークン解析エラー:", error);
    return null;
  }
}
