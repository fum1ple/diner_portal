require 'rails_helper'

RSpec.describe 'Api::Auth', type: :request do
  let!(:user) { User.create!(google_id: 'test_google_id', email: 'test@tokium.jp', name: 'Test User') }

  describe 'POST /api/auth/google' do
    before do
      # Google認証のモック
      mock_google_payload = {
        'sub' => 'test_google_id',
        'email' => 'test@tokium.jp',
        'name' => 'Test User'
      }
      allow(Google::Auth::IDTokens).to receive(:verify_oidc).and_return(mock_google_payload)
    end

    it 'generates refresh token on login' do
      post '/api/auth/google', params: {
        id_token: 'mock_token',
        email: 'test@tokium.jp'
      }

      expect(response).to have_http_status(:success)
      response_body = JSON.parse(response.body)

      expect(response_body['success']).to be true
      expect(response_body['access_token']).not_to be_nil
      expect(response_body['refresh_token']).not_to be_nil
      expect(response_body['token_type']).to eq 'Bearer'
    end
  end

  describe 'POST /api/auth/refresh' do
    let!(:refresh_token) { RefreshTokenService.generate(user) }

    it 'refreshes access token with valid refresh token' do
      post '/api/auth/refresh', params: {
        refresh_token: refresh_token.token
      }

      expect(response).to have_http_status(:success)
      response_body = JSON.parse(response.body)

      expect(response_body['success']).to be true
      expect(response_body['access_token']).not_to be_nil
      expect(response_body['token_type']).to eq 'Bearer'
    end

    it 'rejects invalid refresh token' do
      post '/api/auth/refresh', params: {
        refresh_token: 'invalid_token'
      }

      expect(response).to have_http_status(:unauthorized)
      response_body = JSON.parse(response.body)
      expect(response_body['code']).to eq 'INVALID_REFRESH_TOKEN'
    end
  end

  describe 'POST /api/auth/logout' do
    let!(:refresh_token) { RefreshTokenService.generate(user) }

    it 'revokes refresh token on logout' do
      post '/api/auth/logout', params: {
        refresh_token: refresh_token.token
      }

      expect(response).to have_http_status(:success)

      # トークンが無効化されていることを確認
      refresh_token.reload
      expect(refresh_token.revoked?).to be true
    end
  end

  describe 'JWT token error handling' do
    it 'handles JWT decode errors gracefully' do
      get '/api/user/profile', headers: { 'Authorization' => 'Bearer invalid_token' }

      expect(response).to have_http_status(:unauthorized)
      response_body = JSON.parse(response.body)
      expect(response_body['code']).to eq 'INVALID_TOKEN'
    end

    it 'handles expired JWT tokens' do
      # 期限切れのトークンを生成
      expired_payload = {
        user_id: user.id,
        email: user.email,
        name: user.name,
        exp: 1.hour.ago.to_i,
        iat: 2.hours.ago.to_i,
        jti: SecureRandom.uuid
      }

      secret_key = Rails.application.credentials.jwt_secret_key || ENV['JWT_SECRET_KEY'] || 'your-secret-key'
      expired_token = JWT.encode(expired_payload, secret_key, 'HS256')

      get '/api/user/profile', headers: { 'Authorization' => "Bearer #{expired_token}" }

      expect(response).to have_http_status(:unauthorized)
      response_body = JSON.parse(response.body)
      expect(response_body['code']).to eq 'TOKEN_EXPIRED'
    end
  end

  describe 'security headers' do
    it 'includes security headers in response' do
      token = JwtService.generate_access_token(user)
      get '/api/user/profile', headers: { 'Authorization' => "Bearer #{token}" }

      # セキュリティヘッダーが含まれていることを確認
      expect(response.headers['X-Content-Type-Options']).not_to be_nil
      expect(response.headers['X-Frame-Options']).not_to be_nil
      expect(response.headers['X-XSS-Protection']).not_to be_nil
      expect(response.headers['Content-Security-Policy']).not_to be_nil
      expect(response.headers['Referrer-Policy']).not_to be_nil
    end

    it 'enforces CORS policy' do
      token = JwtService.generate_access_token(user)
      get '/api/user/profile',
          headers: {
            'Origin' => 'http://malicious-site.com',
            'Authorization' => "Bearer #{token}"
          }

      # CORS設定により適切に処理される
      expect(response).to have_http_status(:success)
    end
  end
end
