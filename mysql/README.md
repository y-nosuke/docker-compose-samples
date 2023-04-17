# mysql

これはMySQLの Docker-Compose です。

## 事前準備

hostsファイルに`phpmyadmin.localhost`を登録します。
traefixによりリバースプロキシを利用するための設定です。

```
# Windwos
# C:\Windows\System32\drivers\etc\hosts
127.0.0.1 phpmyadmin.localhost
```

## 管理画面

- [phpmyadmin](http://phpmyadmin.localhost/)

## 参考

- [postgres dockerhub](https://hub.docker.com/_/mysql)
- [phpmyadmin dockerhub](https://hub.docker.com/_/phpmyadmin/)
