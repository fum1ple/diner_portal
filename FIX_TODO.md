# 修正項目1: Favoriteモデルの重複を解消

## 問題
- `app/models.rb`と`app/models/favorite.rb`の両方にFavoriteクラスが定義されている
- `app/models.rb`にはuniqueness validationがあるが、`favorite.rb`にはない

## 修正内容
1. `backend/app/models.rb`を削除
2. `backend/app/models/favorite.rb`に以下を追加:
   ```ruby
   validates :user_id, uniqueness: { scope: :restaurant_id }
   ```

## 作業ディレクトリ
```bash
cd /workspaces/diner_portal/worktree-fixes/fix-1-favorite-model
```

## 確認事項
- モデルのテストが通ること
- お気に入り機能のAPIが正常に動作すること