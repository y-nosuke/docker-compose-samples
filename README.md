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

[[全編無料]TraefikとDnsmasqでDockerのWeb開発環境(TLSとSMTPもあるよ)もうポート番号割り当てで悩まない](https://zenn.dev/arkbig/books/devbase-2022_b1b24e6e8db350a1f7f379af3833e90d79ad5)
[[DevBase]TraefikとDnsmasqでDockerのWeb開発環境(TLSとSMTPもあるよ)もうポート番号割り当てで悩まない](https://zenn.dev/arkbig/articles/devbase_b8b43191f863f8024a83f824c832f8ca0e5d209254)
