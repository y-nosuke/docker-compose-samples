# Realm作成
resource "keycloak_realm" "app_realm" {
  realm        = var.realm_name
  enabled      = true
  display_name = "Application Realm"

  # メール設定
  smtp_server {
    host                  = var.smtp_host
    port                  = var.smtp_port
    ssl                   = false
    starttls              = false
    from                  = var.smtp_from_email
    from_display_name     = "Application Realm"
    reply_to              = var.smtp_from_email
    reply_to_display_name = "Application Realm"
  }

  # ログイン設定
  login_with_email_allowed = true
  duplicate_emails_allowed = false
  remember_me              = true
  verify_email             = true

  # 登録設定
  registration_email_as_username = false
  registration_allowed           = true

  # メール検証フロー設定
  email_theme = "keycloak"

  # セキュリティ設定（ブルートフォース攻撃対策）
  security_defenses {
    brute_force_detection {
      max_login_failures               = 5
      wait_increment_seconds           = 60
      quick_login_check_milli_seconds  = 1000
      minimum_quick_login_wait_seconds = 60
      max_failure_wait_seconds         = 900
      failure_reset_time_seconds       = 43200
      permanent_lockout                = false
    }
  }

  # メール検証アクションを有効化
  default_signature_algorithm = "RS256"

  # メール検証フローを設定
  reset_credentials_flow = "reset credentials"
  registration_flow      = "registration"
}

# Postman用パブリッククライアント（Client authentication: OFF）
resource "keycloak_openid_client" "postman_public" {
  realm_id  = keycloak_realm.app_realm.id
  client_id = "postman-public"

  name    = "Postman Public Client"
  enabled = true

  # パブリッククライアント（Client authentication: OFF）
  access_type = "PUBLIC"

  # 認証フロー設定
  standard_flow_enabled                     = true
  implicit_flow_enabled                     = true
  direct_access_grants_enabled              = true
  oauth2_device_authorization_grant_enabled = true
  # パブリッククライアントではstandard_token_exchangeは使用不可
  standard_token_exchange_enabled = false

  # PKCE設定（パブリッククライアントでは推奨）
  pkce_code_challenge_method = "S256"

  valid_redirect_uris = [
    "https://oauth.pstmn.io/v1/callback",
    "http://localhost:*",
    "https://localhost:*"
  ]

  web_origins = [
    "https://oauth.pstmn.io",
    "http://localhost:*",
    "https://localhost:*"
  ]
}

# Postman用コンフィデンシャルクライアント（Client authentication: ON）
resource "keycloak_openid_client" "postman_confidential" {
  realm_id  = keycloak_realm.app_realm.id
  client_id = "postman-confidential"

  name    = "Postman Confidential Client"
  enabled = true

  # コンフィデンシャルクライアント（Client authentication: ON）
  access_type = "CONFIDENTIAL"

  # 認証フロー設定
  standard_flow_enabled                     = true
  implicit_flow_enabled                     = true
  direct_access_grants_enabled              = true
  service_accounts_enabled                  = true
  oauth2_device_authorization_grant_enabled = true
  standard_token_exchange_enabled           = true

  valid_redirect_uris = [
    "https://oauth.pstmn.io/v1/callback",
    "http://localhost:*",
    "https://localhost:*"
  ]

  web_origins = [
    "https://oauth.pstmn.io",
    "http://localhost:*",
    "https://localhost:*"
  ]
}

# Postman用Signed JWTクライアント（Client authentication: Signed JWT）
resource "keycloak_openid_client" "postman_signed_jwt" {
  realm_id  = keycloak_realm.app_realm.id
  client_id = "postman-signed-jwt"

  name    = "Postman Signed JWT Client"
  enabled = true

  # コンフィデンシャルクライアント（Client authentication: Signed JWT）
  access_type = "CONFIDENTIAL"

  # Signed JWT認証設定
  client_authenticator_type = "client-jwt"

  # 認証フロー設定
  standard_flow_enabled                     = true
  implicit_flow_enabled                     = true
  direct_access_grants_enabled              = true
  service_accounts_enabled                  = true
  oauth2_device_authorization_grant_enabled = true
  standard_token_exchange_enabled           = true

  valid_redirect_uris = [
    "https://oauth.pstmn.io/v1/callback",
    "http://localhost:*",
    "https://localhost:*"
  ]

  web_origins = [
    "https://oauth.pstmn.io",
    "http://localhost:*",
    "https://localhost:*"
  ]

  # Signed JWT設定（ローカルキー使用）
  extra_config = {
    "client_assertion_audience" = "https://keycloak.localhost/realms/app-realm"
    "client_assertion_issuer"   = "postman-signed-jwt"
    # ローカルキーを使用（JWKS URLは使用しない）
    "use.jwks.url" = "false"
  }
}

# Postman Signed JWTクライアント用のRSAキー生成
# resource "keycloak_openid_client_keystore" "postman_signed_jwt_keys" {
#   realm_id  = keycloak_realm.app_realm.id
#   client_id = keycloak_openid_client.postman_signed_jwt.id

#   # RSAキー生成設定
#   keystore_type = "RSA"
#   key_size      = 2048
#   key_algorithm = "RSA"
# }

# Android用Client
resource "keycloak_openid_client" "android_oidc" {
  realm_id  = keycloak_realm.app_realm.id
  client_id = "android-app"

  name    = "Android OIDC Client"
  enabled = true

  # Public client（Client authentication: OFF）
  access_type = "PUBLIC"

  # Capability config
  standard_flow_enabled        = true  # Standard flow: ON
  direct_access_grants_enabled = false # Direct access grants: OFF
  implicit_flow_enabled        = false
  service_accounts_enabled     = false

  # Login settings（学習用設定）
  valid_redirect_uris = [
    "http://localhost:3000/callback",
    "http://127.0.0.1:3000/callback"
  ]

  valid_post_logout_redirect_uris = [
    "http://localhost:3000/logout",
    "http://127.0.0.1:3000/logout"
  ]

  web_origins = ["*"]

  # Token設定
  access_token_lifespan       = "300"   # 5 minutes
  client_session_idle_timeout = "1800"  # 30 minutes  
  client_session_max_lifespan = "43200" # 12 hours
}

# テストサーバー用Client（学習・デモ用）
resource "keycloak_openid_client" "test_server" {
  realm_id  = keycloak_realm.app_realm.id
  client_id = var.test_server_client_id

  name    = "Test Server OIDC Client"
  enabled = true

  # Public client（Client authentication: OFF）
  access_type = "PUBLIC"

  # Capability config
  standard_flow_enabled        = true  # Standard flow: ON
  direct_access_grants_enabled = false # Direct access grants: OFF
  implicit_flow_enabled        = false
  service_accounts_enabled     = false

  # PKCE設定（学習用で重要）
  pkce_code_challenge_method = "S256" # PKCE required

  # Login settings（テストサーバー用設定）
  valid_redirect_uris = [
    "http://localhost:3000/callback",
    "http://127.0.0.1:3000/callback",
    "http://localhost:*/callback" # 開発時の柔軟性のため
  ]

  valid_post_logout_redirect_uris = [
    "http://localhost:3000/logout",
    "http://127.0.0.1:3000/logout",
    "http://localhost:*/logout"
  ]

  web_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:*"
  ]

  # Token設定（学習用に短めに設定）
  access_token_lifespan       = "900"   # 15 minutes
  client_session_idle_timeout = "3600"  # 1 hour  
  client_session_max_lifespan = "28800" # 8 hours

  # 学習用の詳細設定
  description = "OIDC学習用のテストサーバークライアント。PKCEフローとトークン管理のデモに使用。"

  # Advanced settings
  use_refresh_tokens = true

  # Consent設定（学習用）
  consent_required = false # 学習用なのでconsentは無効
}

# Next.js用パブリッククライアント
resource "keycloak_openid_client" "nextjs_public" {
  realm_id  = keycloak_realm.app_realm.id
  client_id = "nextjs-app"

  name    = "Next.js Public Client"
  enabled = true

  # パブリッククライアント（Client authentication: OFF）
  access_type = "PUBLIC"

  # 認証フロー設定
  standard_flow_enabled        = true  # Authorization Code Flow
  direct_access_grants_enabled = false # Direct Access Grants: OFF
  implicit_flow_enabled        = false # Implicit Flow: OFF
  service_accounts_enabled     = false # Service Accounts: OFF

  # PKCE設定（パブリッククライアントでは必須）
  pkce_code_challenge_method = "S256"

  # Next.js用リダイレクトURI設定
  valid_redirect_uris = [
    "http://localhost:3000/callback",
    "http://localhost:3000/silent-renew",
    "http://127.0.0.1:3000/callback",
    "http://127.0.0.1:3000/silent-renew",
    "https://localhost:3000/callback",
    "https://localhost:3000/silent-renew",
  ]

  # ログアウト後のリダイレクトURI
  valid_post_logout_redirect_uris = [
    "http://localhost:3000/logout",
    "http://127.0.0.1:3000/logout",
    "https://localhost:3000/logout",
  ]

  # CORS用Webオリジン設定
  web_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://localhost:3000"
  ]

  # トークン設定
  access_token_lifespan       = "1800"  # 30 minutes
  client_session_idle_timeout = "3600"  # 1 hour
  client_session_max_lifespan = "28800" # 8 hours

  # リフレッシュトークン設定
  use_refresh_tokens = true

  # 同意画面設定（Next.jsアプリでは通常無効）
  consent_required = false

  # 詳細設定
  description = "Next.jsアプリケーション用のパブリッククライアント。Authorization Code Flow + PKCEを使用。"

  # ログイン設定
  login_theme = "keycloak"
}

# テストユーザー作成
resource "keycloak_user" "testuser" {
  realm_id = keycloak_realm.app_realm.id
  username = var.username
  enabled  = true

  email          = var.user_email
  email_verified = true
  first_name     = "Test"
  last_name      = "User"

  initial_password {
    value     = var.user_password
    temporary = false
  }

  # メール送信を有効化
  required_actions = ["VERIFY_EMAIL"]
}
