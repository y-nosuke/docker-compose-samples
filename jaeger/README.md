# jeager

これはJeagerの Docker-Compose です。

## 事前準備

hostsファイルに`jeager.localhost`を登録します。
traefixによりリバースプロキシを利用するための設定です。

```
# Windwos
# C:\Windows\System32\drivers\etc\hosts
# explorer "C:\Windows\System32\drivers\etc"
127.0.0.1 jeager.localhost
```

## 管理画面

- [管理画面](http://jeager.localhost/)

## 参考

- [How to deploy Jaeger and Elasticsearch.](https://faun.pub/how-to-deploy-jaeger-and-elasticsearch-bf326e774cc8)
