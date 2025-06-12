# 修正項目4: テストの実装

## 問題
- お気に入り機能のRSpecテストファイルは作成されたが、実装されていない（pending状態）
- 検索機能のテストが不足

## 修正内容

### 1. Favoriteモデルのテスト (`backend/spec/models/favorite_spec.rb`)
- バリデーションのテスト
- アソシエーションのテスト
- ユニーク制約のテスト

### 2. FavoritesControllerのテスト (新規作成)
- `backend/spec/requests/api/favorites_controller_spec.rb`
- create, destroy, indexアクションのテスト
- 認証が必要なことのテスト
- エラーケースのテスト

### 3. RestaurantsController検索機能のテスト
- `backend/spec/requests/api/restaurants_controller_spec.rb`に追加
- 名前検索、エリア検索、ジャンル検索のテスト
- 複合検索のテスト
- 空文字列の扱いのテスト

## 作業ディレクトリ
```bash
cd /workspaces/diner_portal/worktree-fixes/fix-4-add-tests
```

## テスト実行コマンド
```bash
cd backend
bundle exec rspec spec/models/favorite_spec.rb
bundle exec rspec spec/requests/api/favorites_controller_spec.rb
bundle exec rspec spec/requests/api/restaurants_controller_spec.rb
```

## 確認事項
- すべてのテストがグリーンになること
- カバレッジが十分であること