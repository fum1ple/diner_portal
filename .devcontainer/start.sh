#!/bin/bash
set -e

echo "🚀 Starting Docker Compose..."

# コンテナが実行中でない場合にだけ起動
if ! docker compose ps -q | grep -q .; then
  docker compose up -d
else
  echo "✅ コンテナはすでに起動しています。"
fi

echo "✅ 開発環境の起動完了！"
