# grafana-loki

これはgrafana-lokiの Docker-Compose です。

## 管理画面

- [grafana](http://grafana.localhost/)

## datasource import

```sh
curl -s "http://grafana.localhost/api/datasources"
```

## 参考

- [Install Grafana Loki with Docker or Docker Compose](https://grafana.com/docs/loki/latest/installation/docker/)
- [grafana/loki](https://github.com/grafana/loki)
  - [loki/production](https://github.com/grafana/loki/tree/main/production)
    - [loki/production/docker](https://github.com/grafana/loki/tree/main/production/docker)
- [Loki - Promtail & Grafana for System Logs.](https://mpolinowski.github.io/docs/DevOps/Provisioning/2021-04-07--loki-prometheus-grafana/2021-04-07/)
- [How to Export/Import Datasource on Grafana?](https://medium.com/@slimaine.bensadoun/how-to-export-import-datasource-on-grafana-ded1cc49a154)
