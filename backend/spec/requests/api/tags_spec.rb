require 'rails_helper'

RSpec.describe "Api::Tags", type: :request do
  describe "GET /api/tags" do
    let!(:area_tag1) { Tag.create!(name: "渋谷", category: "area") }
    let!(:area_tag2) { Tag.create!(name: "新宿", category: "area") }
    let!(:genre_tag) { Tag.create!(name: "イタリアン", category: "genre") }

    it "全件取得できる" do
      get "/api/tags"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.size).to eq(3)
      expect(json.map { |t| t["name"] }).to include("渋谷", "新宿", "イタリアン")
    end

    it "カテゴリ指定で絞り込める" do
      get "/api/tags?category=area"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.size).to eq(2)
      expect(json.all? { |t| t["category"] == "area" }).to be true
    end

    it "該当カテゴリがない場合は空配列" do
      get "/api/tags?category=unknown"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json).to eq([])
    end

    it "レスポンス形式が正しい" do
      get "/api/tags"
      json = JSON.parse(response.body)
      tag = json.first
      expect(tag.keys).to contain_exactly("id", "name", "category")
    end
  end
end
