class AddIndexesToReviews < ActiveRecord::Migration[7.1]
  def change
    # レビューの作成日時順ソート（restaurant showページで使用）
    add_index :reviews, :created_at

    # 特定レストランのレビューを日付順で取得する際のパフォーマンス向上
    add_index :reviews, [:restaurant_id, :created_at]

    # 評価によるフィルタリングや統計処理で使用
    add_index :reviews, :rating

    # レストランの平均評価計算時のパフォーマンス向上
    add_index :reviews, [:restaurant_id, :rating]
  end
end
