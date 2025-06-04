# 店舗登録API インターフェース仕様書（ドラフト）

## エンドポイント
- `POST /api/restaurants`

## リクエストボディ
Content-Type: application/json

```
{
  "name": "店舗名（例：トキエイツ新宿店）",
  "area_tag_id": 1,   // エリアタグID（整数, 必須）
  "genre_tag_id": 2   // ジャンルタグID（整数, 必須）
}
```

| パラメータ      | 型      | 必須 | 説明           |
|:---------------|:--------|:-----|:---------------|
| name           | string  | ○    | 店舗名         |
| area_tag_id    | integer | ○    | エリアタグID   |
| genre_tag_id   | integer | ○    | ジャンルタグID |

## レスポンス
### 成功時（201 Created）
```
{
  "id": 10,
  "name": "トキエイツ新宿店",
  "area_tag_id": 1,
  "genre_tag_id": 2,
  "user_id": 5,
  "area_tag": {
    "id": 1,
    "name": "新宿",
    "category": "area"
  },
  "genre_tag": {
    "id": 2,
    "name": "イタリアン",
    "category": "genre"
  }
}
```

### バリデーションエラー時（422 Unprocessable Entity）
```
{
  "errors": [
    "Name can't be blank",
    "Area tag must exist"
  ]
}
```

## 備考
- 認証必須（JWT等による認証を前提）
- area_tag_id, genre_tag_idは存在するTagのIDである必要あり
- レスポンスには関連タグ情報も含めるとフロントエンドが便利

---

## 店舗詳細API

### エンドポイント
- `GET /api/restaurants/:id`

### レスポンス例（成功時 200 OK）
```
{
  "id": 10,
  "name": "トキエイツ新宿店",
  "area_tag_id": 1,
  "genre_tag_id": 2,
  "user_id": 5,
  "area_tag": {
    "id": 1,
    "name": "新宿",
    "category": "area"
  },
  "genre_tag": {
    "id": 2,
    "name": "イタリアン",
    "category": "genre"
  },
  "created_at": "2025-06-03T10:30:00.000Z",
  "updated_at": "2025-06-03T10:30:00.000Z"
}
```

### エラー時（404 Not Found）
```
{
  "error": "Not Found",
  "message": "指定された店舗は存在しません"
}
```

### 備考
- 認証必須（JWT等による認証を前提）
- area_tag_id, genre_tag_idは存在するTagのIDである必要あり
- レスポンスには関連タグ情報も含める
- 存在しないIDの場合は404エラー

---

## タグ一覧API

### エンドポイント
- `GET /api/tags`

### 概要
- タグ（エリア・ジャンル等）の一覧を取得します。
- `category`パラメータでカテゴリごとに絞り込み可能。

### リクエストパラメータ
| パラメータ | 型     | 必須 | 説明                      | 例         |
|------------|--------|------|---------------------------|------------|
| category   | string | 任意 | タグのカテゴリで絞り込む  | area, genre|

### リクエスト例
```
GET /api/tags?category=area
```

### レスポンス例
```json
[
  {
    "id": 1,
    "name": "新宿",
    "category": "area"
  },
  {
    "id": 2,
    "name": "渋谷",
    "category": "area"
  }
]
```

### 備考
- `category`を省略した場合は全タグが返ります。
- `category`には`area`または`genre`を指定してください。
- ステータスコード: 200 OK
