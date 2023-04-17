# postgresql

これはPostgreSQLの Docker-Compose です。

## 事前準備

hostsファイルに`adminer.localhost`を登録します。
traefixによりリバースプロキシを利用するための設定です。

```
# Windwos
# C:\Windows\System32\drivers\etc\hosts
127.0.0.1 adminer.localhost
```

## 管理画面

- [adminer](http://adminer.localhost/)

## 参考

- [postgres dockerhub](https://hub.docker.com/_/postgres)
- [adminer dockerhub](https://hub.docker.com/_/adminer/)
