class RemoveSceneTagIdFromReviews < ActiveRecord::Migration[7.1]
  def change
    remove_column :reviews, :scene_tag_id, :bigint
  end
end
