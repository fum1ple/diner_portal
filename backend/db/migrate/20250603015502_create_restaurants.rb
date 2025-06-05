class CreateRestaurants < ActiveRecord::Migration[7.1]
  def change
    create_table :restaurants do |t|
      t.string :name
      t.references :user, null: false, foreign_key: true
      t.references :area_tag, null: false, foreign_key: { to_table: :tags }
      t.references :genre_tag, null: false, foreign_key: { to_table: :tags }

      t.timestamps
    end
  end
end
