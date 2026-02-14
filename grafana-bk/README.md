# grafana

これはgrafanaの Docker-Compose です。

## 事前準備

```bash
sudo chmod -R 777 docker/volumes/otel-collector
```

## 管理画面

- [grafana](http://grafana.localhost/)

## datasource import

```sh
curl -s "http://grafana.localhost/api/datasources"
```

## 参考

TODO 後で整理する

- <https://github.com/grafana/mimir/blob/main/docs/sources/mimir/get-started/play-with-grafana-mimir/docker-compose.yml>
- <https://github.com/jaegertracing/jaeger/tree/main/docker-compose>
- <https://www.jaegertracing.io/docs/2.13/storage/badger/>
- <https://github.com/jaegertracing/jaeger/blob/v2.13.0/cmd/jaeger/config-badger.yaml>
