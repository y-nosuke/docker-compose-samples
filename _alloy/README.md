# alloy

これはGrafana Alloyの Docker-Compose です。

## 事前準備

hostsファイルに`alloy.localhost`を登録します。
traefixによりリバースプロキシを利用するための設定です。

```sh
# Windows
# C:\Windows\System32\drivers\etc\hosts
# explorer "C:\Windows\System32\drivers\etc"
127.0.0.1 alloy.localhost
```

## 管理画面

- [管理画面](http://alloy.localhost/)

## 参考

- [Docker Monitoring with Grafana Alloy](https://github.com/grafana/alloy-scenarios/blob/main/docker-monitoring/README.md)
