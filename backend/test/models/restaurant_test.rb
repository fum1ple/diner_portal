require "test_helper"

class RestaurantTest < ActiveSupport::TestCase
  def setup
    @user = users(:one)
    @area_tag = Tag.create!(name: "東京", category: "area")
    @genre_tag = Tag.create!(name: "イタリアン", category: "genre")
    @restaurant = Restaurant.new(
      name: "テストレストラン",
      user: @user,
      area_tag: @area_tag,
      genre_tag: @genre_tag
    )
  end

  test "should be valid with valid attributes" do
    assert @restaurant.valid?
  end

  test "should require name" do
    @restaurant.name = nil
    assert_not @restaurant.valid?
    assert_includes @restaurant.errors[:name], "can't be blank"
  end

  test "should require user" do
    @restaurant.user = nil
    assert_not @restaurant.valid?
    assert_includes @restaurant.errors[:user], "must exist"
  end

  test "should require area_tag" do
    @restaurant.area_tag = nil
    assert_not @restaurant.valid?
    assert_includes @restaurant.errors[:area_tag], "must exist"
  end

  test "should require genre_tag" do
    @restaurant.genre_tag = nil
    assert_not @restaurant.valid?
    assert_includes @restaurant.errors[:genre_tag], "must exist"
  end

  test "should validate name length" do
    @restaurant.name = "a" * 256
    assert_not @restaurant.valid?
    assert_includes @restaurant.errors[:name], "is too long (maximum is 255 characters)"
  end

  test "should validate area_tag category" do
    wrong_tag = Tag.create!(name: "ジャンル", category: "genre")
    @restaurant.area_tag = wrong_tag
    assert_not @restaurant.valid?
    assert_includes @restaurant.errors[:area_tag_id], "must be an area tag"
  end

  test "should validate genre_tag category" do
    wrong_tag = Tag.create!(name: "エリア", category: "area")
    @restaurant.genre_tag = wrong_tag
    assert_not @restaurant.valid?
    assert_includes @restaurant.errors[:genre_tag_id], "must be a genre tag"
  end

  test "should belong to user" do
    assert_respond_to @restaurant, :user
    assert_instance_of User, @restaurant.user
  end

  test "should belong to area_tag" do
    assert_respond_to @restaurant, :area_tag
    assert_instance_of Tag, @restaurant.area_tag
  end

  test "should belong to genre_tag" do
    assert_respond_to @restaurant, :genre_tag
    assert_instance_of Tag, @restaurant.genre_tag
  end
end
