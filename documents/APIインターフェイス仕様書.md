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
この仕様で問題なければ、次のタスク（DBスキーマ調整・マイグレーション）に進みます。
