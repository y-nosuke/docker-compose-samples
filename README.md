# docker-compose-samples

## 起動

```
docker-compose up -d
```

## 停止

```
# 停止＆削除（コンテナ・ネットワーク）
docker-compose down

# 停止＆削除（コンテナ・ネットワーク・イメージ）
docker-compose down --rmi all
```

## プロセス確認

```
docker-compose ps
```

## ログ確認

```
docker-compose logs -f
```

