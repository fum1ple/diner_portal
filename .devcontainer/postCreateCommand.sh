#!/bin/bash
set -e

echo "🚀 Codespacesの初期化を開始します..."

# プロジェクトのルートディレクトリに移動
cd /app

# フロントエンドの依存関係をインストール
echo "📦 フロントエンド依存関係をインストールしています..."
cd /app/frontend
yarn install || npm install

# バックエンドのセットアップ
echo "🔧 バックエンドをセットアップしています..."
cd /app/backend
bundle config set --local path '/usr/local/bundle'
bundle install
bundle exec rails db:create db:migrate db:seed || echo "データベース設定をスキップします"

# 開発サーバーの起動手順を表示
echo "✅ 環境構築が完了しました！"
echo "開発サーバーを起動するには以下のコマンドを実行してください："
echo "- フロントエンド: cd /app/frontend && yarn dev -p 4000"
echo "- バックエンド: cd /app/backend && bundle exec rails s -b '0.0.0.0'"
echo ""
echo "サーバー起動後のアクセス先:"
echo "- フロントエンド: http://localhost:4000"
echo "- バックエンド: http://localhost:3000"