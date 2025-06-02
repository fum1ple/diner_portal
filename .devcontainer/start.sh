#!/bin/bash
set -e

echo "🚀 Starting Docker Compose..."
                                                                                                              
# Dockerデーモンの起動を待つ
timeout=30
while ! docker info >/dev/null 2>&1; do
  if [ $timeout -eq 0 ]; then
    echo "❌ Docker daemon is not available"
    exit 1
  fi
  echo "⏳ Waiting for Docker daemon..."
  sleep 1
  ((timeout--))
done

# コンテナが実行中でない場合にだけ起動
if ! docker compose ps -q | grep -q .; then
  docker compose up -d
else
  echo "✅ コンテナはすでに起動しています。"
fi

echo "✅ 開発環境の起動完了！"
echo "📋 VS Code will automatically start log monitoring..."
