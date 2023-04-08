# localstack

これはlocalstackの Docker-Compose です。

## 事前準備

```sh
sudo apt install -y python3-pip
pip install awscli-local

which aws_completer
vi .bashrc
complete -C '/home/linuxbrew/.linuxbrew/bin/aws_completer' aws
complete -C '/home/linuxbrew/.linuxbrew/bin/aws_completer' awslocal
```

## 実行

```sh
# S3
aws s3 mb s3://localstack-bucket --endpoint-url=http://localhost:4566
awslocal s3 mb s3://localstack-bucket

aws s3 ls --endpoint-url=http://localhost:4566
awslocal s3 ls

# sqs
awslocal sqs create-queue --queue-name localstack-sqs
awslocal sqs list-queues
```

## 参考

- [LocalStack](https://docs.localstack.cloud/overview/)
- [localstack/localstack](https://github.com/localstack/localstack)
- [localstack/awscli-local](https://github.com/localstack/awscli-local)
- [localStack Cockpit](https://localstack.cloud/products/cockpit/)
- [【AWS】LocalStackを使ってみる](https://qiita.com/Shoma0210/items/258e8422d5341160624b)
