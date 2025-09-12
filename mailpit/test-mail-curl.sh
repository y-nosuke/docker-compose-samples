#!/bin/bash

# mailpitの動作確認用 curlを使ったメール送信サンプル
# curlは標準でインストールされているため、より汎用的です

echo "=== Mailpit動作確認用 curlサンプル ==="
echo "SMTPサーバー: localhost:1025"
echo "Web UI: http://localhost:8025 または http://mailpit.localhost/"
echo ""

# curlを使ったメール送信関数
send_mail_curl() {
    local to="$1"
    local subject="$2"
    local body="$3"
    local from="${4:-test@localhost}"

    # メールデータを作成
    local mail_data="From: $from
To: $to
Subject: $subject
Content-Type: text/plain; charset=UTF-8

$body"

    # curlでSMTP送信
    echo "$mail_data" | curl -s --url "smtp://localhost:1025" \
        --mail-from "$from" \
        --mail-rcpt "$to" \
        --upload-file -
}

# HTMLメール送信関数
send_html_mail_curl() {
    local to="$1"
    local subject="$2"
    local body="$3"
    local from="${4:-test@localhost}"

    local mail_data="From: $from
To: $to
Subject: $subject
Content-Type: text/html; charset=UTF-8

$body"

    echo "$mail_data" | curl -s --url "smtp://localhost:1025" \
        --mail-from "$from" \
        --mail-rcpt "$to" \
        --upload-file -
}

# 1. 基本的なメール送信
echo "1. 基本的なメール送信"
send_mail_curl "test@example.com" "テストメール" "これはcurlを使ったシンプルなテストメールです。"
echo "✓ シンプルなテストメールを送信しました"
echo ""

# 2. 複数の宛先にメール送信
echo "2. 複数の宛先にメール送信"
for recipient in "user1@example.com" "user2@example.com" "user3@example.com"; do
    send_mail_curl "$recipient" "複数宛先テスト" "複数の宛先へのテストメールです。"
done
echo "✓ 複数の宛先にメールを送信しました"
echo ""

# 3. HTMLメール送信
echo "3. HTMLメール送信"
html_body='<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>HTMLテストメール</title>
</head>
<body>
    <h1 style="color: #333;">HTMLメールのテストです</h1>
    <p>これは<strong>HTML形式</strong>のメールです。</p>
    <ul>
        <li>リスト項目1</li>
        <li>リスト項目2</li>
        <li>リスト項目3</li>
    </ul>
    <p><a href="https://mailpit.axllent.org/" style="color: #007cba;">Mailpit公式サイト</a></p>
</body>
</html>'
send_html_mail_curl "html-test@example.com" "HTMLテストメール" "$html_body"
echo "✓ HTMLメールを送信しました"
echo ""

# 4. 送信者を指定したメール送信
echo "4. 送信者を指定したメール送信"
send_mail_curl "sender-test@example.com" "送信者指定テスト" "送信者を指定したテストメールです。" "sender@company.com"
echo "✓ 送信者を指定してメールを送信しました"
echo ""

# 5. 日本語件名・本文のメール送信
echo "5. 日本語件名・本文のメール送信"
japanese_body='こんにちは！

これは日本語の本文を含むテストメールです。

内容：
- 日本語の件名
- 日本語の本文
- 特殊文字：①②③
- 絵文字：:rocket::e-mail::sparkles:

よろしくお願いします。'
send_mail_curl "japanese-test@example.com" "日本語テスト：件名に日本語を含むメール" "$japanese_body"
echo "✓ 日本語メールを送信しました"
echo ""

# 6. 複数メール送信テスト
echo "6. 複数メール送信テスト"
for i in {1..5}; do
    send_mail_curl "batch-test-${i}@example.com" "バッチテスト #${i}" "バッチ送信テスト ${i}/5 です。"
done
echo "✓ 5通のバッチメールを送信しました"
echo ""

# 7. CC付きメール送信
echo "7. CC付きメール送信"
cc_mail_data="From: test@localhost
To: main@example.com
Cc: cc1@example.com, cc2@example.com
Subject: CCテスト
Content-Type: text/plain; charset=UTF-8

これはCC付きのテストメールです。"

echo "$cc_mail_data" | curl -s --url "smtp://localhost:1025" \
    --mail-from "test@localhost" \
    --mail-rcpt "main@example.com" \
    --mail-rcpt "cc1@example.com" \
    --mail-rcpt "cc2@example.com" \
    --upload-file -
echo "✓ CC付きメールを送信しました"
echo ""

# 8. 優先度付きメール送信
echo "8. 優先度付きメール送信"
priority_mail_data="From: test@localhost
To: priority@example.com
Subject: 【重要】優先度テスト
X-Priority: 1
X-MSMail-Priority: High
Content-Type: text/plain; charset=UTF-8

これは高優先度のメールです。"

echo "$priority_mail_data" | curl -s --url "smtp://localhost:1025" \
    --mail-from "test@localhost" \
    --mail-rcpt "priority@example.com" \
    --upload-file -
echo "✓ 優先度付きメールを送信しました"
echo ""

echo "=== 全てのテストが完了しました ==="
echo "Web UI (http://localhost:8025 または http://mailpit.localhost/) でメールを確認してください。"
echo ""
echo "注意: このスクリプトはcurlを使用しています。"
echo "curlは標準でインストールされているため、追加のインストールは不要です。"
