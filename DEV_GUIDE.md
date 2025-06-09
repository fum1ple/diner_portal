# Diner Portal 開発ガイド

> このドキュメントは、開発者が常に参照できるプロジェクトの開発情報をまとめたものです。

## 📋 プロジェクト概要

### システム構成
- **名前**: Diner Portal
- **種類**: レストラン情報管理システム  
- **アーキテクチャ**: フロントエンド/バックエンド分離型
- **コンテナ**: Docker Compose環境

### 技術スタック

#### バックエンド（Ruby on Rails）
- **フレームワーク**: Ruby on Rails 7.1.5+ (API mode)
- **Ruby バージョン**: 3.2.8
- **データベース**: PostgreSQL 15-alpine
- **テストフレームワーク**: RSpec 7.0+（※バージョン変更禁止）
- **認証**: JWT (JSON Web Token)
- **外部認証**: Google OAuth 2.0
- **API仕様**: RESTful API

#### フロントエンド（Next.js）
- **フレームワーク**: Next.js 14.2.29
- **ランタイム**: Node.js 20+
- **パッケージマネージャー**: **Yarn** (重要: npm は使用しない)
- **UI**: Tailwind CSS + Radix UI
- **認証**: NextAuth.js v4
- **型定義**: TypeScript 5.8+
- **状態管理**: TanStack Query (React Query)

#### インフラ・環境
- **コンテナ**: Docker + Docker Compose
- **開発環境**: GitHub Codespaces or ローカル
- **データベース**: PostgreSQL (コンテナ)
- **リバースプロキシ**: 不使用（直接アクセス）

## 🚀 環境セットアップ

### 初回セットアップ手順
1. GitHub Codespacesを起動
2. 自動セットアップ完了まで待機（`.devcontainer/setup.sh`が実行される）
3. `docker compose build` （必要に応じて）
4. `docker compose up -d` （自動実行される）

### 確認事項
- **Frontend**: http://localhost:4000 （Next.js）
- **Backend**: http://localhost:3000 （Rails API）
- **Database**: PostgreSQL (localhost:5432)

### 開発コマンド

#### Docker操作
```bash
# 全サービス起動
docker compose up -d

# ログ監視（VS Code Task推奨）
docker compose logs -f frontend
docker compose logs -f backend

# コンテナ停止
docker compose down

# リビルド
docker compose build --no-cache
```

#### フロントエンド（**Yarnを使用**）
```bash
cd frontend
yarn install          # 依存関係インストール
yarn dev               # 開発サーバー起動
yarn build             # プロダクションビルド
yarn lint              # ESLintチェック
yarn type-check        # TypeScript型チェック
```

#### バックエンド（Bundle）
```bash
cd backend
bundle install         # gem インストール
bundle exec rails s    # 開発サーバー起動
bundle exec rspec      # テスト実行
bundle exec rails db:migrate  # マイグレーション実行
```

## 🔐 認証システム

### 認証フロー
1. **フロントエンド**: NextAuth.js でGoogle OAuth
2. **バックエンド連携**: Google ID Token を Rails API に送信
3. **JWT発行**: Rails が JWT + Refresh Token を発行
4. **API認証**: 以降のAPI呼び出しで JWT Bearer Token使用

### 実装済み認証エンドポイント
```
POST /api/auth/google     # Google認証
POST /api/auth/refresh    # トークンリフレッシュ
POST /api/auth/logout     # ログアウト
GET  /api/user/profile    # ユーザー情報取得（認証必須）
PUT  /api/user/update     # ユーザー情報更新（認証必須）
```

### 認証実装パターン

#### フロントエンド API呼び出し
```typescript
import { authenticatedFetch } from '@/utils/api';

// 認証済みAPIリクエスト
const response = await authenticatedFetch('/api/restaurants', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

#### バックエンド認証制御
```ruby
class Api::RestaurantsController < ApplicationController
  # 認証が必要
  def jwt_authentication_required?
    true
  end
end
```

## 📡 API仕様

### 基本原則
- **認証**: 全API で JWT Bearer Token 必須
- **レスポンス形式**: JSON
- **エラーコード**: 標準 HTTP ステータス

### 実装済みエンドポイント

#### 認証系
```
POST /api/auth/google
POST /api/auth/refresh  
POST /api/auth/logout
GET  /api/user/profile
PUT  /api/user/update
```

#### レストラン系
```
GET    /api/restaurants     # 一覧取得
POST   /api/restaurants     # 店舗登録
GET    /api/restaurants/:id # 詳細取得
```

#### タグ系
```
GET  /api/tags?category=area   # エリアタグ一覧
GET  /api/tags?category=genre  # ジャンルタグ一覧
```

### リクエスト例
```bash
curl -X POST http://localhost:3000/api/restaurants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "name": "新しいレストラン",
    "area_tag_id": 1,
    "genre_tag_id": 5
  }'
```

## 🗃️ データベース設計

### 主要テーブル
- **users**: ユーザー情報（Google認証）
- **restaurants**: レストラン情報
- **tags**: エリア・ジャンル・シーンタグ
- **reviews**: レビュー情報
- **refresh_tokens**: リフレッシュトークン管理

### 接続情報
```yaml
development:
  adapter: postgresql
  host: db (コンテナ名)
  username: root
  password: password
  database: app_development
```

## 🧪 テスト

### テスト実行
```bash
# バックエンド（RSpec）
cd backend
bundle exec rspec

# フロントエンド（Jest等）
cd frontend
yarn test
```

### テスト方針
- **API テスト**: RSpec request specs
- **認証テスト**: JWT トークン検証
- **統合テスト**: エンドツーエンド

## 📁 ディレクトリ構成

```
diner_portal/
├── backend/           # Rails API
│   ├── app/
│   │   ├── controllers/api/  # APIコントローラ
│   │   ├── models/           # データモデル
│   │   └── services/         # ビジネスロジック
│   ├── config/        # Rails設定
│   ├── db/           # マイグレーション
│   └── spec/         # RSpecテスト
├── frontend/         # Next.js アプリ
│   ├── src/
│   │   ├── app/      # App Router
│   │   ├── components/ # UIコンポーネント
│   │   ├── contexts/ # React Context
│   │   ├── types/    # TypeScript型定義
│   │   └── utils/    # ユーティリティ
│   └── public/       # 静的ファイル
├── documents/        # 設計ドキュメント
├── .devcontainer/    # Codespaces設定
└── docker-compose.yml
```

## 🔧 開発設定

### VS Code 設定
- **拡張機能**: Ruby、ESLint、Prettier自動インストール
- **ログ監視**: 自動でfrontend/backendログを監視
- **ポート転送**: 3000(backend), 4000(frontend)

### 環境変数
```bash
# 必要な環境変数
GOOGLE_CLIENT_ID=<Google OAuth Client ID>
GOOGLE_CLIENT_SECRET=<Google OAuth Client Secret>  
NEXTAUTH_SECRET=<NextAuth Secret>
JWT_SECRET_KEY=<JWT署名用シークレット>
```

## ⚠️ 注意事項・制約

### 重要な制約
1. **RSpec バージョン**: 7.0 から絶対に変更禁止（2025/06/05 指示）
2. **パッケージマネージャー**: フロントエンドは **Yarn のみ** 使用
3. **認証ドメイン**: `tokium.jp` のみ許可
4. **Node.js**: v20+ 必須

### セキュリティ要件
- 全API認証必須
- CORS適切設定済み
- Rate limiting実装済み
- JWT有効期限管理

## 📖 参考ドキュメント

### 詳細設計書
- `documents/APIインターフェイス仕様書.md`
- `documents/店舗登録API設計仕様書.md`
- `documents/システム設計.md`

### ロードマップ
- `documents/roadmap/認証システムロードマップ.md`
- `documents/roadmap/店舗登録バックエンドロードマップ.md`
- `documents/roadmap/店舗管理機能ロードマップ.md`

## 🚨 トラブルシューティング

### よくある問題

#### Docker関連
```bash
# コンテナが起動しない
docker compose down && docker compose up -d

# ボリューム削除してクリーンビルド
docker compose down -v
docker compose build --no-cache
```

#### 認証エラー
- JWTトークンの有効期限確認
- Google OAuth設定確認
- 環境変数設定確認

#### データベース接続エラー
```bash
# DB起動確認
docker compose logs db

# マイグレーション実行
docker compose exec backend bundle exec rails db:migrate
```

---

**最終更新**: 2025/06/09  
**メンテナンス**: このドキュメントは開発進捗に応じて随時更新してください。
