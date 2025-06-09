class AddIndexesToRestaurants < ActiveRecord::Migration[7.1]
  def change
    # レストラン一覧の作成日時順ソート（indexページで使用）
    add_index :restaurants, :created_at
    
    # 平均評価による並び替えで使用
    add_index :restaurants, :average_rating
    
    # レビュー数による並び替えで使用
    add_index :restaurants, :review_count
    
    # エリアとジャンルでの複合検索で使用
    add_index :restaurants, [:area_tag_id, :genre_tag_id]
    
    # 名前での部分一致検索で使用（将来の検索機能用）
    # PostgreSQLの場合はgin/gistインデックスが適している
    # 今回はシンプルなB-treeインデックスを作成
    add_index :restaurants, :name
  end
end
