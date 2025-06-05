require 'rails_helper'

def auth_headers(user)
  token = JwtService.generate_access_token(user)
  { 'Authorization' => "Bearer #{token}" }
end

RSpec.describe 'Api::Restaurants', type: :request do
  let!(:user) { User.create!(google_id: 'google123', email: 'user@example.com', name: 'User') }
  let!(:area_tag) { Tag.create!(name: '東京', category: 'area') }
  let!(:genre_tag) { Tag.create!(name: 'イタリアン', category: 'genre') }
  let(:headers) { auth_headers(user) }

  describe 'POST /api/restaurants' do
    it '有効なデータでレストランを作成できる' do
      params = { restaurant: { name: '新しいレストラン', area_tag_id: area_tag.id, genre_tag_id: genre_tag.id } }
      expect {
        post '/api/restaurants', params: params, headers: headers, as: :json
      }.to change(Restaurant, :count).by(1)
      expect(response).to have_http_status(:created)
      data = JSON.parse(response.body)
      expect(data['name']).to eq '新しいレストラン'
      expect(data['user_id']).to eq user.id
      expect(data['area_tag_id']).to eq area_tag.id
      expect(data['genre_tag_id']).to eq genre_tag.id
      expect(data['area_tag']['name']).to eq '東京'
      expect(data['area_tag']['category']).to eq 'area'
      expect(data['genre_tag']['name']).to eq 'イタリアン'
      expect(data['genre_tag']['category']).to eq 'genre'
    end

    it 'nameが空なら422' do
      params = { restaurant: { name: '', area_tag_id: area_tag.id, genre_tag_id: genre_tag.id } }
      expect {
        post '/api/restaurants', params: params, headers: headers, as: :json
      }.not_to change(Restaurant, :count)
      expect(response).to have_http_status(:unprocessable_entity)
      data = JSON.parse(response.body)
      expect(data['errors']['name']).to include("can't be blank")
    end

    it 'nameが未指定なら422' do
      params = { restaurant: { area_tag_id: area_tag.id, genre_tag_id: genre_tag.id } }
      expect {
        post '/api/restaurants', params: params, headers: headers, as: :json
      }.not_to change(Restaurant, :count)
      expect(response).to have_http_status(:unprocessable_entity)
      data = JSON.parse(response.body)
      expect(data['errors']['name']).to include("can't be blank")
    end

    it 'area_tag_idが未指定なら422' do
      params = { restaurant: { name: 'テストレストラン', genre_tag_id: genre_tag.id } }
      expect {
        post '/api/restaurants', params: params, headers: headers, as: :json
      }.not_to change(Restaurant, :count)
      expect(response).to have_http_status(:unprocessable_entity)
      data = JSON.parse(response.body)
      expect(data['errors']['area_tag']).to include('must exist')
    end

    it 'genre_tag_idが未指定なら422' do
      params = { restaurant: { name: 'テストレストラン', area_tag_id: area_tag.id } }
      expect {
        post '/api/restaurants', params: params, headers: headers, as: :json
      }.not_to change(Restaurant, :count)
      expect(response).to have_http_status(:unprocessable_entity)
      data = JSON.parse(response.body)
      expect(data['errors']['genre_tag']).to include('must exist')
    end

    it 'area_tag_idが存在しないなら422' do
      params = { restaurant: { name: 'テストレストラン', area_tag_id: 99999, genre_tag_id: genre_tag.id } }
      expect {
        post '/api/restaurants', params: params, headers: headers, as: :json
      }.not_to change(Restaurant, :count)
      expect(response).to have_http_status(:unprocessable_entity)
      data = JSON.parse(response.body)
      expect(data['errors']['area_tag']).to include('must exist')
    end

    it 'genre_tag_idが存在しないなら422' do
      params = { restaurant: { name: 'テストレストラン', area_tag_id: area_tag.id, genre_tag_id: 99999 } }
      expect {
        post '/api/restaurants', params: params, headers: headers, as: :json
      }.not_to change(Restaurant, :count)
      expect(response).to have_http_status(:unprocessable_entity)
      data = JSON.parse(response.body)
      expect(data['errors']['genre_tag']).to include('must exist')
    end

    it 'area_tagがareaカテゴリでなければ422' do
      wrong_tag = Tag.create!(name: '間違いタグ', category: 'genre')
      params = { restaurant: { name: 'テストレストラン', area_tag_id: wrong_tag.id, genre_tag_id: genre_tag.id } }
      expect {
        post '/api/restaurants', params: params, headers: headers, as: :json
      }.not_to change(Restaurant, :count)
      expect(response).to have_http_status(:unprocessable_entity)
      data = JSON.parse(response.body)
      expect(data['errors']['area_tag_id']).to include('must be an area tag')
    end

    it 'genre_tagがgenreカテゴリでなければ422' do
      wrong_tag = Tag.create!(name: '間違いタグ', category: 'area')
      params = { restaurant: { name: 'テストレストラン', area_tag_id: area_tag.id, genre_tag_id: wrong_tag.id } }
      expect {
        post '/api/restaurants', params: params, headers: headers, as: :json
      }.not_to change(Restaurant, :count)
      expect(response).to have_http_status(:unprocessable_entity)
      data = JSON.parse(response.body)
      expect(data['errors']['genre_tag_id']).to include('must be a genre tag')
    end

    it '認証なしなら401' do
      params = { restaurant: { name: 'テストレストラン', area_tag_id: area_tag.id, genre_tag_id: genre_tag.id } }
      expect {
        post '/api/restaurants', params: params, as: :json
      }.not_to change(Restaurant, :count)
      expect(response).to have_http_status(:unauthorized)
    end

    it '不正なトークンなら401' do
      params = { restaurant: { name: 'テストレストラン', area_tag_id: area_tag.id, genre_tag_id: genre_tag.id } }
      invalid_headers = { 'Authorization' => 'Bearer invalid_token' }
      expect {
        post '/api/restaurants', params: params, headers: invalid_headers, as: :json
      }.not_to change(Restaurant, :count)
      expect(response).to have_http_status(:unauthorized)
    end

    it 'nameが空文字なら422' do
      params = { restaurant: { name: '', area_tag_id: area_tag.id, genre_tag_id: genre_tag.id } }
      expect {
        post '/api/restaurants', params: params, headers: headers, as: :json
      }.not_to change(Restaurant, :count)
      expect(response).to have_http_status(:unprocessable_entity)
      data = JSON.parse(response.body)
      expect(data['errors']['name']).to include("can't be blank")
    end

    it 'nameが256文字なら422' do
      params = { restaurant: { name: 'a' * 256, area_tag_id: area_tag.id, genre_tag_id: genre_tag.id } }
      expect {
        post '/api/restaurants', params: params, headers: headers, as: :json
      }.not_to change(Restaurant, :count)
      expect(response).to have_http_status(:unprocessable_entity)
      data = JSON.parse(response.body)
      expect(data['errors']['name']).to include('is too long (maximum is 255 characters)')
    end

    it 'nameが255文字なら作成できる' do
      params = { restaurant: { name: 'a' * 255, area_tag_id: area_tag.id, genre_tag_id: genre_tag.id } }
      expect {
        post '/api/restaurants', params: params, headers: headers, as: :json
      }.to change(Restaurant, :count).by(1)
      expect(response).to have_http_status(:created)
    end
  end
end
