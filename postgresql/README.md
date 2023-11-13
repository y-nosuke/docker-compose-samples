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

## triggerを使いたい場合

以下を追加する。

```yml
services:
  mysql:

    ・・・

    # TRIGGER作成のために必要
    command: [ "--log_bin_trust_function_creators=1" ]
```

## 管理画面

- [adminer](http://adminer.localhost/)

## 参考

- [postgres dockerhub](https://hub.docker.com/_/postgres)
- [adminer dockerhub](https://hub.docker.com/_/adminer/)
