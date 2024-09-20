# otel-collector

これはotel-collectorの Docker-Compose です。

## 事前準備

hostsファイルに`otel-collector.localhost`を登録します。
traefixによりリバースプロキシを利用するための設定です。

```sh
# Windwos
# C:\Windows\System32\drivers\etc\hosts
# explorer "C:\Windows\System32\drivers\etc"
127.0.0.1 otel-collector.localhost
```

## 参考

- [Quick start](https://opentelemetry.io/docs/collector/quick-start/)
- [Install the Collector](https://opentelemetry.io/docs/collector/installation/)

- [dockerhub otel/opentelemetry-collector](https://hub.docker.com/r/otel/opentelemetry-collector)・・・コア機能のみを含むシンプルで安定したOpenTelemetry Collector
- [dockerhub otel/opentelemetry-collector-contrib](https://hub.docker.com/r/otel/opentelemetry-collector-contrib)・・・コア機能に加えて、コミュニティによる追加コンポーネントを含む拡張バージョン
