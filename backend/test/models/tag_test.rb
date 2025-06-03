require "test_helper"

class TagTest < ActiveSupport::TestCase
  test "should be valid with valid attributes" do
    tag = Tag.new(name: "東京", category: "area")
    assert tag.valid?
  end

  test "should require name" do
    tag = Tag.new(category: "area")
    assert_not tag.valid?
    assert_includes tag.errors[:name], "can't be blank"
  end

  test "should require category" do
    tag = Tag.new(name: "東京")
    assert_not tag.valid?
    assert_includes tag.errors[:category], "can't be blank"
  end

  test "should validate category inclusion" do
    tag = Tag.new(name: "テスト", category: "invalid")
    assert_not tag.valid?
    assert_includes tag.errors[:category], "is not included in the list"
  end

  test "should accept area category" do
    tag = Tag.new(name: "東京", category: "area")
    assert tag.valid?
  end

  test "should accept genre category" do
    tag = Tag.new(name: "イタリアン", category: "genre")
    assert tag.valid?
  end

  test "should validate name length" do
    tag = Tag.new(name: "a" * 256, category: "area")
    assert_not tag.valid?
    assert_includes tag.errors[:name], "is too long (maximum is 255 characters)"
  end

  test "area_tags scope should return only area tags" do
    area_tag = Tag.create!(name: "東京", category: "area")
    genre_tag = Tag.create!(name: "イタリアン", category: "genre")
    
    area_tags = Tag.area_tags
    assert_includes area_tags, area_tag
    assert_not_includes area_tags, genre_tag
  end

  test "genre_tags scope should return only genre tags" do
    area_tag = Tag.create!(name: "東京", category: "area")
    genre_tag = Tag.create!(name: "イタリアン", category: "genre")
    
    genre_tags = Tag.genre_tags
    assert_includes genre_tags, genre_tag
    assert_not_includes genre_tags, area_tag
  end
end
