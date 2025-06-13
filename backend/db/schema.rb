# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_06_13_112609) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "favorites", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "restaurant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["restaurant_id"], name: "index_favorites_on_restaurant_id"
    t.index ["user_id", "restaurant_id"], name: "index_favorites_on_user_id_and_restaurant_id", unique: true
    t.index ["user_id"], name: "index_favorites_on_user_id"
  end

  create_table "refresh_tokens", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "token", null: false
    t.datetime "expires_at", null: false
    t.string "jti", null: false
    t.boolean "revoked", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["expires_at"], name: "index_refresh_tokens_on_expires_at"
    t.index ["jti"], name: "index_refresh_tokens_on_jti", unique: true
    t.index ["token"], name: "index_refresh_tokens_on_token", unique: true
    t.index ["user_id"], name: "index_refresh_tokens_on_user_id"
  end

  create_table "restaurants", force: :cascade do |t|
    t.string "name"
    t.bigint "user_id", null: false
    t.bigint "area_tag_id", null: false
    t.bigint "genre_tag_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "average_rating", precision: 3, scale: 2, default: "0.0"
    t.integer "review_count", default: 0
    t.index ["area_tag_id", "genre_tag_id"], name: "index_restaurants_on_area_tag_id_and_genre_tag_id"
    t.index ["area_tag_id"], name: "index_restaurants_on_area_tag_id"
    t.index ["average_rating"], name: "index_restaurants_on_average_rating"
    t.index ["created_at"], name: "index_restaurants_on_created_at"
    t.index ["genre_tag_id"], name: "index_restaurants_on_genre_tag_id"
    t.index ["name"], name: "index_restaurants_on_name"
    t.index ["review_count"], name: "index_restaurants_on_review_count"
    t.index ["user_id"], name: "index_restaurants_on_user_id"
  end

  create_table "review_scene_tags", force: :cascade do |t|
    t.bigint "review_id", null: false
    t.bigint "scene_tag_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["review_id", "scene_tag_id"], name: "index_review_scene_tags_on_review_id_and_scene_tag_id", unique: true
    t.index ["review_id"], name: "index_review_scene_tags_on_review_id"
    t.index ["scene_tag_id"], name: "index_review_scene_tags_on_scene_tag_id"
  end

  create_table "reviews", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "restaurant_id", null: false
    t.text "comment", null: false
    t.integer "rating", null: false
    t.string "image_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_at"], name: "index_reviews_on_created_at"
    t.index ["rating"], name: "index_reviews_on_rating"
    t.index ["restaurant_id", "created_at"], name: "index_reviews_on_restaurant_id_and_created_at"
    t.index ["restaurant_id", "rating"], name: "index_reviews_on_restaurant_id_and_rating"
    t.index ["restaurant_id"], name: "index_reviews_on_restaurant_id"
    t.index ["user_id"], name: "index_reviews_on_user_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name"
    t.string "category"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category"], name: "index_tags_on_category"
    t.index ["name", "category"], name: "index_tags_on_name_and_category"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "name", null: false
    t.string "google_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["google_id"], name: "index_users_on_google_id", unique: true
  end

  add_foreign_key "favorites", "restaurants"
  add_foreign_key "favorites", "users"
  add_foreign_key "refresh_tokens", "users"
  add_foreign_key "restaurants", "tags", column: "area_tag_id"
  add_foreign_key "restaurants", "tags", column: "genre_tag_id"
  add_foreign_key "restaurants", "users"
  add_foreign_key "review_scene_tags", "reviews"
  add_foreign_key "review_scene_tags", "tags", column: "scene_tag_id"
  add_foreign_key "reviews", "restaurants"
  add_foreign_key "reviews", "users"
end
