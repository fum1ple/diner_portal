class CreateReviewSceneTags < ActiveRecord::Migration[7.1]
  def change
    create_table :review_scene_tags do |t|
      t.references :review, null: false, foreign_key: true
      t.references :scene_tag, null: false, foreign_key: { to_table: :tags }

      t.timestamps
    end
    
    # 同じreviewに同じscene_tagを重複して追加できないようにする
    add_index :review_scene_tags, [:review_id, :scene_tag_id], unique: true
  end
end
