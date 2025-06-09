class CreateReviews < ActiveRecord::Migration[7.1]
  def change
    create_table :reviews do |t|
      t.references :user, null: false, foreign_key: true
      t.references :restaurant, null: false, foreign_key: true
      t.references :scene_tag, null: true, foreign_key: { to_table: :tags }
      t.text :comment, null: false
      t.integer :rating, null: false
      t.string :image_url

      t.timestamps
    end
  end
end
