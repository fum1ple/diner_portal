class CreateRestaurants < ActiveRecord::Migration[7.1]
  def change
    create_table :restaurants do |t|
      t.string :name
      t.string :category
      t.string :address
      t.string :phone
      t.string :website

      t.timestamps
    end
  end
end
