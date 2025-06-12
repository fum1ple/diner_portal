# 修正後の、正しいコード
class CreateFavorites < ActiveRecord::Migration[7.1]
  def change
    create_table :favorites do |t|
      t.references :user, null: false, foreign_key: true
      t.references :restaurant, null: false, foreign_key: true

      t.timestamps

      # add_indexをこのブロックの中に移動させる
      t.index [:user_id, :restaurant_id], unique: true
    end
  end
end