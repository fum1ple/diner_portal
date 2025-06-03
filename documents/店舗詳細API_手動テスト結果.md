# 店舗詳細API 手動テスト結果

## テスト対象
GET /api/restaurants/:id

## テスト観点
- 正常系: 存在する店舗IDを指定した場合、正しい詳細情報が返る
- 異常系1: 存在しない店舗IDを指定した場合、404エラーが返る
- 異常系2: 認証トークンなしでリクエストした場合、認証エラーが返る

## curlコマンド例

### 正常系
```
curl -X GET \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  http://localhost:3000/api/restaurants/1
```

### 異常系1（存在しないID）
```
curl -X GET \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  http://localhost:3000/api/restaurants/99999
```

### 異常系2（認証なし）
```
curl -X GET http://localhost:3000/api/restaurants/1
```

## テスト結果

| テストケース | リクエスト | 期待レスポンス | 実際のレスポンス | 判定 |
|---|---|---|---|---|
| 正常系 | /api/restaurants/1 | 店舗詳細JSON | {"id":1,"name":"美味しいレストラン","area_tag_id":1,"genre_tag_id":5,"user_id":1,"area_tag":{"id":1,"name":"渋谷","category":"area"},"genre_tag":{"id":5,"name":"イタリアン","category":"genre"}} | OK |
| 異常系1 | /api/restaurants/99999 | 404エラー | {"error":"Restaurant not found"} | OK |
| 異常系2 | /api/restaurants/1 (認証なし) | 認証エラー | {"error":"Missing authorization token","code":"MISSING_TOKEN"} | OK |


## 備考
- <JWT_TOKEN>は有効なトークンに置き換えてください。
- 実際のレスポンスはテスト実施後に記入。
