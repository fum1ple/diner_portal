require "test_helper"

class Api::TagsControllerTest < ActionDispatch::IntegrationTest
  def setup
    Tag.delete_all
    @area_tag1 = Tag.create!(name: "渋谷", category: "area")
    @area_tag2 = Tag.create!(name: "新宿", category: "area")
    @genre_tag = Tag.create!(name: "イタリアン", category: "genre")
  end

  test "全件取得できる" do
    get "/api/tags"
    assert_response :success
    json = JSON.parse(response.body)
    assert_equal 3, json.size
    names = json.map { |t| t["name"] }
    assert_includes names, "渋谷"
    assert_includes names, "新宿"
    assert_includes names, "イタリアン"
  end

  test "カテゴリ指定で絞り込める" do
    get "/api/tags?category=area"
    assert_response :success
    json = JSON.parse(response.body)
    assert_equal 2, json.size
    assert json.all? { |t| t["category"] == "area" }
  end

  test "該当カテゴリがない場合は空配列" do
    get "/api/tags?category=unknown"
    assert_response :success
    json = JSON.parse(response.body)
    assert_equal [], json
  end

  test "レスポンス形式が正しい" do
    get "/api/tags"
    json = JSON.parse(response.body)
    tag = json.first
    assert_equal %w[id name category].sort, tag.keys.sort
  end
end
