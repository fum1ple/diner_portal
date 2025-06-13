# API Client リファクタリング実装計画

## 概要
現在の単一ファイル `apiClient.ts` をドメイン別に分割し、保守性とスケーラビリティを向上させる。

## 現状分析

### 現在の構造
- **ファイル**: `/frontend/src/lib/apiClient.ts` (191行)
- **メソッド数**: 7つ（authApi namespace）
- **カバー率**: 7/14 バックエンドエンドポイント（50%）

### 問題点
1. **一貫性の欠如**: 一部hooks が直接 `fetch()` を使用
2. **重複機能**: `lib/apiClient.ts` と `utils/api.ts` の類似機能
3. **将来の肥大化**: 全エンドポイント対応で300-400行に成長予想

## 新しいアーキテクチャ

### ディレクトリ構造
```
/frontend/src/lib/api/
├── client.ts          # 共通fetch wrapper + 型ガード
├── auth.ts           # 認証関連API (3 endpoints)
├── restaurants.ts    # 店舗関連API (3 endpoints)
├── users.ts          # ユーザー関連API (2 endpoints)
├── favorites.ts      # お気に入り関連API (3 endpoints)
├── tags.ts           # タグ関連API (2 endpoints)
├── reviews.ts        # レビュー関連API (1 endpoint)
└── index.ts          # 統合エクスポート
```

### 各ファイルの責務

#### `/lib/api/client.ts` - 共通機能
```typescript
// 現在の apiCall 関数 + 型ガード関数を移動
export const apiCall = async <T>(endpoint: string, options?: ApiCallOptions): Promise<ApiResponse<T>>;
export const isTagsResponse = (data: unknown): data is Tag[];
export const isRestaurantsResponse = (data: unknown): data is Restaurant[];
// 新規型ガード追加予定
```

#### `/lib/api/auth.ts` - 認証API
```typescript
export const authApi = {
  googleAuth: (token: string) => apiCall('/auth/google', { method: 'POST', body: JSON.stringify({ token }) }),
  refreshToken: (refreshToken: string) => apiCall('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) }),
  logout: () => apiCall('/auth/logout', { method: 'POST' })
};
```

#### `/lib/api/restaurants.ts` - 店舗API
```typescript
export const restaurantApi = {
  list: () => apiCall<Restaurant[]>('/restaurants'),
  create: (data: CreateRestaurantRequest) => apiCall<Restaurant>('/restaurants', { method: 'POST', body: JSON.stringify(data) }),
  show: (id: string) => apiCall<Restaurant>(`/restaurants/${id}`),
  search: (params: SearchParams) => apiCall<Restaurant[]>(`/restaurants?${buildQuery(params)}`)
};
```

#### `/lib/api/users.ts` - ユーザーAPI
```typescript
export const userApi = {
  profile: () => apiCall<User>('/user/profile'),
  update: (data: UpdateUserRequest) => apiCall<User>('/user/update', { method: 'PUT', body: JSON.stringify(data) })
};
```

#### `/lib/api/favorites.ts` - お気に入りAPI
```typescript
export const favoriteApi = {
  list: () => apiCall<Favorite[]>('/favorites'),
  add: (restaurantId: string) => apiCall(`/restaurants/${restaurantId}/favorite`, { method: 'POST' }),
  remove: (restaurantId: string) => apiCall(`/restaurants/${restaurantId}/favorite`, { method: 'DELETE' })
};
```

#### `/lib/api/tags.ts` - タグAPI
```typescript
export const tagApi = {
  list: (category: 'area' | 'genre' | 'scene') => apiCall<Tag[]>(`/tags?category=${category}`),
  create: (data: CreateTagRequest) => apiCall<Tag>('/tags', { method: 'POST', body: JSON.stringify(data) }),
  getSceneTags: () => apiCall<Tag[]>('/tags?category=scene') // 既存の専用関数
};
```

#### `/lib/api/reviews.ts` - レビューAPI
```typescript
export const reviewApi = {
  create: (restaurantId: string, data: FormData) => apiCall<Review>(`/restaurants/${restaurantId}/reviews`, { method: 'POST', body: data })
};
```

#### `/lib/api/index.ts` - 統合エクスポート
```typescript
export { authApi } from './auth';
export { restaurantApi } from './restaurants';
export { userApi } from './users';
export { favoriteApi } from './favorites';
export { tagApi } from './tags';
export { reviewApi } from './reviews';
export { apiCall } from './client';

// 後方互換性のためのエイリアス（段階的移行用）
export const authApi_legacy = authApi;
```

## 実装手順

### Phase 1: 基盤準備（1-2時間）
1. `/lib/api/` ディレクトリ作成
2. `client.ts` に共通機能移動
3. 基本的な型定義追加

### Phase 2: ドメイン分割（2-3時間）
1. 各ドメインファイル作成
2. 既存の `authApi` メソッドを適切なファイルに移動
3. `index.ts` で統合エクスポート

### Phase 3: 既存コード移行（3-4時間）
1. hooks での import 文更新
2. 直接 fetch 使用箇所を API client 経由に変更
3. `utils/api.ts` の統合または削除

### Phase 4: 新規エンドポイント実装（2-3時間）
1. 不足している7つのエンドポイント実装
2. 対応する型定義追加
3. テスト追加

### Phase 5: 最適化（1-2時間）
1. 重複コード削除
2. 型ガード関数の最適化
3. エラーハンドリングの改善

## 移行戦略

### 段階的移行
1. **既存コードを破壊しない**: `index.ts` でエイリアス提供
2. **hooks から順次移行**: 一度に1つずつ更新
3. **テスト駆動**: 各移行後にテスト実行

### 後方互換性
```typescript
// 移行期間中の後方互換性維持
export const authApi = {
  ...authApi_new,
  // 既存メソッドのエイリアス
  getTags: tagApi.list,
  createTag: tagApi.create,
  createRestaurant: restaurantApi.create,
  // ...
};
```

## 期待される効果

### 保守性向上
- **責務分離**: 各ドメインの独立性
- **ファイルサイズ**: 191行 → 7ファイル各30-50行
- **変更影響範囲**: ドメイン内に限定

### 開発体験向上
- **IDE補完**: `restaurantApi.` で関連メソッド一覧
- **型安全性**: より厳密な型チェック
- **テスト**: ドメイン単位でのテスト作成

### スケーラビリティ
- **新機能追加**: 該当ドメインファイルのみ変更
- **並行開発**: 複数開発者が異なるドメインで作業可能
- **API変更**: 影響範囲の明確化

## リスク管理

### 移行リスク
- **破壊的変更**: 段階的移行で最小化
- **テスト不足**: 各phase でテスト実行必須
- **型エラー**: TypeScript 厳密モードで早期発見

### 運用リスク
- **複雑性増加**: 明確な命名規則とドキュメント
- **import 混乱**: ESLint ルールで統一
- **パフォーマンス**: Tree shaking 対応済み

## 成功指標

### 技術指標
- [ ] 全既存テストがpass
- [ ] TypeScript エラー0件
- [ ] ESLint 警告0件
- [ ] Bundle サイズ増加 < 5%

### 保守性指標
- [ ] 新規エンドポイント追加時間 < 15分
- [ ] API関連バグ修正時間 < 30分
- [ ] コードレビュー時間 < 50%削減

## まとめ

このリファクタリングにより、現在の単一ファイルAPIクライアントを**保守性・スケーラビリティ・開発体験**すべてが向上したドメイン分割アーキテクチャに移行する。段階的移行により既存システムへの影響を最小化しつつ、将来の機能追加に対応できる基盤を構築する。