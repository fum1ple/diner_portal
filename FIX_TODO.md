# 修正項目3: フロントエンドコンポーネントの整理

## 問題
- `frontend/src/app/restaurants/page.tsx`内に検索フォームを実装
- その後`frontend/src/components/SearchForm.tsx`を別途作成
- どちらを使うか不明確で重複している

## 修正内容
### オプション1: SearchForm.tsxコンポーネントを使用する場合
1. `restaurants/page.tsx`から検索フォームのコードを削除
2. `SearchForm.tsx`をインポートして使用
3. 必要に応じて`SearchForm.tsx`を修正

### オプション2: page.tsx内の実装を使用する場合
1. `SearchForm.tsx`を削除
2. `page.tsx`内の実装を整理・改善

## 推奨
- SearchForm.tsxをコンポーネントとして分離する方が再利用性が高い
- ただし、現在のSearchForm.tsxは検索結果表示も含んでいるため、検索フォーム部分のみを切り出す必要がある

## 作業ディレクトリ
```bash
cd /workspaces/diner_portal/worktree-fixes/fix-3-frontend-components
```

## 確認事項
- 検索機能が正常に動作すること
- UIが崩れていないこと
- コンポーネントの責務が明確になっていること