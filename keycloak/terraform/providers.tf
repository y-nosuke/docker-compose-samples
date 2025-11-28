provider "keycloak" {
  client_id                = "admin-cli"
  username                 = "admin"
  password                 = "admin"
  url                      = "http://localhost:8081"
  tls_insecure_skip_verify = true
}
