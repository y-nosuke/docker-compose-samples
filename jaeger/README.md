# jaeger

これはjaegerの Docker-Compose です。

## 事前準備

hostsファイルに`jaeger.localhost`を登録します。
traefixによりリバースプロキシを利用するための設定です。

```bash
# Windows
# C:\Windows\System32\drivers\etc\hosts
# explorer "C:\Windows\System32\drivers\etc"
127.0.0.1 jaeger.localhost
```

## 管理画面

- [管理画面](http://jaeger.localhost/)

## 参考

- [How to deploy Jaeger and Elasticsearch.](https://faun.pub/how-to-deploy-jaeger-and-elasticsearch-bf326e774cc8)
