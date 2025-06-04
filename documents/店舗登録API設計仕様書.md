# 店舗登録API 設計・仕様書

## 📋 設計概要（インターフェース仕様）

### プロジェクト情報
- **プロジェクト**: TOKIEATS 店舗登録機能
- **対象API**: 店舗登録API
- **開発期間**: 2日間
- **開発体制**: 2年目エンジニア1名、2ヶ月目エンジニア1名、AIフル活用

### 基本設計
- **エンドポイント**: `POST /api/restaurants`
- **認証**: JWT認証必須
- **レスポンス形式**: JSON
- **ステータスコード**: 成功時201、エラー時422/401/500

### データ設計
- **Restaurantテーブル**: `image_url`なし、`area_tag_id`と`genre_tag_id`でエリアと単一ジャンルを登録
- **Tagテーブル**: エリア・ジャンル情報を管理

---

## 🔧 技術仕様

### システム構成
- **フレームワーク**: Ruby on Rails (API mode)
- **認証方式**: JWT Bearer Token
- **データベース**: PostgreSQL
- **テスト**: RSpec
- **コンテナ**: Docker + Docker Compose

### データモデル設計

#### Restaurantモデル
```ruby
class Restaurant < ApplicationRecord
  belongs_to :user
  belongs_to :area_tag, class_name: 'Tag', foreign_key: 'area_tag_id'
  belongs_to :genre_tag, class_name: 'Tag', foreign_key: 'genre_tag_id'
  
  validates :name, presence: true
  validates :user_id, presence: true
  validates :area_tag_id, presence: true
  validates :genre_tag_id, presence: true
end
```

#### Tagモデル
```ruby
class Tag < ApplicationRecord
  validates :name, presence: true
  validates :category, presence: true, inclusion: { in: %w[area genre] }
  
  scope :areas, -> { where(category: 'area') }
  scope :genres, -> { where(category: 'genre') }
end
```

---

## 📡 API詳細仕様

### 認証
すべてのAPIリクエストには認証が必要です。

#### 認証方法
HTTPヘッダーにJWTトークンを含めてください。

```
Authorization: Bearer <JWT_TOKEN>
```

---

## エンドポイント詳細

### 店舗作成
店舗情報を新規登録します。

#### リクエスト
```http
POST /api/restaurants
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

#### リクエストボディ
```json
{
  "name": "美味しいレストラン",
  "area_tag_id": 1,
  "genre_tag_id": 5
}
```

| パラメータ | 型 | 必須 | 説明 | バリデーション |
|-----------|---|------|------|---------------|
| name | string | ✓ | 店舗名 | presence: true |
| area_tag_id | integer | ✓ | エリアタグのID | presence: true, 存在確認 |
| genre_tag_id | integer | ✓ | ジャンルタグのID | presence: true, 存在確認 |

#### バリデーションルール
- **name**: 必須入力
- **area_tag_id**: 必須入力、Tagテーブルに存在すること、category='area'であること
- **genre_tag_id**: 必須入力、Tagテーブルに存在すること、category='genre'であること
- **user_id**: current_userから自動設定

---

## レスポンス仕様

### 成功時 (201 Created)
```json
{
  "id": 123,
  "name": "美味しいレストラン",
  "user_id": 1,
  "area_tag_id": 1,
  "genre_tag_id": 5,
  "area_tag": {
    "id": 1,
    "name": "渋谷",
    "category": "area"
  },
  "genre_tag": {
    "id": 5,
    "name": "イタリアン",
    "category": "genre"
  },
  "created_at": "2025-06-03T10:30:00.000Z",
  "updated_at": "2025-06-03T10:30:00.000Z"
}
```

### エラーレスポンス

#### 認証エラー (401 Unauthorized)
```json
{
  "error": "Unauthorized",
  "message": "認証が必要です"
}
```

#### バリデーションエラー (422 Unprocessable Entity)
```json
{
  "errors": {
    "name": ["を入力してください"],
    "area_tag_id": ["を入力してください"],
    "genre_tag_id": ["は存在しません"]
  }
}
```

#### 存在しないタグID (422 Unprocessable Entity)
```json
{
  "errors": {
    "area_tag": ["は存在しません"],
    "genre_tag": ["カテゴリが正しくありません"]
  }
}
```

#### サーバーエラー (500 Internal Server Error)
```json
{
  "error": "Internal Server Error",
  "message": "サーバーでエラーが発生しました"
}
```

---

## エラーコード一覧

| HTTPステータス | エラーケース | 説明 | 対応方法 |
|---------------|-------------|------|----------|
| 401 | Unauthorized | 認証トークンが無効または未提供 | 有効なJWTトークンを取得し、Authorizationヘッダーに設定 |
| 422 | Unprocessable Entity | バリデーションエラー、存在しないタグID | リクエストボディの内容を確認し、有効なデータを送信 |
| 500 | Internal Server Error | サーバー側の処理エラー | サーバーログを確認し、管理者に連絡 |

---

## 実装仕様

### ルーティング
```ruby
# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    resources :restaurants, only: [:create]
  end
end
```

### コントローラ実装
```ruby
# app/controllers/api/restaurants_controller.rb
class Api::RestaurantsController < ApplicationController
  before_action :authenticate_user!
  
  def create
    restaurant = current_user.restaurants.build(restaurant_params)
    
    if restaurant.save
      render json: restaurant_response(restaurant), status: :created
    else
      render json: { errors: restaurant.errors }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound => e
    render json: { errors: { base: [e.message] } }, status: :unprocessable_entity
  end
  
  private
  
  def restaurant_params
    params.require(:restaurant).permit(:name, :area_tag_id, :genre_tag_id)
  end
  
  def restaurant_response(restaurant)
    restaurant.as_json(include: {
      area_tag: { only: [:id, :name, :category] },
      genre_tag: { only: [:id, :name, :category] }
    })
  end
end
```

---

## テスト仕様

### テストケース分類
1. **正常系テスト**: 有効なデータでの店舗作成
2. **異常系テスト**: 必須項目不足、存在しないタグID、未認証ユーザー
3. **認証テスト**: 未認証アクセス、無効なトークン
4. **レスポンス形式テスト**: JSON構造の検証

### RSpec実装場所
- `spec/controllers/api/restaurants_controller_spec.rb`
- `spec/models/restaurant_spec.rb`
- `spec/models/tag_spec.rb`

---

## 開発・テスト手順

### 手動テスト（Postman）
1. 認証用のJWTトークンを取得
2. 店舗作成APIの正常系テスト実行
3. バリデーションエラーのテスト実行
4. 未認証エラーのテスト実行
5. レスポンス内容の詳細確認

### 使用例

#### cURL
```bash
curl -X POST http://localhost:3000/api/restaurants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \
  -d '{
    "name": "美味しいレストラン",
    "area_tag_id": 1,
    "genre_tag_id": 5
  }'
```

#### JavaScript (fetch)
```javascript
const response = await fetch('/api/restaurants', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: '美味しいレストラン',
    area_tag_id: 1,
    genre_tag_id: 5
  })
});

const result = await response.json();
```

#### React (axios)
```javascript
import axios from 'axios';

const createRestaurant = async (restaurantData) => {
  try {
    const response = await axios.post('/api/restaurants', restaurantData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('店舗作成エラー:', error.response.data);
    throw error;
  }
};
```

---

## 注意事項・前提条件

### 開発時の注意点
1. **認証トークンの取得**: 事前にログインAPIでJWTトークンを取得すること
2. **タグIDの確認**: `area_tag_id`と`genre_tag_id`は事前にタグ一覧APIで有効なIDを確認すること
3. **エラーハンドリング**: フロントエンドでは適切なエラーハンドリングを実装すること
4. **文字数制限**: `name`フィールドには適切な文字数制限があること

### データベース前提
- Userテーブルが存在し、認証機能が実装済み
- Tagテーブルにエリア・ジャンルデータが事前に登録済み
- 外部キー制約が適切に設定されていること

### セキュリティ要件
- すべてのAPIリクエストでJWT認証必須
- CORS設定が適切に行われていること
- レート制限（Rate Limiting）が設定されていること

---

## 開発スケジュール

### Day 1: モデル調整・API基本構築 (5.5時間)
- タスク1.1: 設計最終確認 (0.5時間)
- タスク1.2: DB スキーマ調整・マイグレーション (1.5時間)
- タスク1.3: Restaurantモデル設定 (2時間)
- タスク1.4: ルーティング・コントローラ雛形作成 (1時間)
- タスク1.5: API認証設定 (0.5時間)

### Day 2: APIロジック実装と簡易テスト (7時間)
- タスク2.1: 店舗情報保存ロジック (3.5時間)
- タスク2.2: 包括的テストケース作成 (2時間)
- タスク2.3: Postmanでの動作確認 (1時間)
- タスク2.4: API仕様書作成 (0.5時間)

---

## 更新履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|------|-----------|----------|--------|
| 2025-06-03 | 1.0.0 | 初版作成（設計・仕様統合版） | 開発チーム |

---

## 関連ドキュメント

- [システム設計.md](./システム設計.md)
- [認証システムロードマップ.md](./認証システムロードマップ.md)
- [店舗登録バックエンドロードマップ.md](./roadmap/店舗登録バックエンドロードマップ.md)
