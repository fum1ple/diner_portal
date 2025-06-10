# Day 7: 検索機能FE と お気に入り機能BE (1日間)

## 1日の目標

- 店舗一覧ページに検索フォーム（店舗名、エリア、ジャンル）を実装し、APIと連携させる。
- お気に入り機能のバックエンド（モデル作成、登録・解除API、一覧取得API）を実装する。

---

## 午前 (約3.5時間): 検索機能フロントエンド (FE) 実装

### タスク 7.1: 【設計】検索UI 仕様最終確認 (約0.5時間)
- 🎯 **ゴール**: 店舗一覧ページに設置する検索フォームのUI（店舗名入力、エリアタグ選択、ジャンルタグ選択、検索ボタン）の見た目、配置、動作、および使用するAPIパラメータについてチームで最終確認する。
- **担当目安**: 2人。
- **内容**:
    - Day6で実装した検索API (`GET /api/restaurants` の絞り込みパラメータ) との連携方法を再確認。
    - 検索条件クリア時の動作なども検討。
- **実装タスク**:
    - UIデザイン（ワイヤーフレームレベル）とAPI連携方法の認識合わせ。

### タスク 7.2: 【FE】検索フォームUIコンポーネント作成 (約1.5時間)
- 🎯 **ゴール**: 店舗一覧ページに、店舗名入力、エリアタグ選択（プルダウン等）、ジャンルタグ選択（プルダウン等）、検索実行ボタンを含む検索フォームUIを作成する。
- **担当目安**: 2ヶ月目の方主担当、2年目の方UIデザイン指示・コンポーネント設計サポート (AI活用推奨)。
- **内容**:
    - 店舗名入力: `<input type="text">`
    - エリアタグ選択: `<select>` (Day2で作成したタグ一覧API `GET /api/tags?category=area` を利用)
    - ジャンルタグ選択: `<select>` (Day2で作成したタグ一覧API `GET /api/tags?category=genre` を利用)
    - 検索実行ボタン。
    - フォーム全体のレイアウトと基本的なスタイリング。
- **実装タスク**:
    - 検索フォーム用のReactコンポーネント作成。
    - タグ一覧APIを呼び出し、選択肢を`<select>`に設定するロジック (Day4の店舗登録フォーム実装を参考に)。

### タスク 7.3: 【FE】検索条件による店舗一覧API連携 (約1.5時間)
- 🎯 **ゴール**: 検索フォームで入力・選択された条件を元に、店舗一覧APIを検索パラメータ付きで呼び出し、結果を店舗一覧部分に再表示する。
- **担当目安**: 2年目の方主導、2ヶ月目の方サポート (ペアプロ推奨)。
- **内容**:
    - 検索条件（店舗名、選択されたエリアタグID、ジャンルタグID）をReactのstate（またはZustand）で管理。
    - 検索ボタンクリック時に、これらの条件をクエリパラメータとして店舗一覧API (`GET /api/restaurants`) に渡し、結果を更新して表示。
    - 検索条件がクリアされた場合（例: 全件表示に戻すボタンなど）の処理も実装。
    - **備考**: 店舗名のテキスト入力には、将来的に「デバウンス（Debounce）」を適用するとUXが向上します。
- **実装タスク**:
    - 検索条件のstate定義と更新ロジック。
    - API呼び出し関数の実装（検索パラメータを動的に付与）。
    - 検索結果を一覧表示コンポーネントに反映させる処理。

---

## 午後 (約3.5時間): お気に入り機能バックエンド (BE) 実装

### タスク 7.4: 【設計】お気に入りAPI 仕様確認 (約0.25時間)
- 🎯 **ゴール**: お気に入り機能に必要なAPIエンドポイント（登録、解除、自分の一覧取得）とリクエスト/レスポンス形式をチームで最終確認する。
- **担当目安**: 2人。
- **内容**:
    - お気に入り登録: `POST /api/restaurants/:restaurant_id/favorites` (認証必須)
    - お気に入り解除: `DELETE /api/restaurants/:restaurant_id/favorites` (認証必須)
    - 自分のお気に入り一覧取得: `GET /api/favorites` (認証必須)
- **実装タスク**:
    - API仕様書にお気に入りAPIの詳細を追記・更新。

### タスク 7.5: 【DB・モデル】Favorite モデル作成・マイグレーション・関連付け (約0.5時間)
- 🎯 **ゴール**: Favoriteテーブルを作成し、UserおよびRestaurantモデルとの関連（多対多）を設定する。
- **担当目安**: 2年目の方。
- **内容 (Ruby on Rails)**:
    - `rails g model Favorite user:references restaurant:references` を実行。
    - 生成されたマイグレーションファイルに `add_index :favorites, [:user_id, :restaurant_id], unique: true` を追加。
    - `rails db:migrate` を実行。
    - User モデルに `has_many :favorites, dependent: :destroy` と `has_many :favorite_restaurants, through: :favorites, source: :restaurant` を追加。
    - Restaurant モデルに `has_many :favorites, dependent: :destroy` と `has_many :favoriting_users, through: :favorites, source: :user` を追加。
- **実装タスク**:
    - モデルファイル、マイグレーションファイルの作成・編集・実行。

### タスク 7.6: 【BE】お気に入り登録/解除API実装 (約2.0時間)
- 🎯 **ゴール**: 認証ユーザーが特定の店舗をお気に入り登録したり、解除したりできるようにするAPIロジックを実装する。
- **担当目安**: 2年目の方主導、2ヶ月目の方サポート。
- **内容 (Ruby on Rails)**:
    - `config/routes.rb` にネストしたルーティング（例: `resources :restaurants do resource :favorite, only: [:create, :destroy], controller: 'api/favorites' end`）を設定。
    - `app/controllers/api/favorites_controller.rb` を作成。
    - `create` アクション: `current_user.favorites.create(restaurant_id: params[:restaurant_id])`。成功/失敗レスポンス。
    - `destroy` アクション: `current_user.favorites.find_by(restaurant_id: params[:restaurant_id])&.destroy`。成功/失敗レスポンス。
    - 各アクションで認証を必須とする (`before_action :authenticate_user!`)。
    - **備考**: `resource :favorite` (単数形) の利用は、このケースに最適な良い設計です。
- **実装タスク**:
    - ルーティング記述。
    - コントローラとアクションのコーディング。
    - エラーハンドリング（既に登録済みの場合や、存在しないお気に入りの解除など、冪等性を考慮）。

### タスク 7.7: 【BE】お気に入り一覧取得API実装 (約0.75時間)
- 🎯 **ゴール**: 認証ユーザーがお気に入り登録した店舗の一覧を取得できるAPIロジックを実装する。
- **担当目安**: 2ヶ月目の方挑戦、2年目の方サポート。
- **内容 (Ruby on Rails)**:
    - `Api::FavoritesController` に `index` アクションを追加（または別コントローラ）。
    - `current_user.favorite_restaurants.includes(:area_tag, :genre_tag)` でお気に入り店舗一覧を取得。
    - 店舗一覧APIと同様の形式（必要な情報のみ）でJSONを返す。認証必須。
    - **備考**: 将来的な件数増加に備え、「ページネーション」の導入も視野に入れると、より堅牢な設計になります。
- **実装タスク**:
    - `index` アクションのコーディング。
    - レスポンスJSONの整形。

---

## 夕方 (約1時間): テストとDay7完了確認

### タスク 7.8: 【テスト・共通】検索FE(簡易)・お気に入りAPI(BE)手動テスト、Day7タスク完了確認、課題洗い出し (約1時間)
- 🎯 **ゴール**: Day7で実装した検索FEの基本動作と、お気に入り機能のBE APIが正しく動作することを確認し、問題点や翌日への申し送り事項を明確にする。
- **担当目安**: 2人。
- **内容**:
    - 店舗一覧ページで検索フォームを使い、いくつかの条件で検索が機能するか（APIが正しく呼ばれ、結果が反映されるか）簡易的に確認。
    - Postman等で認証トークンを使い、お気に入り登録・解除・一覧取得APIをテスト。DBのデータも確認。
    - 本日実施したタスクの完了状況、課題の共有。
