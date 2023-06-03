# nexus

これはNexusの Docker-Compose です。

## 事前準備

hostsファイルに`nexus.localhost`を登録します。
traefixによりリバースプロキシを利用するための設定です。

```
# Windwos
# C:\Windows\System32\drivers\etc\hosts
# explorer "C:\Windows\System32\drivers\etc"
127.0.0.1 nexus.localhost
```

## 管理画面

- [管理画面](http://nexus.localhost/)

## 参考

- [sonatype/docker-nexus3](https://hub.docker.com/r/sonatype/docker-nexus3/)
