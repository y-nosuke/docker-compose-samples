# zipkin

これはZipkinの Docker-Compose です。

## 事前準備

hostsファイルに`zipkin.localhost`を登録します。
traefixによりリバースプロキシを利用するための設定です。

```sh
# Windwos
# C:\Windows\System32\drivers\etc\hosts
# explorer "C:\Windows\System32\drivers\etc"
127.0.0.1 zipkin.localhost
```

## 管理画面

- [管理画面](http://zipkin.localhost/)

## 参考

- [openzipkin/zipkin](https://github.com/openzipkin/zipkin)
- [OpenTelemetry Collectorでデータを一元的に管理する](https://christina04.hatenablog.com/entry/opentelemetry-collector)
