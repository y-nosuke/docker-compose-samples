#!/bin/sh
set -e

INIT_DIR="/docker-entrypoint.d"
MINIO_ALIAS="local"
FLAG_FILE="/data/.initialized"

echo "Starting MinIO..."

# MinIO をバックグラウンド起動
minio "$@" &
MINIO_PID=$!

# MinIO が起動するまで待つ
echo "Waiting for MinIO to be ready..."
until mc alias set "$MINIO_ALIAS" \
  http://localhost:9000 \
  "$MINIO_ROOT_USER" \
  "$MINIO_ROOT_PASSWORD" >/dev/null 2>&1
do
  sleep 1
done

echo "MinIO is ready"

# 初回起動判定
if [ ! -f "$FLAG_FILE" ]; then
  echo "Running init scripts..."

  if [ -d "$INIT_DIR" ]; then
    for f in "$INIT_DIR"/*.sh; do
      [ -e "$f" ] || continue
      echo "Executing $f"
      . "$f"
    done
  fi

  touch "$FLAG_FILE"
  echo "Initialization completed"
else
  echo "Already initialized, skipping"
fi

# フォアグラウンド化
wait "$MINIO_PID"
