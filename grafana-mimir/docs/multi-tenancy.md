# multi-tenancy

## 動作確認

```sh
docker run -it --rm --entrypoint=sh --network=docker_compose_samples curlimages/curl

# Mimirのヘルスチェック
curl http://mimir-lb:9009/ready

# Overrides-exporterのメトリクスを確認
curl -s http://mimir-lb:9009/metrics | grep cortex_limits_overrides | sort

# Productionテナントにテストメトリクスを送信
curl -X POST \
  -H "X-Scope-OrgID: production" \
  -H "Content-Type: application/x-protobuf" \
  "http://mimir-lb:9009/api/v1/push" \
  -d 'test_metric_production 1'

curl -X POST \
  -H "X-Scope-OrgID: staging" \
  -H "Content-Type: application/x-protobuf" \
  "http://mimir-lb:9009/api/v1/push" \
  -d 'test_metric_staging 2'

curl -G \
  -H "X-Scope-OrgID: production" \
  "http://mimir-lb:9009/prometheus/api/v1/query" \
  --data-urlencode 'query=up'
```

## alertmanager

```sh
brew install mimirtool

# mimirtoolで設定をロード
mimirtool alertmanager load \
  --address=http://localhost:9009 \
  --id=customer-enterprise-001 \
  docker/resources/mimir/tenant-alertmanager-config-example.yaml

# 設定が正しくロードされたか確認
mimirtool alertmanager get \
  --address=http://localhost:9009 \
  --id=customer-enterprise-001
```
