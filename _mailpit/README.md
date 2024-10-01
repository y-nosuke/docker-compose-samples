# mailpit

これはMailpitの Docker-Compose です。

## 事前準備

hostsファイルに`mailpit.localhost`を登録します。
traefixによりリバースプロキシを利用するための設定です。

```sh
# Windwos
# C:\Windows\System32\drivers\etc\hosts
# explorer "C:\Windows\System32\drivers\etc"
127.0.0.1 mailpit.localhost
```

## 管理画面

- [管理画面](http://mailpit.localhost/)

## 参考

- [mailpitでメール送信のテストをする with Go](https://zenn.dev/ispec_inc/articles/mailpit-introduction)
