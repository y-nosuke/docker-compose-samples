# minio

これはlocalstackの Docker-Compose です。

## 事前準備

```sh
brew install minio/stable/mc
```

## 実行

```sh
mc config host add myminio http://localhost:9000 minio minio123

mc mb sample/test
mc ls sample
mc cp test.txt sample/test
mc rm sample/test/test.txt
mc rb sample/test
```

## 参考

- [Minio](https://min.io/)

- [localstack/localstack](S3互換のminioをdocker-composeで起動(今更))
