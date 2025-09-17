import crypto from "crypto";

// PKCE用のcode_verifierとcode_challengeを生成
export function generatePKCE() {
  // code_verifierを生成（43-128文字のランダム文字列）
  const codeVerifier = crypto.randomBytes(32).toString("base64url");

  // code_challengeを生成（code_verifierのSHA256ハッシュ）
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  return { codeVerifier, codeChallenge };
}

// セキュリティ用のstateを生成
export function generateState() {
  return crypto.randomBytes(16).toString("hex");
}
