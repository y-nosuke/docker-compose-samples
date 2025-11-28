# Keycloak Terraform Configuration

このディレクトリには、Keycloakの設定を自動化するためのTerraformコードが含まれています。

## 作成されるリソース

- **Realm**: `app-realm` (Application Realm)
- **Client**:
  - `postman` (Postman用のOAuth2/OpenID Connectクライアント)
  - `android-app` (Android OIDC用クライアント)
  - `test-server` (テストサーバー用OIDCクライアント - 学習・デモ用)
- **User**: `testuser` (テスト用ユーザー)
- **メール設定**: mailpit:1025を使用したSMTP設定
- **セキュリティ設定**: ブルートフォース攻撃対策を含む

## 前提条件

1. Keycloakサーバーが起動していること（<http://keycloak.localhost）>
2. Terraformがインストールされていること
3. Docker ComposeでKeycloakが起動していること
4. メール機能を使用する場合は、mailpitが起動していること（推奨）

## 使用方法

### 1. 初期化

```bash
cd terraform
terraform init
```

### 2. プラン確認

```bash
terraform plan
```

### 3. 適用

```bash
terraform apply
```

### 4. 破棄

```bash
terraform destroy
```

## 設定可能な変数

`variables.tf`で定義されている変数は、以下の方法でオーバーライドできます：

```bash
terraform apply -var="keycloak_password=your_password"
```

または、`terraform.tfvars`ファイルを作成：

```hcl
keycloak_password = "your_password"
user_password     = "your_user_password"
smtp_host         = "your_smtp_host"
smtp_port         = "587"
smtp_from_email   = "noreply@yourdomain.com"
```

## 出力値

適用後、以下の情報が出力されます：

- Realm ID と名前
- Postman Client ID と Secret
- Android Client ID
- Test Server Client ID
- テストユーザー情報
- 各種URL（管理コンソール、認証エンドポイントなど）
- Android設定用の値
- テストサーバー設定用の値（PKCE対応）

## Postmanでのテスト

1. Postmanで新しいリクエストを作成
2. AuthorizationタブでOAuth 2.0を選択
3. 以下の情報を入力：

   - Grant Type: Authorization Code
   - Auth URL: `http://keycloak.localhost/realms/app-realm/protocol/openid-connect/auth`
   - Access Token URL: `http://keycloak.localhost/realms/app-realm/protocol/openid-connect/token`
   - Client ID: `postman`
   - Client Secret: 出力された値を使用
   - Scope: `openid profile email`

## Androidアプリでのテスト

出力される`android_config`の値を使用してAndroidアプリを設定できます：

```kotlin
object KeycloakConfig {
    const val ISSUER_URI = "http://10.0.2.2:8080/realms/app-realm"
    const val CLIENT_ID = "android-app"
    const val REDIRECT_URI = "http://localhost:3000/callback"
    const val END_SESSION_REDIRECT_URI = "http://localhost:3000/logout"
    const val SCOPE = "openid profile email"
}
```

## テストサーバーでのテスト

出力される`test_server_config`の値を使用してNode.jsテストサーバーを設定できます：

```javascript
// src/config.mjs
export const OIDC_CONFIG = {
  issuerUri: "http://keycloak.localhost/realms/app-realm",
  clientId: "test-server",
  authorizationUrl: "http://keycloak.localhost/realms/app-realm/protocol/openid-connect/auth",
  tokenUrl: "http://keycloak.localhost/realms/app-realm/protocol/openid-connect/token",
  userinfoUrl: "http://keycloak.localhost/realms/app-realm/protocol/openid-connect/userinfo",
  endSessionUrl: "http://keycloak.localhost/realms/app-realm/protocol/openid-connect/logout",
  redirectUri: "http://localhost:3000/callback",
  postLogoutRedirectUri: "http://localhost:3000/logout",
  scope: "openid profile email",
  responseType: "code",
  codeChallengeMethod: "S256",
  pkceRequired: true
};
```

### テストサーバーの特徴

- **PKCEフロー対応**: セキュアな認証コード交換
- **Public Client**: クライアントシークレット不要
- **学習用設定**: トークン有効期限を短めに設定
- **開発用柔軟性**: localhost:*でのワイルドカードリダイレクト対応

## テストユーザー

作成されるテストユーザー：

- **ユーザー名**: `testuser`
- **パスワード**: `password123`
- **メール**: `testuser@example.com`
- **名前**: Test User

## 注意事項

- この設定は開発・学習環境用です
- 本番環境では適切なセキュリティ設定を行ってください
- パスワードは固定値として設定されています（temporary=false）
