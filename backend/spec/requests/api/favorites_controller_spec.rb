require 'rails_helper'

def auth_headers(user)
  token = JwtService.generate_access_token(user)
  { 'Authorization' => "Bearer #{token}" }
end

RSpec.describe 'Api::Favorites', type: :request do
  let!(:user) { User.create!(google_id: 'google123', email: 'user@example.com', name: 'User') }
  let!(:another_user) { User.create!(google_id: 'google456', email: 'another@example.com', name: 'Another User') }
  let!(:area_tag) { Tag.create!(name: '東京', category: 'area') }
  let!(:genre_tag) { Tag.create!(name: 'イタリアン', category: 'genre') }
  let!(:restaurant) { Restaurant.create!(name: 'テストレストラン', user: user, area_tag: area_tag, genre_tag: genre_tag) }
  let!(:another_restaurant) { Restaurant.create!(name: '別のレストラン', user: user, area_tag: area_tag, genre_tag: genre_tag) }
  let(:headers) { auth_headers(user) }

  describe 'POST /api/restaurants/:restaurant_id/favorite' do
    it 'creates a favorite successfully' do
      expect {
        post "/api/restaurants/#{restaurant.id}/favorite", headers: headers
      }.to change(Favorite, :count).by(1)
      
      expect(response).to have_http_status(:created)
      data = JSON.parse(response.body)
      expect(data['success']).to be true
      expect(data['favorite_id']).to be_present
      
      favorite = Favorite.find(data['favorite_id'])
      expect(favorite.user).to eq(user)
      expect(favorite.restaurant).to eq(restaurant)
    end

    it 'returns existing favorite if already exists' do
      existing_favorite = Favorite.create!(user: user, restaurant: restaurant)
      
      expect {
        post "/api/restaurants/#{restaurant.id}/favorite", headers: headers
      }.not_to change(Favorite, :count)
      
      expect(response).to have_http_status(:created)
      data = JSON.parse(response.body)
      expect(data['success']).to be true
      expect(data['favorite_id']).to eq(existing_favorite.id)
    end

    it 'returns 404 if restaurant not found' do
      expect {
        post "/api/restaurants/99999/favorite", headers: headers
      }.not_to change(Favorite, :count)
      
      expect(response).to have_http_status(:not_found)
      data = JSON.parse(response.body)
      expect(data['error']).to eq('Restaurant not found')
    end

    it 'returns 401 without authentication' do
      expect {
        post "/api/restaurants/#{restaurant.id}/favorite"
      }.not_to change(Favorite, :count)
      
      expect(response).to have_http_status(:unauthorized)
    end

    it 'returns 401 with invalid token' do
      invalid_headers = { 'Authorization' => 'Bearer invalid_token' }
      
      expect {
        post "/api/restaurants/#{restaurant.id}/favorite", headers: invalid_headers
      }.not_to change(Favorite, :count)
      
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'DELETE /api/restaurants/:restaurant_id/favorite' do
    let!(:favorite) { Favorite.create!(user: user, restaurant: restaurant) }

    it 'destroys favorite successfully' do
      expect {
        delete "/api/restaurants/#{restaurant.id}/favorite", headers: headers
      }.to change(Favorite, :count).by(-1)
      
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)
      expect(data['success']).to be true
    end

    it 'returns 404 if favorite not found' do
      expect {
        delete "/api/restaurants/#{another_restaurant.id}/favorite", headers: headers
      }.not_to change(Favorite, :count)
      
      expect(response).to have_http_status(:not_found)
      data = JSON.parse(response.body)
      expect(data['error']).to eq('Favorite not found')
    end

    it 'returns 401 without authentication' do
      expect {
        delete "/api/restaurants/#{restaurant.id}/favorite"
      }.not_to change(Favorite, :count)
      
      expect(response).to have_http_status(:unauthorized)
    end

    it 'returns 401 with invalid token' do
      invalid_headers = { 'Authorization' => 'Bearer invalid_token' }
      
      expect {
        delete "/api/restaurants/#{restaurant.id}/favorite", headers: invalid_headers
      }.not_to change(Favorite, :count)
      
      expect(response).to have_http_status(:unauthorized)
    end

    it 'does not delete other users favorites' do
      other_favorite = Favorite.create!(user: another_user, restaurant: restaurant)
      
      expect {
        delete "/api/restaurants/#{restaurant.id}/favorite", headers: headers
      }.to change(Favorite, :count).by(-1)
      
      expect(Favorite.exists?(other_favorite.id)).to be true
    end
  end

  describe 'GET /api/favorites' do
    let!(:favorite1) { Favorite.create!(user: user, restaurant: restaurant) }
    let!(:favorite2) { Favorite.create!(user: user, restaurant: another_restaurant) }
    let!(:other_user_favorite) { Favorite.create!(user: another_user, restaurant: restaurant) }

    it 'returns user favorites' do
      get '/api/favorites', headers: headers
      
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)
      
      expect(data.length).to eq(2)
      restaurant_names = data.map { |r| r['name'] }
      expect(restaurant_names).to contain_exactly('テストレストラン', '別のレストラン')
      
      # Check that area_tag and genre_tag are included
      first_restaurant = data.first
      expect(first_restaurant['area_tag']).to be_present
      expect(first_restaurant['area_tag']['name']).to eq('東京')
      expect(first_restaurant['area_tag']['category']).to eq('area')
      expect(first_restaurant['genre_tag']).to be_present
      expect(first_restaurant['genre_tag']['name']).to eq('イタリアン')
      expect(first_restaurant['genre_tag']['category']).to eq('genre')
    end

    it 'returns empty array if no favorites' do
      user_without_favorites = User.create!(google_id: 'google789', email: 'nofavorites@example.com', name: 'No Favorites User')
      headers_without_favorites = auth_headers(user_without_favorites)
      
      get '/api/favorites', headers: headers_without_favorites
      
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)
      expect(data).to eq([])
    end

    it 'returns 401 without authentication' do
      get '/api/favorites'
      expect(response).to have_http_status(:unauthorized)
    end

    it 'returns 401 with invalid token' do
      invalid_headers = { 'Authorization' => 'Bearer invalid_token' }
      get '/api/favorites', headers: invalid_headers
      expect(response).to have_http_status(:unauthorized)
    end

    it 'does not return other users favorites' do
      get '/api/favorites', headers: headers
      
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)
      
      # Should only return 2 favorites for the current user, not the other user's favorite
      expect(data.length).to eq(2)
    end
  end
end