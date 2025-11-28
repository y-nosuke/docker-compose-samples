# keycloak

これはKeyCloakの Docker-Compose です。

## 事前準備

hostsファイルに`keycloak.localhost`を登録します。
traefixによりリバースプロキシを利用するための設定です。

```bash
# Windows
# C:\Windows\System32\drivers\etc\hosts
127.0.0.1 keycloak.localhost
```

## 管理画面

- [keycloak 管理画面](http://keycloak.localhost/admin)
- [keycloak アカウント画面](http://keycloak.localhost/realms/app-realm/account)
- [mailpit 管理画面](http://mailpit.localhost/)

## export & import

### コマンド

```sh
# WSLでは書き込み権限の付与が必要なよう
sudo chmod +w docker/resources/keycloak/import

docker exec -it keycloak /opt/keycloak/bin/kc.sh export --dir /opt/keycloak/data/import --realm app-realm --optimized
# exportした後はauthorizationSettingsを削除する。

docker exec -it keycloak /opt/keycloak/bin/kc.sh import --dir /opt/keycloak/data/import
```

- [Importing and Exporting Realms](https://www.keycloak.org/server/importExport)

### 画面

重要な設定は Export/Import で管理可能:

1. **Realm settings** → **Action** → **Export**
2. **Include users and groups**: チェック
3. **Export for importing**: チェック

これで Keycloak 環境の構築は完了です。次は Android プロジェクトでの AppAuth-Android 実装に進みましょう。

## 🧪 動作テスト

### テストサーバーの起動

```bash
# OIDC認証のコールバック用サーバーを起動
node src/server/server.mjs
```

サーバーが起動すると、<http://localhost:3000> でアクセス可能になります。

### ログインの動作確認

**方法A: 自動生成（推奨）**

1. ブラウザで `http://localhost:3000` にアクセス
2. 「認証URLを生成して開く」ボタンをクリック（ログインボタンの代わり）
3. 新しいタブでKeycloakのログイン画面が開きます
4. ユーザー名・パスワード(testuser/password123)を入力してログイン
5. 認証成功後、自動的にコールバック画面にリダイレクト
6. ログイン後の画面で「ログアウト」ボタンが表示されます

**方法B: 手動生成**

```bash
# 正しいPKCEパラメータを含む認証URLを生成
node src/auth/auth-url.mjs

# 生成されたURLをブラウザで開いてテスト
# 例: http://keycloak.localhost/realms/app-realm/protocol/openid-connect/auth?client_id=android-app&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&response_type=code&scope=openid+profile+email&code_challenge=正しいハッシュ値&code_challenge_method=S256&state=ランダム値
```

### 認証フローの確認

1. **ログイン**: Keycloakのログイン画面でユーザー名・パスワードを入力
2. **リダイレクト**: 認証成功後、自動的に `http://localhost:3000/callback` にリダイレクト
3. **結果確認**: 認証コード、State、エラー情報が表示される

### 期待される結果

認証が成功した場合、以下のような情報が表示されます：

- **認証コード**: 長い文字列（例: `abc123def456...`）
- **State**: セキュリティ用のランダム値
- **エラー**: なし

認証に失敗した場合：

- **認証コード**: なし
- **エラー**: エラーの種類（例: `invalid_request`）

### ログアウトの動作確認

**方法A: 自動生成（推奨）**

1. ログイン後の画面で「ログアウト」ボタンをクリック
2. Keycloakのログアウト確認画面が表示される
3. 「ログアウト」をクリック
4. 自動的に `http://localhost:3000/logout` にリダイレクト
5. ログアウト完了メッセージが表示される

**方法B: 手動生成**

```bash
# ログアウト用のURLを生成
node src/auth/logout-url.mjs

# 生成されたURLをブラウザで開いてテスト
# 例: http://keycloak.localhost/realms/app-realm/protocol/openid-connect/logout?client_id=android-app&post_logout_redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogout
```

**期待される結果**

- ログアウト成功時: 「ログアウトが完了しました」メッセージが表示
- セッションが無効化され、再度ログインが必要

**注意:** `code_challenge=CHALLENGE`は無効です。必ず`node src/auth/auth-url.js`で生成された正しいURLを使用してください。

### Well-known エンドポイント確認

```bash
curl http://keycloak.localhost/realms/app-realm/.well-known/openid-configuration
```

**重要な情報:**

```json
{
  "authorization_endpoint": "http://keycloak.localhost/realms/app-realm/protocol/openid-connect/auth",
  "token_endpoint": "http://keycloak.localhost/realms/app-realm/protocol/openid-connect/token",
  "userinfo_endpoint": "http://keycloak.localhost/realms/app-realm/protocol/openid-connect/userinfo",
  "end_session_endpoint": "http://keycloak.localhost/realms/app-realm/protocol/openid-connect/logout"
}
```

## 参考

- [keycloak.org](https://www.keycloak.org/)
  - [Guides](https://www.keycloak.org/guides)
  - [Documentation](https://www.keycloak.org/documentation)
    - [Guides/Getting started/Docker](https://www.keycloak.org/getting-started/getting-started-docker)
    - [Running Keycloak in a container](https://www.keycloak.org/server/containers)
    - [Configuring Keycloak](https://www.keycloak.org/server/configuration)
    - [All configuration](https://www.keycloak.org/server/all-config)
    - [Using a reverse proxy](https://www.keycloak.org/server/reverseproxy)
- [dockerhub quay.io](https://quay.io/repository/keycloak/keycloak)

- [Keycloak Provider](https://registry.terraform.io/providers/keycloak/keycloak/latest/docs)
- [keycloak/terraform-provider-keycloak](https://github.com/keycloak/terraform-provider-keycloak?tab=readme-ov-file)

- [【入門】Keycloak + Docker で OIDC の SSO を設定](https://hogetech.info/oss/keycloak)
- [Keycloak (Quarkus distro) + PostgreSQL を Docker Composeで動かすサンプル](https://zenn.dev/issy/articles/keycloak-docker-compose)

- [Keycloak Provider](https://registry.terraform.io/providers/keycloak/keycloak/latest/docs)
- [keycloak/terraform-provider-keycloak](https://github.com/keycloak/terraform-provider-keycloak?tab=readme-ov-file)
