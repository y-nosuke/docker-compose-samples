# prometheus

これはprometheusの Docker-Compose です。

## 事前準備

hostsファイルに`prometheus.localhost`を登録します。
traefixによりリバースプロキシを利用するための設定です。

```
# Windwos
# C:\Windows\System32\drivers\etc\hosts
127.0.0.1 prometheus.localhost
127.0.0.1 alertmanager.localhost
127.0.0.1 grafana.localhost
127.0.0.1 node-exporter.localhost
127.0.0.1 mailhog.localhost
```

## 管理画面

- [prometheus](http://prometheus.localhost/)
- [alertmanager](http://alertmanager.localhost/)
- [grafana](http://grafana.localhost/)
- [node-exporter](node-exporter.localhost)


## 動作確認

```
docker container stop node-exporter
```

## 参考

- [DockerでPrometheus, Grafana, Alertmanagerを動かす](https://qiita.com/samskeyti/items/fbe8b78e47a5e4d6842a)
