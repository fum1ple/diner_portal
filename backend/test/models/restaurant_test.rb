require "test_helper"

class RestaurantTest < ActiveSupport::TestCase
  def setup
    @user = users(:one)
    @area_tag = Tag.create!(name: "東京", category: "area")
    @genre_tag = Tag.create!(name: "イタリアン", category: "genre")

    @valid_restaurant_params = {
      name: "テストレストラン",
      user: @user,
      area_tag: @area_tag,
      genre_tag: @genre_tag
    }
  end

  test "should be valid with valid attributes" do
    restaurant = Restaurant.new(@valid_restaurant_params)
    assert restaurant.valid?
  end

  test "should require name" do
    restaurant = Restaurant.new(@valid_restaurant_params.except(:name))
    assert_not restaurant.valid?
    assert_includes restaurant.errors[:name], "can't be blank"
  end

  test "should require user" do
    restaurant = Restaurant.new(@valid_restaurant_params.except(:user))
    assert_not restaurant.valid?
    assert_includes restaurant.errors[:user_id], "can't be blank"
  end

  test "should require area_tag" do
    restaurant = Restaurant.new(@valid_restaurant_params.except(:area_tag))
    assert_not restaurant.valid?
    assert_includes restaurant.errors[:area_tag_id], "can't be blank"
  end

  test "should require genre_tag" do
    restaurant = Restaurant.new(@valid_restaurant_params.except(:genre_tag))
    assert_not restaurant.valid?
    assert_includes restaurant.errors[:genre_tag_id], "can't be blank"
  end

  test "should validate name length" do
    long_name = "a" * 256
    restaurant = Restaurant.new(@valid_restaurant_params.merge(name: long_name))
    assert_not restaurant.valid?
    assert_includes restaurant.errors[:name], "is too long (maximum is 255 characters)"
  end

  test "should accept maximum length name" do
    max_length_name = "a" * 255
    restaurant = Restaurant.new(@valid_restaurant_params.merge(name: max_length_name))
    assert restaurant.valid?
  end

  test "should validate area_tag category" do
    wrong_category_tag = Tag.create!(name: "フレンチ", category: "genre")
    restaurant = Restaurant.new(@valid_restaurant_params.merge(area_tag: wrong_category_tag))
    assert_not restaurant.valid?
    assert_includes restaurant.errors[:area_tag_id], "must be an area tag"
  end

  test "should validate genre_tag category" do
    wrong_category_tag = Tag.create!(name: "大阪", category: "area")
    restaurant = Restaurant.new(@valid_restaurant_params.merge(genre_tag: wrong_category_tag))
    assert_not restaurant.valid?
    assert_includes restaurant.errors[:genre_tag_id], "must be a genre tag"
  end

  test "should belong to user" do
    restaurant = Restaurant.create!(@valid_restaurant_params)
    assert_equal @user, restaurant.user
    assert_respond_to restaurant, :user
  end

  test "should belong to area_tag" do
    restaurant = Restaurant.create!(@valid_restaurant_params)
    assert_equal @area_tag, restaurant.area_tag
    assert_respond_to restaurant, :area_tag
  end

  test "should belong to genre_tag" do
    restaurant = Restaurant.create!(@valid_restaurant_params)
    assert_equal @genre_tag, restaurant.genre_tag
    assert_respond_to restaurant, :genre_tag
  end

  test "should handle special characters in name" do
    special_names = [
      "café & restaurant",
      "レストラン「美味」",
      "Restaurant l'Étoile",
      "焼肉・韓国料理 金太郎",
      "中華料理 (本格) 龍鳳",
      "Pizza & Pasta 123"
    ]

    special_names.each do |name|
      restaurant = Restaurant.new(@valid_restaurant_params.merge(name: name))
      assert restaurant.valid?, "#{name} should be valid"
    end
  end

  test "should not allow empty name" do
    ["", "   ", "\n\t"].each do |empty_name|
      restaurant = Restaurant.new(@valid_restaurant_params.merge(name: empty_name))
      assert_not restaurant.valid?, "#{empty_name.inspect} should be invalid"
    end
  end

  test "user should have many restaurants" do
    restaurant1 = Restaurant.create!(@valid_restaurant_params)
    restaurant2 = Restaurant.create!(@valid_restaurant_params.merge(name: "別のレストラン"))

    assert_includes @user.restaurants, restaurant1
    assert_includes @user.restaurants, restaurant2
    assert_equal 2, @user.restaurants.count
  end

  test "should save with proper timestamps" do
    restaurant = Restaurant.create!(@valid_restaurant_params)

    assert_not_nil restaurant.created_at
    assert_not_nil restaurant.updated_at
    assert_kind_of Time, restaurant.created_at
    assert_kind_of Time, restaurant.updated_at
  end

  test "should update updated_at when modified" do
    restaurant = Restaurant.create!(@valid_restaurant_params)
    original_updated_at = restaurant.updated_at

    # 少し待ってから更新
    sleep(0.01)
    restaurant.update!(name: "更新されたレストラン名")

    assert restaurant.updated_at > original_updated_at
  end
end
