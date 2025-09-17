variable "keycloak_url" {
  description = "Keycloak server URL"
  type        = string
  default     = "http://keycloak.localhost"
}

variable "keycloak_username" {
  description = "Keycloak admin username"
  type        = string
  default     = "admin"
}

variable "keycloak_password" {
  description = "Keycloak admin password"
  type        = string
  default     = "admin"
  sensitive   = true
}

variable "realm_name" {
  description = "Name of the realm to create"
  type        = string
  default     = "app-realm"
}

variable "postman_client_id" {
  description = "Client ID for Postman"
  type        = string
  default     = "postman"
}

variable "android_client_id" {
  description = "Client ID for Android OIDC client"
  type        = string
  default     = "android-app"
}

variable "test_server_client_id" {
  description = "Client ID for Test Server OIDC client"
  type        = string
  default     = "test-server"
}

variable "username" {
  description = "Username for the test user"
  type        = string
  default     = "testuser"
}

variable "user_email" {
  description = "Email address for the test user"
  type        = string
  default     = "testuser@example.com"
}

variable "user_password" {
  description = "Password for the test user"
  type        = string
  default     = "password123"
  sensitive   = true
}

variable "smtp_host" {
  description = "SMTP server host for email"
  type        = string
  default     = "mailpit"
}

variable "smtp_port" {
  description = "SMTP server port for email"
  type        = string
  default     = "1025"
}

variable "smtp_from_email" {
  description = "From email address for SMTP"
  type        = string
  default     = "noreply@app-realm.localhost"
}
