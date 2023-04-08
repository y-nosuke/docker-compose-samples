# traefik

これはtraefikの Docker-Compose です。

## 実行

```bash
$ curl -H whoami.localhost http://whoami.localhost/
Hostname: d65931067b4c
IP: 127.0.0.1
IP: 172.22.0.2
RemoteAddr: 172.22.0.3:35820
GET / HTTP/1.1
Host: whoami.localhost
User-Agent: curl/7.88.1
Accept: */*
Accept-Encoding: gzip
X-Forwarded-For: 172.22.0.1
X-Forwarded-Host: whoami.localhost
X-Forwarded-Port: 80
X-Forwarded-Proto: http
X-Forwarded-Server: 9fb64ad7849c
X-Real-Ip: 172.22.0.1
```

- [dashboard](http://localhost:8080/dashboard/#/)

## 参考

- [traefik.io](https://traefik.io/)
  - [Docker-compose basic example](https://doc.traefik.io/traefik/user-guides/docker-compose/basic-example/)
- [dockerhub dockerhub](https://hub.docker.com/_/traefik)
