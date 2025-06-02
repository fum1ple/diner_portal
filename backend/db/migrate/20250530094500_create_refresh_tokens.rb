class CreateRefreshTokens < ActiveRecord::Migration[7.1]
  def change
    create_table :refresh_tokens do |t|
      t.references :user, null: false, foreign_key: true, index: true
      t.string :token, null: false
      t.datetime :expires_at, null: false
      t.string :jti, null: false # JWT ID for token revocation
      t.boolean :revoked, default: false

      t.timestamps
    end

    add_index :refresh_tokens, :token, unique: true
    add_index :refresh_tokens, :jti, unique: true
    add_index :refresh_tokens, :expires_at
  end
end
