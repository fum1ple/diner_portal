#!/bin/bash
set -e

echo "🚀 Codespacesの初期化を開始します..."

# フロントエンドの依存関係をインストール
echo "📦 フロントエンド依存関係をインストールしています..."
cd /workspaces/diner_portal/frontend
yarn install

# バックエンドのセットアップ
echo "🔧 バックエンドをセットアップしています..."
cd /workspaces/diner_portal/backend
bundle install
bundle exec rails db:create db:migrate db:seed

echo "✅ 環境構築が完了しました！"
echo "フロントエンド: http://localhost:4000"
echo "バックエンド: http://localhost:3000"