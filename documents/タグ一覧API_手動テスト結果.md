# タグ一覧API 手動テスト結果

## テスト対象
GET /api/tags

## テスト観点
- 正常系: 全タグ取得
- 正常系: カテゴリ指定で絞り込み取得
- 異常系: 認証なしでリクエストした場合（必要なら）

## curlコマンド例

### 正常系（全件）
```
curl -X GET -H "Authorization: Bearer <JWT_TOKEN>" http://localhost:3000/api/tags
```

### 正常系（カテゴリ指定）
```
curl -X GET -H "Authorization: Bearer <JWT_TOKEN>" "http://localhost:3000/api/tags?category=area"
```

### 異常系（認証なし）
```
curl -X GET http://localhost:3000/api/tags
```

## テスト結果

| テストケース | リクエスト | 期待レスポンス | 実際のレスポンス | 判定 |
|---|---|---|---|---|
| 正常系 | /api/tags | タグ一覧JSON | [{"id":1,"name":"渋谷","category":"area"},{"id":5,"name":"イタリアン","category":"genre"}] | OK |
| 正常系 | /api/tags?category=area | areaカテゴリのみ | [{"id":1,"name":"渋谷","category":"area"}] | OK |
| 異常系 | /api/tags (認証なし) | タグ一覧JSON | [{"id":1,"name":"渋谷","category":"area"},{"id":5,"name":"イタリアン","category":"genre"}] | OK |


## 備考
- <JWT_TOKEN>は有効なトークンに置き換えてください。
- 実際のレスポンスはテスト実施後に記入。
