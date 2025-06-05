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

  describe 'JWT authentication workflow integration' do
    it 'handles complete authentication workflow' do
      # Step 1: JWTトークンを生成
      token = JwtService.generate_access_token(user)
      expect(token).not_to be_nil

      # Step 2: トークンを使って保護されたエンドポイントにアクセス
      get '/api/user/profile', headers: { 'Authorization' => "Bearer #{token}" }

      expect(response).to have_http_status(:success)
      response_data = JSON.parse(response.body)

      expect(response_data['success']).to be true
      expect(response_data['user']['id']).to eq user.id
      expect(response_data['user']['email']).to eq user.email
      expect(response_data['user']['name']).to eq user.name

      # Step 3: ユーザー情報更新
      put '/api/user/update',
          params: { user: { name: 'Updated Integration User' } },
          headers: { 'Authorization' => "Bearer #{token}" }

      expect(response).to have_http_status(:success)
      update_response = JSON.parse(response.body)

      expect(update_response['success']).to be true
      expect(update_response['user']['name']).to eq 'Updated Integration User'

      # Step 4: 認証なしでのアクセス拒否
      get '/api/user/profile'
      expect(response).to have_http_status(:unauthorized)
      error_response = JSON.parse(response.body)
      expect(error_response['error']).to eq 'Missing authorization token'

      # Step 5: 無効なトークンでのアクセス拒否
      get '/api/user/profile', headers: { 'Authorization' => "Bearer invalid_token" }
      expect(response).to have_http_status(:unauthorized)
      invalid_token_response = JSON.parse(response.body)
      expect(invalid_token_response['error']).to eq 'Invalid token format'
    end

    it 'handles missing user for valid token format' do
      # 存在しないユーザーIDでトークンを生成
      fake_payload = {
        user_id: 999999,
        email: 'nonexistent@tokium.jp',
        name: 'Non Existent User'
      }

      fake_token = JwtService.encode(fake_payload)

      get '/api/user/profile', headers: { 'Authorization' => "Bearer #{fake_token}" }

      expect(response).to have_http_status(:unauthorized)
      response_data = JSON.parse(response.body)
      expect(response_data['error']).to eq 'User not found'
    end
  end
end
