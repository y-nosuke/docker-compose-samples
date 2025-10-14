# otel-collector-original

## ツールインストール

```sh
go install go.opentelemetry.io/collector/cmd/builder@latest

builder version
```

## 事前準備

```sh
direnv edit .

export AWS_ACCESS_KEY_ID=(Access key ID)
export AWS_SECRET_ACCESS_KEY=(Secret access key)
export AWS_DEFAULT_REGION=ap-northeast-1

export AWS_ACCOUNT_ALIAS=kkt-stg
export BUSINESS_NAME=common
export APPLICATION_NAME=otel-collector
export AWS_ACCOUNT_ID=887305654557
export CONTAINER_REGISTRY=${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com
export CONTAINER_IMAGE_NAME=${AWS_ACCOUNT_ALIAS//kkt-/}-${BUSINESS_NAME}-${APPLICATION_NAME}
export CONTAINER_IMAGE_URL=${CONTAINER_REGISTRY}/${CONTAINER_IMAGE_NAME}
```

## ビルド

```sh
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin ${CONTAINER_REGISTRY}

export CONTAINER_IMAGE_TAG=release-99999999-v1.rls.stg.20250812000000.xxxxxx1  # リリースバージョン、日付は適切なものを指定すること
docker buildx build --push --platform linux/amd64 --provenance=false -t ${CONTAINER_IMAGE_URL}:${CONTAINER_IMAGE_TAG} .
```

### コードと実行ファイルの生成のみの場合（しなくてもOK）

```sh
ocb --config builder-config.yaml

# コンポーネント一覧の確認
./otelcol/otel-collector components

# ヘルプの表示
./otelcol/otel-collector --help
```

## 参考

- [カスタムコレクターの構築](https://opentelemetry.io/ja/docs/collector/custom-collector/)
- [OpenTelemetry Collector の中身と種類を知ろう](https://aws.amazon.com/jp/builders-flash/202503/opentelemetry-collector/)
- [open-telemetry/opentelemetry-collector](https://github.com/open-telemetry/opentelemetry-collector)
  - [builder](https://github.com/open-telemetry/opentelemetry-collector/tree/main/cmd/builder)
- [open-telemetry/opentelemetry-collector-contrib](https://github.com/open-telemetry/opentelemetry-collector-contrib)
- [open-telemetry/opentelemetry-collector-releases](https://github.com/open-telemetry/opentelemetry-collector-releases)
  - [otelcol-contrib](https://github.com/open-telemetry/opentelemetry-collector-releases/tree/main/distributions/otelcol-contrib)
    - [manifest.yaml](https://github.com/open-telemetry/opentelemetry-collector-releases/blob/main/distributions/otelcol-contrib/manifest.yaml)
- [x-ray](https://aws-otel.github.io/docs/getting-started/x-ray)
