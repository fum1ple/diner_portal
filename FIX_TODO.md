# 修正項目2: データベースインデックスの追加

## 問題
- `favorites`テーブルに`[user_id, restaurant_id]`の複合ユニークインデックスが必要
- 現在は個別のインデックスのみ存在

## 修正内容
1. 新しいマイグレーションファイルを作成:
   ```bash
   cd backend
   rails g migration AddUniqueIndexToFavorites
   ```

2. マイグレーションファイルに以下を追加:
   ```ruby
   def change
     add_index :favorites, [:user_id, :restaurant_id], unique: true
   end
   ```

3. マイグレーションを実行:
   ```bash
   rails db:migrate
   ```

## 作業ディレクトリ
```bash
cd /workspaces/diner_portal/worktree-fixes/fix-2-db-index
```

## 確認事項
- マイグレーションが正常に実行されること
- 重複したお気に入り登録ができないこと