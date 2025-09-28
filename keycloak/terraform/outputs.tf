output "realm_id" {
  description = "ID of the created realm"
  value       = keycloak_realm.app_realm.id
}

output "realm_name" {
  description = "Name of the created realm"
  value       = keycloak_realm.app_realm.realm
}

output "postman_public_client_id" {
  description = "ID of the Postman public client"
  value       = keycloak_openid_client.postman_public.client_id
}

output "postman_confidential_client_id" {
  description = "ID of the Postman confidential client"
  value       = keycloak_openid_client.postman_confidential.client_id
}

output "postman_confidential_client_secret" {
  description = "Secret of the Postman confidential client"
  value       = keycloak_openid_client.postman_confidential.client_secret
  sensitive   = true
}

output "android_client_id" {
  description = "ID of the Android OIDC client"
  value       = keycloak_openid_client.android_oidc.client_id
}

output "test_server_client_id" {
  description = "ID of the Test Server OIDC client"
  value       = keycloak_openid_client.test_server.client_id
}

output "user_id" {
  description = "ID of the created test user"
  value       = keycloak_user.testuser.id
}

output "username" {
  description = "Username of the created test user"
  value       = keycloak_user.testuser.username
}

output "user_email" {
  description = "Email of the created test user"
  value       = keycloak_user.testuser.email
}

output "keycloak_admin_console_url" {
  description = "URL to access Keycloak admin console"
  value       = "${var.keycloak_url}/admin"
}

output "keycloak_account_console_url" {
  description = "URL to access Keycloak account console"
  value       = "${var.keycloak_url}/realms/${var.realm_name}/account"
}

output "openid_connect_discovery_url" {
  description = "OpenID Connect discovery URL"
  value       = "${var.keycloak_url}/realms/${var.realm_name}/.well-known/openid-configuration"
}

output "authorization_url" {
  description = "Authorization URL for OAuth2/OpenID Connect"
  value       = "${var.keycloak_url}/realms/${var.realm_name}/protocol/openid-connect/auth"
}

output "token_url" {
  description = "Token URL for OAuth2/OpenID Connect"
  value       = "${var.keycloak_url}/realms/${var.realm_name}/protocol/openid-connect/token"
}

output "userinfo_url" {
  description = "UserInfo URL for OpenID Connect"
  value       = "${var.keycloak_url}/realms/${var.realm_name}/protocol/openid-connect/userinfo"
}

output "end_session_url" {
  description = "End session URL for OIDC logout"
  value       = "${var.keycloak_url}/realms/${var.realm_name}/protocol/openid-connect/logout"
}

# Android設定用の値
output "android_config" {
  description = "Android app configuration values"
  value = {
    issuer_uri               = "${var.keycloak_url}/realms/${var.realm_name}"
    client_id                = keycloak_openid_client.android_oidc.client_id
    redirect_uri             = "http://localhost:3000/callback"
    end_session_redirect_uri = "http://localhost:3000/logout"
    scope                    = "openid profile email"
  }
}

# テストサーバー設定用の値
output "test_server_config" {
  description = "Test Server OIDC configuration values"
  value = {
    issuer_uri               = "${var.keycloak_url}/realms/${var.realm_name}"
    client_id                = keycloak_openid_client.test_server.client_id
    authorization_url        = "${var.keycloak_url}/realms/${var.realm_name}/protocol/openid-connect/auth"
    token_url                = "${var.keycloak_url}/realms/${var.realm_name}/protocol/openid-connect/token"
    userinfo_url             = "${var.keycloak_url}/realms/${var.realm_name}/protocol/openid-connect/userinfo"
    end_session_url          = "${var.keycloak_url}/realms/${var.realm_name}/protocol/openid-connect/logout"
    redirect_uri             = "http://localhost:3000/callback"
    post_logout_redirect_uri = "http://localhost:3000/logout"
    scope                    = "openid profile email"
    response_type            = "code"
    code_challenge_method    = "S256"
    pkce_required            = true
  }
}
