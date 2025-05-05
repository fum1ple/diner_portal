#!/bin/bash
set -e

echo "🚀 Starting development servers..."

# Backend: Rails サーバーをバックグラウンドで起動
echo "💎 Starting Rails backend on port 3000..."
(cd backend && bin/rails server -b 0.0.0.0 -p 3000) &

# Frontend: 開発サーバーをバックグラウンドで起動
echo "🌐 Starting frontend dev server on port 4000..."
(cd frontend && yarn dev -p 4000) &

# すべてのプロセスが生きている間待機
wait
