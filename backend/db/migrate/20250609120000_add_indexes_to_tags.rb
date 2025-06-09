class AddIndexesToTags < ActiveRecord::Migration[7.1]
  def change
    # categoryでの絞り込み検索（GET /api/tags?category=area）で使用
    add_index :tags, :category
    
    # name + categoryの組み合わせでの検索パフォーマンス向上
    # 将来的に重複チェックなどで使用される可能性
    add_index :tags, [:name, :category]
  end
end
