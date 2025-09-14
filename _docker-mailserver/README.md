# docker-mailserver

これはdocker-mailserverの Docker-Compose です。

## 事前準備

hostsファイルに`mailserver.localhost`を登録します。
traefixによりリバースプロキシを利用するための設定です。

```bash
# Windows
# C:\Windows\System32\drivers\etc\hosts
127.0.0.1 mailserver.localhost
```

## 管理画面

- [mailserver](http://mailserver.localhost/)

## 参考

- [docker-mailserverをさくっと立ち上げる(令和4年2月版)](https://zenn.dev/takaha/articles/docker-mailserver)
- [Docker Mailserver](https://docker-mailserver.github.io/docker-mailserver/latest/)
- [docker-mailserver/docker-mailserver](https://github.com/docker-mailserver/docker-mailserver)
