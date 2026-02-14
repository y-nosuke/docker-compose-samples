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

- [How to Export/Import Datasource on Grafana?](https://medium.com/@slimaine.bensadoun/how-to-export-import-datasource-on-grafana-ded1cc49a154)
