# 店舗登録API 手動テスト結果（curl）

## テスト環境
- バックエンド: Rails 7.1（APIモード）
- 認証: JWT（Google認証連携）
- テスト方法: curlコマンドによるHTTPリクエスト

---

## 1. 正常系

**コマンド例**
```bash
curl -X POST http://localhost:3000/api/restaurants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwtToken>" \
  -d '{
    "name": "美味しいレストラン",
    "area_tag_id": 1,
    "genre_tag_id": 5
  }'
```
**レスポンス例**
```json
{
  "id": 1,
  "name": "美味しいレストラン",
  "area_tag_id": 1,
  "genre_tag_id": 5,
  "user_id": 1,
  "area_tag": { "id": 1, "name": "渋谷", "category": "area" },
  "genre_tag": { "id": 5, "name": "イタリアン", "category": "genre" }
}
```

---

## 2. 必須項目不足（name未入力）

**コマンド例**
```bash
curl -X POST http://localhost:3000/api/restaurants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwtToken>" \
  -d '{
    "area_tag_id": 1,
    "genre_tag_id": 5
  }'
```
**レスポンス例**
```json
{"errors":{"name":["を入力してください"]}}
```

---

## 3. 存在しないタグID

**コマンド例**
```bash
curl -X POST http://localhost:3000/api/restaurants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwtToken>" \
  -d '{
    "name": "存在しないタグ",
    "area_tag_id": 9999,
    "genre_tag_id": 8888
  }'
```
**レスポンス例**
```json
{"errors":{"area_tag":["は存在しません"],"genre_tag":["は存在しません"]}}
```

---

## 4. カテゴリ不一致（area_tag_idにgenre、genre_tag_idにarea）

**コマンド例**
```bash
curl -X POST http://localhost:3000/api/restaurants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwtToken>" \
  -d '{
    "name": "カテゴリ逆テスト",
    "area_tag_id": 5,
    "genre_tag_id": 1
  }'
```
**レスポンス例**
```json
{"errors":{"area_tag_id":["must be an area tag"],"genre_tag_id":["must be a genre tag"]}}
```

---

## 5. 未認証（トークンなし）

**コマンド例**
```bash
curl -X POST http://localhost:3000/api/restaurants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "未認証テスト",
    "area_tag_id": 1,
    "genre_tag_id": 5
  }'
```
**レスポンス例**
```json
{"error":"Missing authorization token","code":"MISSING_TOKEN"}
```

---

## 結論・備考

- すべてのテストケースで**仕様通りのレスポンス**を確認
- JWT認証、バリデーション、エラー処理が正しく動作
- テストコマンド・レスポンス例はチームで共有し、今後の開発・レビュー・ドキュメント作成に活用可能
