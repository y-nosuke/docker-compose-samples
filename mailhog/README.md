# mailhog

これはmailhogの Docker-Compose です。

## 事前準備

hostsファイルに`mailhog.localhost`を登録します。
traefixによりリバースプロキシを利用するための設定です。

```
# Windwos
# C:\Windows\System32\drivers\etc\hosts
127.0.0.1 mailhog.localhost
```

## 管理画面

- [mailhog](http://mailhog.localhost/)

## 参考

- [Docker環境にメールサーバー構築でMailhogを利用する](https://zenn.dev/naoki0722/articles/5b8bd8fdc22bb8)
- [mailhog/MailHog](https://github.com/mailhog/MailHog)
- [mailhog dockerhub](https://hub.docker.com/r/mailhog/mailhog/)
