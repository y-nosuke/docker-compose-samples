# jeager-all-in-one

これはJeager all-in-oneの Docker-Compose です。

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

- [Getting Started Get up and running with Jaeger in your local environment](https://www.jaegertracing.io/docs/latest/getting-started/)
- [dockerhub jaegertracing/all-in-one](https://hub.docker.com/r/jaegertracing/all-in-one)
- [github jaegertracing/jaeger](https://github.com/jaegertracing/jaeger)
