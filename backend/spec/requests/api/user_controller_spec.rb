require 'rails_helper'

def auth_headers(user)
  token = JwtService.generate_access_token(user)
  { 'Authorization' => "Bearer #{token}" }
end

RSpec.describe 'Api::User', type: :request do
  let!(:user) { User.create!(google_id: 'test_user_google_id', email: 'testuser@tokium.jp', name: 'Test User') }
  let(:headers) { auth_headers(user) }

  describe 'GET /api/user/profile' do
    it '有効なトークンでユーザープロフィール取得' do
      get '/api/user/profile', headers: headers
      expect(response).to have_http_status(:success)
      data = JSON.parse(response.body)
      expect(data['success']).to be true
      expect(data['user']['id']).to eq user.id
      expect(data['user']['email']).to eq user.email
      expect(data['user']['name']).to eq user.name
    end

    it 'トークンなしは401' do
      get '/api/user/profile'
      expect(response).to have_http_status(:unauthorized)
      data = JSON.parse(response.body)
      expect(data['error']).to eq 'Missing authorization token'
    end

    it '不正なトークンは401' do
      get '/api/user/profile', headers: { 'Authorization' => 'Bearer invalid_token' }
      expect(response).to have_http_status(:unauthorized)
      data = JSON.parse(response.body)
      expect(data['error']).to eq 'Invalid token format'
    end

    it 'Authorizationヘッダー不正は401' do
      get '/api/user/profile', headers: { 'Authorization' => 'InvalidFormat' }
      expect(response).to have_http_status(:unauthorized)
    end

    it '期限切れトークンは401' do
      expired_payload = {
        user_id: user.id,
        email: user.email,
        name: user.name,
        exp: 1.hour.ago.to_i
      }
      expired_token = JWT.encode(expired_payload, Rails.application.secret_key_base, 'HS256')
      get '/api/user/profile', headers: { 'Authorization' => "Bearer #{expired_token}" }
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'PUT /api/user/update' do
    it '有効なトークンでユーザー更新' do
      put '/api/user/update', params: { user: { name: 'Updated Name' } }, headers: headers
      expect(response).to have_http_status(:success)
      data = JSON.parse(response.body)
      expect(data['success']).to be true
      expect(data['user']['name']).to eq 'Updated Name'
      user.reload
      expect(user.name).to eq 'Updated Name'
    end

    it 'トークンなしは401' do
      put '/api/user/update', params: { user: { name: 'Updated Name' } }
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
