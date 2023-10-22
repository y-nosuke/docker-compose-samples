# localstack

これはlocalstackの Docker-Compose です。

## 事前準備

```sh
sudo apt install -y python3-pip
pip install awscli-local
```

### bash

```sh
vi .bashrc
complete -C $(which aws_completer) aws
complete -C $(which aws_completer) awslocal
```

### zsh

```sh
vi .zshrc
autoload bashcompinit && bashcompinit
autoload -Uz compinit && compinit

complete -C $(which aws_completer) aws
complete -C $(which aws_completer) awslocal
```

- [Command completion](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-completion.html)

## 実行

### S3

```sh
aws s3 mb s3://localstack-bucket --endpoint-url=http://localhost:4566
awslocal s3 mb s3://localstack-bucket

aws s3 ls --endpoint-url=http://localhost:4566
awslocal s3 ls
awslocal s3 ls s3://localstack-bucket/file.txt
```

### sqs

```sh
# queue作成
awslocal sqs create-queue --queue-name localstack-sqs --region ap-northeast-1

# queue確認
awslocal sqs list-queues --region ap-northeast-1
awslocal sqs get-queue-url --queue-name localstack-sqs --region ap-northeast-1
awslocal sqs get-queue-attributes --queue-url http://localhost:4566/000000000000/localstack-sqs --region ap-northeast-1 --attribute-names All

# メッセージ送信
awslocal sqs send-message --queue-url http://localhost:4566/000000000000/localstack-sqs --message-body "hello sqs" --region ap-northeast-1

# メッセージ数確認
awslocal sqs get-queue-attributes --queue-url http://localhost:4566/000000000000/localstack-sqs --attribute-names ApproximateNumberOfMessages --query 'Attributes.ApproximateNumberOfMessages' --region ap-northeast-1

# メッセージ消費
awslocal sqs receive-message --queue-url http://localhost:4566/000000000000/localstack-sqs --region ap-northeast-1

# メッセージ削除
awslocal sqs delete-message --queue-url http://localhost:4566/000000000000/localstack-sqs --receipt-handle "XXXX.....XXXXX" --region ap-northeast-1

# queue削除
awslocal sqs delete-queue --queue-url http://localhost:4566/000000000000/localstack-sqs --region ap-northeast-1
```

- [AWS CLI Command Reference sqs](https://docs.aws.amazon.com/cli/latest/reference/sqs/)
- [LocalStack を用いたAWS SQS動作確認方法メモ](https://qiita.com/KWS_0901/items/bb0d3c8319cbb1e64217)

## 参考

- [LocalStack](https://docs.localstack.cloud/overview/)
- [localstack/localstack](https://github.com/localstack/localstack)
- [localstack/awscli-local](https://github.com/localstack/awscli-local)
- [localstack/localstack dockerhub](https://hub.docker.com/r/localstack/localstack)
- [localStack Cockpit](https://localstack.cloud/products/cockpit/)
- [【AWS】LocalStackを使ってみる](https://qiita.com/Shoma0210/items/258e8422d5341160624b)
