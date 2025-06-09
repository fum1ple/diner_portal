require 'rails_helper'

def auth_headers(user)
  token = JwtService.encode(user_id: user.id)
  { 'Authorization' => "Bearer #{token}" }
end

RSpec.describe "Api::Tags", type: :request do
  let!(:user) { User.create!(google_id: 'google123', email: 'user@example.com', name: 'User') }
  let(:headers) { auth_headers(user) }

  describe "GET /api/tags" do
    before do
      Tag.delete_all
    end

    let!(:area_tag1) { Tag.create!(name: "渋谷", category: "area") }
    let!(:area_tag2) { Tag.create!(name: "新宿", category: "area") }
    let!(:genre_tag) { Tag.create!(name: "イタリアン", category: "genre") }

    it "全件取得できる" do
      get "/api/tags", headers: headers
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.size).to eq(3)
      expect(json.map { |t| t["name"] }).to include("渋谷", "新宿", "イタリアン")
    end

    it "カテゴリ指定で絞り込める" do
      get "/api/tags?category=area", headers: headers
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.size).to eq(2)
      expect(json.all? { |t| t["category"] == "area" }).to be true
    end

    it "該当カテゴリがない場合は空配列" do
      get "/api/tags?category=unknown", headers: headers
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json).to eq([])
    end

    it "レスポンス形式が正しい" do
      get "/api/tags", headers: headers
      json = JSON.parse(response.body)
      tag = json.first
      expect(tag.keys).to contain_exactly("id", "name", "category")
    end

    it "未認証の場合401" do
      get "/api/tags"
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "POST /api/tags" do
    before do
      Tag.delete_all
    end

    it "有効なデータでタグを作成できる" do
      params = { tag: { name: "六本木", category: "area" } }
      expect {
        post '/api/tags', params: params, headers: headers, as: :json
      }.to change(Tag, :count).by(1)

      expect(response).to have_http_status(:created)
      data = JSON.parse(response.body)
      expect(data['name']).to eq '六本木'
      expect(data['category']).to eq 'area'
    end

    it "nameが空なら422" do
      params = { tag: { name: '', category: 'area' } }
      expect {
        post '/api/tags', params: params, headers: headers, as: :json
      }.not_to change(Tag, :count)
      expect(response).to have_http_status(:unprocessable_entity)
      data = JSON.parse(response.body)
      expect(data['errors']['name']).to include("can't be blank")
    end

    it "categoryが空なら422" do
      params = { tag: { name: '六本木', category: '' } }
      expect {
        post '/api/tags', params: params, headers: headers, as: :json
      }.not_to change(Tag, :count)
      expect(response).to have_http_status(:unprocessable_entity)
      data = JSON.parse(response.body)
      expect(data['errors']['category']).to include("can't be blank")
    end

    it "無効なcategoryなら422" do
      params = { tag: { name: '六本木', category: 'invalid' } }
      expect {
        post '/api/tags', params: params, headers: headers, as: :json
      }.not_to change(Tag, :count)
      expect(response).to have_http_status(:unprocessable_entity)
      data = JSON.parse(response.body)
      expect(data['errors']['category']).to include('is not included in the list')
    end

    it "未認証の場合401" do
      params = { tag: { name: '六本木', category: 'area' } }
      expect {
        post '/api/tags', params: params, as: :json
      }.not_to change(Tag, :count)
      expect(response).to have_http_status(:unauthorized)
    end

    it "重複するnameとcategoryの組み合わせを許可" do
      Tag.create!(name: "六本木", category: "area")
      params = { tag: { name: "六本木", category: "genre" } }
      expect {
        post '/api/tags', params: params, headers: headers, as: :json
      }.to change(Tag, :count).by(1)
      expect(response).to have_http_status(:created)
    end
  end
end
