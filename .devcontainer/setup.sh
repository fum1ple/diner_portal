#!/bin/bash
set -e

echo "🚀 プロジェクトセットアップ中..."

# Backendセットアップ
cd /workspaces/diner_portal/backend
bundle install

# Frontendセットアップ
cd /workspaces/diner_portal/frontend
yarn install

echo "✅ セットアップ完了！"
