# docker-compose-samples

## 事前準備

```sh
# 作成
docker network create --driver bridge docker_compose_samples

$ docker network ls
NETWORK ID     NAME                         DRIVER    SCOPE
505e6f85d1f9   bridge                       bridge    local
5dc3869b4e3d   docker_compose_samples       bridge    local
a161a3b94116   host                         host      local
6d6b7566f03e   none                         null      local

# 削除
docker network rm docker_compose_samples
```

## 起動

```sh
docker compose up -d
```

## 停止

```sh
# 停止＆削除（コンテナ・ネットワーク）
docker compose down

# 停止＆削除（コンテナ・ネットワーク・イメージ）
docker compose down --rmi all
```

## プロセス確認

```sh
docker compose ps
```

## ログ確認

```sh
docker-compose logs -f
```

