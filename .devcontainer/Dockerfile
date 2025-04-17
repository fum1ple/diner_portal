FROM mcr.microsoft.com/devcontainers/base:ubuntu

# 必要なツールのインストール
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    build-essential \
    curl \
    git \
    gnupg2 \
    ca-certificates \
    lsb-release \
    libpq-dev \
    postgresql-client

# Ruby 3.2.8のインストール
RUN apt-get update && apt-get install -y \
    software-properties-common \
    && apt-add-repository -y ppa:rael-gc/rvm \
    && apt-get update \
    && apt-get -y install rvm \
    && /usr/share/rvm/bin/rvm install 3.2.8 \
    && /usr/share/rvm/bin/rvm use 3.2.8 --default

# タイムゾーンの設定
ENV TZ=Asia/Tokyo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 作業用ディレクトリの作成
WORKDIR /workspaces/diner_portal

# クリーンアップ
RUN apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*