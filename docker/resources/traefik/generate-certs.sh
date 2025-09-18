#!/bin/bash

# 自己署名証明書生成スクリプト
set -e

CERT_DIR="$(dirname "$0")"
mkdir -p "$CERT_DIR/certs"
cd "$CERT_DIR/certs"

echo "🔐 Generating SSL certificates for development..."

# 既存の証明書を削除
rm -f server.key server.crt server.csr

# 秘密鍵生成
openssl genrsa -out server.key 2048

# 証明書署名要求（CSR）生成
openssl req -new \
  -key server.key \
  -out server.csr \
  -subj "/C=JP/ST=Tokyo/L=Tokyo/O=Development/OU=IT/CN=localhost/emailAddress=dev@localhost"

# 自己署名証明書生成（1年有効）
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt \
  -extensions v3_req -extfile <(
cat <<EOF
[v3_req]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = api.localhost
DNS.3 = dashboard.localhost
DNS.4 = *.localhost
IP.1 = 127.0.0.1
IP.2 = 10.0.2.2
EOF
)

# 証明書情報表示
echo "📋 Certificate information:"
openssl x509 -in server.crt -text -noout | grep -E "(Subject:|Issuer:|Not Before|Not After|DNS:|IP Address:)"

echo "✅ SSL certificates generated successfully!"
echo "   - Private key: server.key"
echo "   - Certificate: server.crt"
echo "   - Valid for: localhost, api.localhost, dashboard.localhost, 127.0.0.1, 10.0.2.2"

# 権限設定
chmod 600 server.key
chmod 644 server.crt

echo "🔒 File permissions set correctly"
