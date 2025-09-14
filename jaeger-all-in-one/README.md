# jaeger-all-in-one

これはjaeger all-in-oneの Docker-Compose です。

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

- [Getting Started Get up and running with Jaeger in your local environment](https://www.jaegertracing.io/docs/latest/getting-started/)
- [Span Storage Backends](https://www.jaegertracing.io/docs/latest/deployment/#span-storage-backends)
- [dockerhub jaegertracing/all-in-one](https://hub.docker.com/r/jaegertracing/all-in-one)
- [github jaegertracing/jaeger](https://github.com/jaegertracing/jaeger)
