#!/bin/bash
set -e

echo "🚀 開発環境のセットアップを開始します..."

# 必要なツールのインストール
sudo apt-get update && sudo apt-get install -y \
    build-essential \
    curl \
    git \
    gnupg2 \
    ca-certificates \
    lsb-release \
    libpq-dev \
    postgresql-client

# Ruby 3.2.8のインストール
sudo apt-get install -y software-properties-common
sudo apt-add-repository -y ppa:rael-gc/rvm
sudo apt-get update
sudo apt-get install -y rvm
source /usr/share/rvm/scripts/rvm
rvm install 3.2.8
rvm use 3.2.8 --default

# Docker CLIのインストール（既に利用可能な場合はスキップ）
if ! command -v docker &> /dev/null; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install -y docker-ce-cli
fi

# Node.jsとYarnのインストール（既に利用可能な場合はスキップ）
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    sudo npm install -g yarn
fi

# プロジェクトのセットアップ
echo "🔧 プロジェクトのセットアップ手順:"
echo "フロントエンド: cd /workspaces/diner_portal/frontend && yarn install"
echo "バックエンド: cd /workspaces/diner_portal/backend && bundle install"
echo ""
echo "✅ セットアップスクリプトが完了しました。"