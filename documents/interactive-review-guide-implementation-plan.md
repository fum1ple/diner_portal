# インタラクティブレビューガイド実装計画

## 概要

ReviewFormのレビューガイドをよりインタラクティブな形にし、シーンタグをカテゴリ分けして予算・人数・利用シーンなどで構造化する機能の実装計画です。

## 現在のシステム分析

### データベース構造
- **テーブル**: `tags`テーブルの`category`カラムで分類
- **現在のカテゴリ**: 'area', 'genre', 'scene'
- **シーンタグ**: 一人、ビジネス、歓送迎会、飲み会、ランチ、ディナー等（12種類）
- **関連**: レビューとシーンタグは多対多の関係（`review_scene_tags`テーブル）

### 現在の制約
1. **単一カテゴリシステム**: 全シーンタグが一つのフラットなカテゴリ
2. **予算情報なし**: 価格・予算の分類なし
3. **人数情報なし**: パーティーサイズの適用性なし
4. **シーンコンテキストの制限**: 現在のシーンは利用文脈と食事時間が混在

## 新しいタグカテゴリシステム設計

### 拡張カテゴリ構造

```typescript
type TagCategory = 
  | 'area'           // 既存：地域
  | 'genre'          // 既存：ジャンル  
  | 'scene'          // 既存：利用シーン（改良）
  | 'budget'         // 新規：予算レンジ
  | 'group_size'     // 新規：人数
  | 'dining_time'    // 新規：食事時間（sceneから分離）
  | 'occasion'       // 新規：利用目的（sceneから分離）
```

### 新しいタグデータ構造

```ruby
# 予算カテゴリ
budget_tags = [
  '〜1,000円', '1,000〜2,000円', '2,000〜3,000円', 
  '3,000〜5,000円', '5,000〜8,000円', '8,000円〜'
]

# 人数カテゴリ
group_size_tags = [
  '一人', '2人', '3-4人', '5-8人', '9-15人', '16人以上'
]

# 食事時間カテゴリ（sceneから分離）
dining_time_tags = [
  'モーニング', 'ランチ', 'ディナー', '深夜', '24時間'
]

# 利用目的カテゴリ（sceneから分離・改良）
occasion_tags = [
  'ビジネス', '接待', '歓送迎会', '飲み会', 'デート', 
  'お祝い', '女子会', '家族', 'カジュアル', 'フォーマル'
]
```

## バックエンド実装計画

### フェーズ1: データベース拡張

#### マイグレーション（パフォーマンス最適化版）
```ruby
class AddNewTagCategories < ActiveRecord::Migration[7.1]
  def up
    # バルクインサートでパフォーマンス向上
    timestamp = Time.current
    
    # 予算タグの追加
    budget_tags = ['〜1,000円', '1,000〜2,000円', '2,000〜3,000円', '3,000〜5,000円', '5,000〜8,000円', '8,000円〜']
    budget_data = budget_tags.map { |name| 
      { name: name, category: 'budget', created_at: timestamp, updated_at: timestamp }
    }
    
    # 人数タグの追加
    group_size_tags = ['一人', '2人', '3-4人', '5-8人', '9-15人', '16人以上']
    group_size_data = group_size_tags.map { |name| 
      { name: name, category: 'group_size', created_at: timestamp, updated_at: timestamp }
    }
    
    # 食事時間タグの追加
    dining_time_tags = ['モーニング', 'ランチ', 'ディナー', '深夜', '24時間']
    dining_time_data = dining_time_tags.map { |name| 
      { name: name, category: 'dining_time', created_at: timestamp, updated_at: timestamp }
    }
    
    # 利用目的タグの追加
    occasion_tags = ['ビジネス', '接待', '歓送迎会', '飲み会', 'デート', 'お祝い', '女子会', '家族', 'カジュアル', 'フォーマル']
    occasion_data = occasion_tags.map { |name| 
      { name: name, category: 'occasion', created_at: timestamp, updated_at: timestamp }
    }
    
    # 全データを一度にインサート
    all_tag_data = budget_data + group_size_data + dining_time_data + occasion_data
    Tag.insert_all(all_tag_data)
  end
  
  def down
    # ロールバック処理
    Tag.where(category: ['budget', 'group_size', 'dining_time', 'occasion']).destroy_all
  end
end
```

#### パフォーマンス最適化のためのインデックス追加
```ruby
class AddIndexesForTagPerformance < ActiveRecord::Migration[7.1]
  def change
    # カテゴリ別検索の高速化
    add_index :tags, [:category, :name], name: 'index_tags_on_category_and_name'
    
    # レビューごとのタグ取得を高速化
    add_index :review_scene_tags, [:review_id, :scene_tag_id], 
              unique: true, 
              name: 'index_review_scene_tags_on_review_and_tag'
    
    # タグ一覧取得を高速化（covering index）
    add_index :tags, [:category, :name, :id], 
              name: 'index_tags_covering_for_lists'
  end
end
```

### フェーズ2: モデル拡張（パフォーマンス最適化版）

#### Review モデルに新しい関連を追加
```ruby
class Review < ApplicationRecord
  # 既存の関連
  has_many :review_scene_tags, dependent: :destroy
  has_many :scene_tags, -> { where(category: 'scene') }, through: :review_scene_tags, source: :tag
  
  # パフォーマンス最適化: 全タグを一度に取得してメモリ内で分類
  has_many :all_tags, through: :review_scene_tags, source: :tag
  
  # N+1を防ぐスコープ
  scope :with_all_tags, -> {
    includes(review_scene_tags: :tag)
  }
  
  # メモリ内でカテゴリ分類（N+1問題を回避）
  def tags_by_category
    @tags_by_category ||= review_scene_tags
      .includes(:tag)
      .map(&:tag)
      .group_by(&:category)
  end
  
  # 各カテゴリのタグを取得するメソッド
  def budget_tags
    tags_by_category['budget'] || []
  end
  
  def group_size_tags
    tags_by_category['group_size'] || []
  end
  
  def dining_time_tags
    tags_by_category['dining_time'] || []
  end
  
  def occasion_tags
    tags_by_category['occasion'] || []
  end
end
```

### フェーズ3: API拡張（パフォーマンス最適化版）

#### TagsController に複合エンドポイントを追加
```ruby
class Api::TagsController < ApplicationController
  # 全カテゴリのタグを一度に取得（複数APIコールを削減）
  def all_categories
    tags = Tag.select(:id, :name, :category)
              .order(:category, :name)
    
    categorized_tags = tags.group_by(&:category)
    
    # HTTPキャッシュでパフォーマンス向上
    fresh_when(tags, public: true)
    expires_in 1.day, public: true
    
    render json: {
      budget: serialize_tags(categorized_tags['budget'] || []),
      group_size: serialize_tags(categorized_tags['group_size'] || []),
      dining_time: serialize_tags(categorized_tags['dining_time'] || []),
      occasion: serialize_tags(categorized_tags['occasion'] || [])
    }
  end
  
  private
  
  def serialize_tags(tags)
    tags.map { |tag| { id: tag.id, name: tag.name } }
  end
end
```

#### ReviewsController パラメータ拡張
```ruby
class Api::ReviewsController < ApplicationController
  def index
    # Eager Loadingで N+1 問題を防ぐ
    reviews = Review.with_all_tags
                    .includes(:user, :restaurant)
                    .page(params[:page])
    
    render json: ReviewSerializer.new(reviews).serializable_hash
  end
  
  private
  
  def review_params
    params.require(:review).permit(
      :rating, :comment, :image,
      scene_tag_ids: [],        # 既存（occasion用に転用）
      budget_tag_ids: [],       # 新規
      group_size_tag_ids: [],   # 新規
      dining_time_tag_ids: [],  # 新規
      occasion_tag_ids: []      # 新規（scene_tag_idsから移行）
    )
  end
end
```

#### ReviewCreationService 拡張（バルク操作最適化）
```ruby
class ReviewCreationService
  private
  
  def create_all_tag_associations
    tag_associations = []
    
    # 全カテゴリのタグIDを収集
    all_tag_ids = [
      @review_data[:budget_tag_ids],
      @review_data[:group_size_tag_ids],
      @review_data[:dining_time_tag_ids],
      @review_data[:occasion_tag_ids]
    ].flatten.compact
    
    return if all_tag_ids.empty?
    
    # 一度のクエリで全タグの存在確認
    valid_tag_ids = Tag.where(id: all_tag_ids).pluck(:id)
    
    # バルクインサート用のデータ準備
    timestamp = Time.current
    valid_tag_ids.each do |tag_id|
      tag_associations << {
        review_id: @review.id,
        scene_tag_id: tag_id,
        created_at: timestamp,
        updated_at: timestamp
      }
    end
    
    # 一度のクエリで全て挿入
    ReviewSceneTag.insert_all(tag_associations) if tag_associations.any?
  end
end
```

## フロントエンド実装計画

### インタラクティブガイドコンポーネント設計

#### InteractiveReviewGuide コンポーネント
```typescript
interface InteractiveReviewGuideProps {
  onTagSelection: (category: string, tagIds: number[]) => void;
  selectedTags: {
    budget: number[];
    groupSize: number[];
    diningTime: number[];
    occasion: number[];
  };
}

const InteractiveReviewGuide: React.FC<InteractiveReviewGuideProps> = ({
  onTagSelection,
  selectedTags
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      id: 'budget',
      title: '💰 予算はどのくらいでしたか？',
      description: '一人あたりの料金を教えてください',
      type: 'single-select',
      category: 'budget'
    },
    {
      id: 'groupSize', 
      title: '👥 何人で利用しましたか？',
      description: '人数に応じておすすめが変わります',
      type: 'single-select',
      category: 'group_size'
    },
    {
      id: 'diningTime',
      title: '🕐 いつ利用しましたか？',
      description: '時間帯によって雰囲気が異なります',
      type: 'single-select',
      category: 'dining_time'
    },
    {
      id: 'occasion',
      title: '🎯 どんな目的で利用しましたか？',
      description: '複数選択できます',
      type: 'multi-select',
      category: 'occasion'
    }
  ];
  
  // ステップ形式のUI実装...
};
```

### ステップ形式のUI設計

#### 機能要件
1. **プログレス表示**: 4ステップのプログレスバー
2. **カテゴリ別選択**: 各ステップで該当カテゴリのタグを表示
3. **選択状態の視覚化**: 選択済みタグのハイライト表示
4. **レビュー内容への反映**: 選択内容に基づいたコメント例の提示
5. **前後のナビゲーション**: ステップ間の自由な移動
6. **リアルタイム更新**: 選択内容の即座反映

#### UI コンポーネント構造
```
InteractiveReviewGuide/
├── StepIndicator.tsx          # プログレスバー
├── StepContent.tsx           # 各ステップの内容
├── TagSelector.tsx           # タグ選択UI
├── NavigationButtons.tsx     # 前へ/次へボタン
└── CommentSuggestions.tsx    # コメント例表示
```

### ReviewForm 統合

#### ReviewForm 内への組み込み
```typescript
const ReviewForm: React.FC<ReviewFormProps> = ({ restaurantId, onReviewSubmit, onCancel }) => {
  const [selectedTags, setSelectedTags] = useState({
    budget: [],
    groupSize: [],
    diningTime: [],
    occasion: []
  });
  
  const [showInteractiveGuide, setShowInteractiveGuide] = useState(true);
  
  const handleTagSelection = (category: string, tagIds: number[]) => {
    setSelectedTags(prev => ({
      ...prev,
      [category]: tagIds
    }));
  };
  
  // フォーム送信時に全カテゴリのタグを含める
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const reviewData: CreateReviewRequest = {
      rating,
      comment,
      image: image || undefined,
      budget_tag_ids: selectedTags.budget,
      group_size_tag_ids: selectedTags.groupSize,
      dining_time_tag_ids: selectedTags.diningTime,
      occasion_tag_ids: selectedTags.occasion,
    };
    
    createReviewMutation.mutate(reviewData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* 既存のフォーム要素 */}
      
      {showInteractiveGuide && (
        <InteractiveReviewGuide
          onTagSelection={handleTagSelection}
          selectedTags={selectedTags}
        />
      )}
      
      {/* 従来のSceneTagSelectorは隠すかオプションとして残す */}
      
      {/* 送信ボタン等 */}
    </form>
  );
};
```

## データフロー設計

### タグ取得の最適化（複数APIコール削減）
```typescript
// 単一エンドポイントで全カテゴリを取得
export const useAllTags = () => {
  return useQuery({
    queryKey: ['tags', 'all-categories'],
    queryFn: () => tagsApi.getAllCategorizedTags(),
    staleTime: 24 * 60 * 60 * 1000, // 24時間キャッシュ
    cacheTime: 24 * 60 * 60 * 1000,
  });
};

// APIクライアントの追加
class TagsApi {
  async getAllCategorizedTags(): Promise<{
    budget: Tag[];
    group_size: Tag[];
    dining_time: Tag[];
    occasion: Tag[];
  }> {
    const response = await this.httpClient.get('/api/tags/all_categories');
    return response.data;
  }
}
```

## 実装順序

### フェーズ1: バックエンド基盤 (優先度: 高)
1. **マイグレーション作成・実行**
   - 新しいカテゴリのタグ追加（バルクインサート最適化）
   - パフォーマンス向上のためのインデックス追加
   - 既存タグの再分類（必要に応じて）
2. **新しいタグデータのseed追加**
   - 予算・人数・食事時間・利用目的タグ
3. **モデルの関連追加**
   - Review モデルにパフォーマンス最適化された関連を追加
   - N+1問題を防ぐスコープとメソッドの実装
4. **APIパラメータ拡張**
   - TagsController に複合エンドポイント追加
   - ReviewsController のパラメータ拡張
   - ReviewCreationService のバルク操作最適化

### フェーズ2: フロントエンド基盤 (優先度: 高)  
1. **タグ取得用のhook拡張**
   - useMultipleTags hook の実装
   - 既存 useTags の拡張
2. **型定義の更新**
   - CreateReviewRequest 型の拡張
   - Tag 関連型の更新
3. **ReviewFormの基本構造変更**
   - 新しいタグカテゴリ対応
   - フォーム送信処理の更新

### フェーズ3: インタラクティブUI (優先度: 中)
1. **InteractiveReviewGuideコンポーネント作成**
   - ステップ形式の基本構造
   - プログレス表示機能
2. **ステップ形式のUI実装**
   - TagSelector コンポーネント
   - ナビゲーション機能
   - 選択状態の管理
3. **ReviewForm内への統合**
   - 従来フォームとの統合
   - UX の調整

### フェーズ4: テスト・改善 (優先度: 中)
1. **バックエンドテスト追加**
   - 新しいカテゴリのタグ作成テスト
   - レビュー作成時のタグ関連テスト
2. **フロントエンドテスト追加**
   - InteractiveReviewGuide のテスト
   - タグ選択機能のテスト
3. **UX改善・デザイン調整**
   - アニメーション追加
   - レスポンシブ対応
   - アクセシビリティ改善

## 期待される効果

### ユーザビリティ向上
- **ガイド付きレビュー作成**: ステップ形式で迷わずレビュー作成
- **構造化された情報入力**: カテゴリ別の選択で情報の整理が容易
- **リアルタイムフィードバック**: 選択内容に応じたコメント例の提示

### データ品質向上
- **構造化されたタグ情報**: 検索・フィルタリング精度の向上
- **一貫性のあるデータ**: カテゴリ分けによる情報の標準化
- **より詳細な店舗情報**: 予算・人数・シーン情報の充実

### システムの拡張性
- **レコメンデーション強化**: 詳細なタグ情報での推薦精度向上
- **分析機能の向上**: カテゴリ別の統計・分析が可能
- **検索機能の強化**: 多次元での店舗検索機能

## リスク・考慮事項

### 技術的リスク
- **既存データとの互換性**: 現在のシーンタグとの整合性確保
- **パフォーマンス**: 複数カテゴリのタグ取得による負荷 → **対策済み（単一エンドポイント、適切なインデックス、バルク操作）**
- **マイグレーションの安全性**: 本番データへの影響 → **対策済み（バルクインサートによる高速化）**

### UXリスク
- **複雑さの増加**: ステップが多すぎることによる離脱率上昇
- **学習コスト**: 新しいUI への慣れが必要
- **従来ユーザーへの影響**: 既存の使い方からの変更

### 対策
- **段階的リリース**: フェーズ別の実装で影響を最小化
- **A/Bテスト**: 新旧UIでの比較検証
- **フォールバック機能**: 従来のシンプルモードも選択可能に
- **十分なテスト**: 各フェーズでの充分な動作確認
- **パフォーマンス監視**: 適切なインデックスとHTTPキャッシュによる負荷軽減
- **データベース最適化**: バルク操作とEager Loadingによるクエリ効率化

## まとめ

この実装計画により、ReviewFormのインタラクティブ化を通じて、ユーザーがより簡単かつ構造化された方法でレビューを作成できるようになります。段階的な実装により、リスクを最小化しながら、システム全体の価値向上を目指します。

実装開始前に、各フェーズの詳細な作業項目の定義と、必要に応じた計画の調整を行うことを推奨します。