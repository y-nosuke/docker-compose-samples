# mailpit

これはMailpitの Docker-Compose です。

## 事前準備

hostsファイルに`mailpit.localhost`を登録します。
traefixによりリバースプロキシを利用するための設定です。

```sh
# Windows
# C:\Windows\System32\drivers\etc\hosts
# explorer "C:\Windows\System32\drivers\etc"
127.0.0.1 mailpit.localhost
```

## 管理画面

- [管理画面](http://mailpit.localhost/)

## メール送信テスト

### 自動テストスクリプト

```sh
./test-mail-curl.sh
```

### 手動でのメール送信例

**curl（推奨）:**

```sh
# 基本的なメール送信
echo -e "From: test@localhost\nTo: test@example.com\nSubject: =?UTF-8?B?$(echo -n 'テスト件名' | base64)?=\nContent-Type: text/plain; charset=UTF-8\n\nテストメッセージ" | \
curl -s --url "smtp://localhost:1025" --mail-from "test@localhost" --mail-rcpt "test@example.com" --upload-file -

# HTMLメール送信
echo -e "From: test@localhost\nTo: html@example.com\nSubject: HTMLテスト\nContent-Type: text/html\n\n<h1>HTMLテスト</h1>" | \
curl -s --url "smtp://localhost:1025" --mail-from "test@localhost" --mail-rcpt "html@example.com" --upload-file -
```

**sendmail（参考）:**

```sh
# 基本的なメール送信
echo -e "From: test@localhost\nTo: test@example.com\nSubject: テスト件名\n\nテストメッセージ" | \
/usr/sbin/sendmail -S localhost:1025 -f test@localhost test@example.com
```

### 確認方法

送信したメールは以下のWeb UIで確認できます：

- <http://localhost:8025>
- <http://mailpit.localhost/> (hostsファイル設定済みの場合)

## 参考

- [Mailpit - email & SMTP testing tool with API for developers](https://mailpit.axllent.org/)
- [axllent/mailpit](https://github.com/axllent/mailpit)

- [mailpitでメール送信のテストをする with Go](https://zenn.dev/ispec_inc/articles/mailpit-introduction)
