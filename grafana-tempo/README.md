# grafana-tempo

これは grafana-tempo の Docker-Compose です。

## Tempo のアーキテクチャ

Tempo は分散トレーシングバックエンドで、以下のコンポーネントで構成されます。

![アーキテクチャ](https://grafana.com/media/docs/tempo/tempo_arch.png)

### コアコンポーネント（必須）

1. **Distributor**: トレース受信と分散（Jaeger、Zipkin、OTLP、OpenCensus などのプロトコルをサポート）
2. **Querier**: トレースクエリ実行
3. **Query-frontend**: クエリの前処理（分割、キャッシュ、レート制限）

### インジェスト方法の選択（必須、どちらか一方を選択）

**Kafkaを使わない場合（デフォルト）**:

- **Ingester**: トレースをメモリに保持し、定期的にブロックとして書き込み

**Kafkaを使う場合（分散アーキテクチャ）**:

- **Ingest**: Kafkaからトレースを読み取る
- **Block Builder**: Kafkaから読み取ったトレースをブロック形式に変換

### コンパクション処理の選択（必須、どちらか一方を選択）

**従来のアーキテクチャ**:

- **Compactor**: ブロックの圧縮と最適化

**新しい分散アーキテクチャ**:

- **Backend-scheduler**: コンパクションとリテンションのジョブをスケジューリング
- **Backend-worker**: スケジューラーから割り当てられたジョブを実行

**注意**: `backend_scheduler`と`backend_worker`はCompactorの機能を分散化して実行します。スケジューラーはジョブのスケジューリングと追跡を担当し、ワーカーは実際のコンパクションとリテンション処理を実行します。この新しいアーキテクチャは、決定性の向上と重複の削除を目的としています。

### オプションコンポーネント

- **Metrics-generator**: トレースから Prometheus メトリクスを生成（service-graphs、span-metrics など）

## Tempo のデプロイモード

Tempo は **モノリシックモード** と **マイクロサービスモード** の 2 種類でデプロイできます。モノリシックには水平スケールする **スケーラブル・モノリシックモード** もあります。モードはランタイム設定の `target` または `-target` フラグで指定します。

参照: [Monolithic and microservices modes \| Grafana Tempo](https://grafana.com/docs/tempo/latest/set-up-for-tracing/setup-tempo/plan/deployment-modes/)

### モノリシックモード（Monolithic mode）

![モノリシックモード](https://grafana.com/media/docs/tempo/architecture/tempo-TempoSingleBinary-arch.png)

- **指定**: `-target=all`（デフォルト）
- **以前の呼び方**: シングルバイナリモード（single binary mode）

1 プロセスで全コンポーネント（取り込み・保存・コンパクト・クエリ）を実行します。小〜中程度のトレース量向けで構成がシンプルです。トレース量が増え続けるとリソース不足や OOM のリスクがあるため、大規模・本番ではスケーラブル・モノリシックまたはマイクロサービスモードを検討します。

**例**: [tempo/example/docker-compose](https://github.com/grafana/tempo/tree/main/example/docker-compose)

### スケーラブル・モノリシックモード（Scaling monolithic mode）

- **指定**: 各プロセスで `-target=scalable-single-binary`
- **以前の呼び方**: スケーラブル・シングルバイナリモード（scalable single binary mode）

各プロセスはモノリシックと同様に全コンポーネントを実行しつつ、**複数プロセスを立てて水平スケール**します。Querier は **`frontend_address` を DNS で解決**し、その DNS レコードに含まれる複数アドレスに接続して振り分けます（Nginx などのロードバランサは必須ではありません）。フルマイクロサービスより設定が簡単で、ある程度のスケールと冗長性を取れる中間的な選択肢です。

**例**: [tempo/example/docker-compose/scalable-single-binary](https://github.com/grafana/tempo/tree/main/example/docker-compose/scalable-single-binary)

### マイクロサービスモード（Microservices mode）

![マイクロサービスモード](https://grafana.com/media/docs/tempo/architecture/tempo-TempoMicroservices-arch.png)

- **指定**: コンポーネントごとに `-target=querier` や `-target=ingester` などを指定

各コンポーネントを別プロセスでデプロイし、コンポーネント単位でレプリカ数を変えてスケールできます。レプリケーションにより耐障害性が高く、本番・大規模向けの推奨形態ですが、構成・運用は最も複雑です。tempo-distributed Helm Chart のデフォルトはこのモードです。

**例**: [tempo/example/docker-compose/distributed](https://github.com/grafana/tempo/tree/main/example/docker-compose/distributed)

### デプロイモードの選択目安

| モード                     | 用途の目安               | 複雑さ | スケール・耐障害性       |
| -------------------------- | ------------------------ | ------ | ------------------------ |
| モノリシック               | 開発・PoC・小規模        | 低     | 1 プロセス、限定的       |
| スケーラブル・モノリシック | 中規模、スケールの過渡期 | 中     | 水平スケール・冗長性あり |
| マイクロサービス           | 本番・大規模・高可用性   | 高     | コンポーネント単位で柔軟 |

## Ingester と Kafka + Ingest の使い分け

Tempo には、トレースのインジェスト方法として2つのアーキテクチャがあります。

### Kafka を使わない場合（デフォルト）

**アーキテクチャ**:

```text
Distributor → Ingester → オブジェクトストレージ
```

**設定**:

- `ingester`: 必須（Distributorから直接トレースを受信）
- `ingest` と `block_builder`: 不要

**特徴**:

- シンプルな構成で、Kafka の運用が不要
- 小規模から中規模のデプロイメントに適している
- Distributor から直接 Ingester にトレースを送信

**設定例**:

```yaml
distributor:
  receivers:
    otlp:
      protocols:
        grpc:
          endpoint: "tempo:4317"

ingester:
  max_block_duration: 5m
```

### Kafka を使う場合（分散アーキテクチャ）

**アーキテクチャ**:

```text
Distributor → Kafka → Ingest → Block Builder → オブジェクトストレージ
```

**設定**:

- `distributor.ingester_write_path_enabled`: `false`
- `distributor.kafka_write_path_enabled`: `true`
- `ingest`: 必須（Kafkaからトレースを読み取る）
- `block_builder`: 必須（Kafkaから読み取ったトレースをブロック形式に変換）
- `ingester`: 不要（Kafka経由の場合は使用しない）

**特徴**:

- 高スループットとスケーラビリティに優れる
- Kafka によるバッファリングで、Ingester の負荷を分散
- 大規模なデプロイメントに適している
- Kafka の運用が必要

**設定例**:

```yaml
distributor:
  ingester_write_path_enabled: false
  kafka_write_path_enabled: true
  receivers:
    otlp:
      protocols:
        grpc:
          endpoint: "tempo:4317"

ingest:
  enabled: true
  kafka:
    address: redpanda:9092
    topic: tempo-ingest

block_builder:
  consume_cycle_duration: 30s
```

**注意**: `ingest` と `block_builder` の設定は公式ドキュメント（<https://grafana.com/docs/tempo/latest/configuration/>）に記載されていませんが、公式の分散アーキテクチャサンプル（<https://github.com/grafana/tempo/blob/main/example/docker-compose/distributed/tempo.yaml>）で使用されています。>

## Compactor と Backend Scheduler/Worker の使い分け

- **Compactor**: 従来のアーキテクチャ（Kafka の有無に関係なく使用可能）
- **Backend Scheduler + Backend Worker**: 新しい分散アーキテクチャ（Compactor の将来の置き換え予定）

## ストレージを使用するコンポーネント一覧

### オブジェクトストレージ（S3）を使用するコンポーネント

1. **`storage.trace.backend: s3`**（トレースブロック）
   - 用途: トレースデータのブロック
   - バケット: `tempo-blocks`（設定ファイルで指定）
   - 状態: 設定ファイルにより異なる（`grafana/docker/resources/tempo/config.yaml` では S3 を使用）

### ローカルストレージ（ファイルシステム）を使用するコンポーネント

1. **`storage.trace.wal.path`**（WAL - Write-Ahead Log）
   - 用途: 受信したトレースを一時的に保存（クラッシュ時の復旧用）
   - 場所: `/tmp/tempo/wal`（デフォルト設定）
   - 特徴: ローカルディスクのみ（オブジェクトストレージではない）
   - 状態: 設定済み

2. **`storage.trace.local.path`**（トレースブロック - ローカルモード）
   - 用途: トレースデータのブロック（ローカルストレージモード時）
   - 場所: `/tmp/tempo/blocks`（デフォルト設定）
   - 特徴: ローカルディスク（S3 を使用しない場合）
   - 状態: 設定済み（`grafana-tempo/docker/resources/tempo/tempo.yaml` では local バックエンドを使用）

3. **`metrics_generator.storage.path`**（メトリクスジェネレータ WAL）
   - 用途: メトリクスジェネレータが生成するメトリクスの WAL
   - 場所: `/tmp/tempo/generator/wal`（デフォルト設定）または `/var/tempo/generator/wal`（S3 モード時）
   - 特徴: ローカルディスクのみ
   - 状態: 設定済み

4. **`metrics_generator.traces_storage.path`**（メトリクスジェネレータトレースストレージ）
   - 用途: メトリクス生成に必要なトレースデータの一時保存
   - 場所: `/var/tempo/generator/traces`（S3 モード時）
   - 特徴: ローカルディスク（メトリクス生成処理用）
   - 状態: 設定済み（S3 モード時）

## まとめ表

| コンポーネント                          | ストレージタイプ | 用途                               | 共有が必要？ |
| --------------------------------------- | ---------------- | ---------------------------------- | ------------ |
| `storage.trace.backend: s3`             | S3               | トレースブロック                   | ✅ はい      |
| `storage.trace.wal.path`                | ローカル         | WAL（一時保存）                    | ❌ いいえ    |
| `storage.trace.local.path`              | ローカル         | トレースブロック（ローカルモード） | ❌ いいえ    |
| `metrics_generator.storage.path`        | ローカル         | メトリクスジェネレータ WAL         | ❌ いいえ    |
| `metrics_generator.traces_storage.path` | ローカル         | メトリクス生成用トレース           | ❌ いいえ    |

オブジェクトストレージ（S3）を使用するのはトレースブロックのみで、これは複数インスタンス間で共有する必要があります。ローカルストレージは各インスタンスごとに独立して使用されます。

## 管理画面

- [grafana](http://grafana.localhost/)
- [redpanda-console](http://redpanda-console.localhost/)
- [minio](http://minio.localhost/)

## 参考

- [grafana/tempo](https://github.com/grafana/tempo)
  - [tempo/example/docker-compose/local](https://github.com/grafana/tempo/blob/main/example/docker-compose/local)
- [Tempo - Deployment modes（モノリシック / マイクロサービス）](https://grafana.com/docs/tempo/latest/set-up-for-tracing/setup-tempo/plan/deployment-modes/)
