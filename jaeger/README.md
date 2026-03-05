# jaeger

これは Jaeger の Docker Compose です。単一コンテナで all-in-one として動作します。

## Jaeger のアーキテクチャ

Jaeger v2 は単一バイナリで提供され、設定に応じて異なるロールで動作します。OpenTelemetry Collector フレームワーク上に構築されています。

参照: [Architecture \| Jaeger](https://www.jaegertracing.io/docs/latest/architecture/)

### ロール（役割）

1. **agent**: アプリケーションのホストエージェントまたはサイドカーとして動作し、トレースデータを collector に転送。Jaeger でもこのロールは可能だが、他のテレメトリ（メトリクス・ログ）も扱う場合は **OpenTelemetry Collector** の利用が推奨される。
2. **collector**: アプリケーションからトレースデータを受信し、ストレージバックエンドに書き込む。
3. **query**: トレースの検索・可視化のための API と UI を提供。
4. **ingester**: Kafka からスパンを読み取り、ストレージバックエンドに書き込む。collector–Kafka–ingester の構成で利用。
5. **all-in-one**: collector と query を 1 プロセスで実行（開発・検証向けの簡易構成）。

### アーキテクチャの選択（スケーラブルなバックエンド）

スケーラブルな Jaeger バックエンドの代表的な構成は次の 2 つです。

**ストレージ直書き（Direct to storage）**:

- collector がアプリからデータを受信し、**ストレージに直接書き込む**。
- ストレージが平均・ピーク両方のトラフィックを処理できる必要がある。
- 短期的なピークはメモリキューで吸収できるが、持続的な負荷でストレージが追いつかないとデータロスが発生しうる。

**Kafka 経由（Via Kafka）**:

- collector とストレージの間に **Kafka を置き、永続キューとして利用**する。
- collector は Kafka エクスポーターで Kafka に書き込み、**ingester** が Kafka から読み取ってストレージに保存。
- データロスを抑えやすく、ingester を複数立ててスケール可能（負荷は自動で分散される）。

### Jaeger バイナリの構成

Jaeger バイナリは OpenTelemetry Collector 上にあり、Jaeger 固有のコンポーネント（Jaeger Storage Exporter、Jaeger Query Extension など）と、OTLP / Jaeger / Zipkin / Kafka などのレシーバー・エクスポーターを組み合わせて利用します。プロトコルとしては OTLP（gRPC/HTTP）、Jaeger（gRPC/Thrift）、Zipkin、Kafka などをサポートします。

## Jaeger のデプロイモード

Jaeger は単一バイナリ・単一コンテナイメージで提供され、**ロール**（all-in-one / collector / query / ingester）の組み合わせでデプロイ形態が変わります。

参照: [Deployment \| Jaeger](https://www.jaegertracing.io/docs/latest/deployment/)

### all-in-one（オールインワン）

- **役割**: 1 プロセスで **collector と query** を実行。
- **ストレージ**: メモリ（再起動でデータ消失）、または [Badger](https://www.jaegertracing.io/docs/latest/storage/badger/) などのローカルストレージ。

開発・テスト向けで構成が簡単です。メモリストレージは本番非推奨です。Badger を使う all-in-one は本番も可能だが、**単一インスタンスに限定**され水平スケールできないため、トレース量が中程度まで向きです。

**例**: 本リポジトリの `jaeger/compose.yml`（単一コンテナで OTLP 受信・UI 提供）

### collector / query 分離（マイクロサービス構成）

- **役割**: **collector** と **query** を別プロセス（別コンテナ）でデプロイ。
- **ストレージ**: Elasticsearch、Cassandra、Kafka+ingester など外部ストレージを利用。

読み取り（query）と書き込み（collector）のトラフィックを分離でき、それぞれ独立してレプリカ数を変えてスケールできます。本番・中〜大規模向けの推奨形態です。

**例**: 本リポジトリの `jaeger-bk/compose.yml`（collector / query / Elasticsearch 分離の例）

### Kafka + ingester 構成

- **役割**: collector → **Kafka** → **ingester** → ストレージ。collector は Kafka に書き込み、ingester が Kafka から読み出してストレージに保存。
- **用途**: 高スループット・データロス削減・ingester の水平スケールが必要な場合。

### デプロイモードの選択目安

| モード               | 用途の目安           | 複雑さ | スケール・耐障害性             |
| -------------------- | -------------------- | ------ | ------------------------------ |
| all-in-one（メモリ） | 開発・検証のみ       | 低     | 1 プロセス、再起動でデータ消失 |
| all-in-one（Badger） | 小〜中規模・単一台   | 低     | 1 プロセス、水平スケール不可   |
| collector/query 分離 | 本番・中〜大規模     | 中〜高 | 読み書きを個別にスケール可能   |
| Kafka + ingester     | 本番・高スループット | 高     | キューで負荷分散・ロス低減     |

collector と query はステートレスなため、ストレージが許容すれば複数インスタンスを並列で稼働できます。

## 設定ファイルについて

**設定ファイルがなくても動きます。**

`jaegertracing/jaeger` イメージで `--config` を指定しない場合、バイナリに同梱された **all-in-one 用のビルトイン設定** が使われ、メモリストレージで collector と query が 1 プロセスで起動します。本リポジトリの `jaeger/compose.yml` は設定ファイルを渡していないため、このデフォルトで動作しています。

- **設定なしでよい場合**: 開発・検証で「とりあえず動かす」用途。
- **設定ファイルが必要な場合**: 本番運用、Badger/Elasticsearch 等のストレージ変更、Kafka 経由、レシーバー・プロセッサーのカスタムなど。Jaeger v2 の公式ドキュメントでは、こうした構成では `--config` で YAML を明示指定する運用が前提です。

参照: [Configuration \| Jaeger](https://www.jaegertracing.io/docs/latest/deployment/configuration/)

## SPM（Service Performance Monitoring）について

**SPM を利用する場合は設定が必要です。** 設定ファイルなしのデフォルト起動では SPM は使えません。

SPM は UI の「Monitor」タブで、サービス・オペレーション単位の RED メトリクス（Request rate、Error rate、Duration）を表示する機能です。次のいずれかの構成で、設定ファイル（`--config`）と UI 設定が必要になります。

### 構成の選択肢

1. **PromQL 互換バックエンド（Prometheus など）**
   - パイプラインに **SpanMetrics Connector** を追加し、スパンから RED メトリクスを生成。
   - メトリクスを Prometheus 等に出力し、`jaeger_storage` の `metric_backends` と `jaeger_query` でそのストアを参照。
   - 別途 Prometheus のデプロイと、Jaeger から Prometheus への接続設定が必要。
   - 例: [config-spm.yaml](https://github.com/jaegertracing/jaeger/blob/main/cmd/jaeger/config-spm.yaml)

2. **Elasticsearch / OpenSearch**
   - トレースストレージに ES/OpenSearch を使い、**metric_backends に同じストレージを指定**。SpanMetrics Connector は不要で、Query がストレージから直接メトリクスを計算。
   - 例: [config-spm-elasticsearch.yaml](https://github.com/jaegertracing/jaeger/blob/main/cmd/jaeger/config-spm-elasticsearch.yaml)

どちらの場合も、UI で Monitor タブを有効にするために **`monitor.menuEnabled: true`** を [Jaeger UI の設定](https://www.jaegertracing.io/docs/latest/deployment/frontend-ui/#monitor) に追加する必要があります。

### 本リポジトリの PromQL（Prometheus）構成

SPM 用の設定ファイルを用意してあり、`compose.yml` で読み込んでいます。

| ファイル                           | 説明                                                                                   |
| ---------------------------------- | -------------------------------------------------------------------------------------- |
| `docker/resources/config-spm.yaml` | SPM 用 Jaeger 設定（SpanMetrics Connector、Prometheus metric_backends、OTLP 受信など） |
| `docker/resources/config-ui.json`  | UI 設定（Monitor タブ有効化）                                                          |

**必要な環境**

- **Prometheus** が `docker_compose_samples` ネットワーク上で `prometheus` という名前で稼働していること。別ホストの場合は環境変数 `PROMETHEUS_ENDPOINT` で URL を指定（例: `http://host.docker.internal:9090`）。
- Prometheus が **Jaeger の 8889 ポート** を scrape していること。SpanMetrics がここで RED メトリクスを公開します。設定例は `docker/resources/prometheus-scrape-jaeger-spm.example.yml` を参照。

### Monitor が「No Data」のときの確認

SPM のデータは「トレース受信 → SpanMetrics がメトリクス生成 → Prometheus が scrape → Jaeger Query が Prometheus を参照」の経路で表示されます。次の順に確認してください。

| #   | 確認項目                                             | 調べ方                                                                                                                                                                                                                                             |
| --- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **トレースが Jaeger に届いているか**                 | Jaeger UI の **Search** タブで、サービスを選んでトレースがヒットするか。1 件もなければ SPM 用のメトリクスも出ない。                                                                                                                                |
| 2   | **Prometheus が Jaeger:8889 を scrape できているか** | Prometheus UI（例: `http://prometheus.localhost/targets`）で `jaeger-spanmetrics` の target が **UP** か。Jaeger と Prometheus が同一 Docker ネットワーク（`docker_compose_samples`）にいるかも確認。                                              |
| 3   | **Prometheus に SPM 用メトリクスが入っているか**     | Prometheus の **Graph** で `traces_span_metrics_calls_total` または `traces_span_metrics_duration_milliseconds_bucket` をクエリ。トレース送信後に増えていれば SpanMetrics は動いている。                                                           |
| 4   | **Jaeger Query が Prometheus に接続できているか**    | Jaeger コンテナのログで `result="err"` の `jaeger_metricstore_requests_total` が増えていないか。増えていれば Prometheus への接続失敗や認証エラー。`PROMETHEUS_ENDPOINT` が `http://prometheus:9090` で、同じネットワークから名前解決できるか確認。 |
| 5   | **時間範囲**                                         | Monitor タブの時間範囲に、トレースを送った時刻が含まれているか。                                                                                                                                                                                   |

**よくある原因**

- トレースを送っていない、または OTLP の送信先が Jaeger の 4317/4318 になっていない。
- Prometheus の `scrape_configs` に `jaeger-spanmetrics`（target: `jaeger:8889`）がない、またはネットワークが違う。
- Jaeger と Prometheus が別ネットワークで、`prometheus` で名前解決できない（`PROMETHEUS_ENDPOINT` のホスト名を確認）。

参照: [Service Performance Monitoring (SPM) \| Jaeger](https://www.jaegertracing.io/docs/latest/architecture/spm/)

## 事前準備

hostsファイルに`jaeger.localhost`を登録します。
traefixによりリバースプロキシを利用するための設定です。

```bash
# Windows
# C:\Windows\System32\drivers\etc\hosts
# explorer "C:\Windows\System32\drivers\etc"
127.0.0.1 jaeger.localhost
```

## 管理画面

- [管理画面](http://jaeger.localhost/)

## 参考

- [Jaeger](https://www.jaegertracing.io/)
  - [Getting Started](https://www.jaegertracing.io/docs/latest/getting-started/)
  - [Architecture](https://www.jaegertracing.io/docs/latest/architecture/)
  - [Deployment](https://www.jaegertracing.io/docs/latest/deployment/)
    - [Configuration](https://www.jaegertracing.io/docs/latest/deployment/configuration/)
  - [Storage Backends](https://www.jaegertracing.io/docs/latest/storage/)

- [jaegertracing/jaeger](https://github.com/jaegertracing/jaeger)
