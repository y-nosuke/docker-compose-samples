variable "keycloak_url" {
  description = "Keycloak server URL"
  type        = string
}

variable "keycloak_username" {
  description = "Keycloak admin username"
  type        = string
}

variable "keycloak_password" {
  description = "Keycloak admin password"
  type        = string
  sensitive   = true
}

variable "realm_name" {
  description = "Name of the realm to create"
  type        = string
}

variable "postman_client_id" {
  description = "Client ID for Postman"
  type        = string
}

variable "android_client_id" {
  description = "Client ID for Android OIDC client"
  type        = string
}

variable "test_server_client_id" {
  description = "Client ID for Test Server OIDC client"
  type        = string
}

variable "username" {
  description = "Username for the test user"
  type        = string
}

variable "user_email" {
  description = "Email address for the test user"
  type        = string
}

variable "user_password" {
  description = "Password for the test user"
  type        = string
  sensitive   = true
}

variable "smtp_host" {
  description = "SMTP server host for email"
  type        = string
}

variable "smtp_port" {
  description = "SMTP server port for email"
  type        = string
}

variable "smtp_from_email" {
  description = "From email address for SMTP"
  type        = string
}
