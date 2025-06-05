require 'rails_helper'

RSpec.describe JwtService do
  let!(:user) { User.create!(google_id: 'test_google_123', email: 'jwt_test@tokium.jp', name: 'JWT Test User') }

  describe '.encode and .decode' do
    it 'JWTトークンをエンコード・デコードできる' do
      payload = { user_id: user.id, email: user.email }
      token = described_class.encode(payload)
      expect(token).not_to be_nil

      decoded = described_class.decode(token)
      expect(decoded['user_id']).to eq user.id
      expect(decoded['email']).to eq user.email
      expect(decoded['exp']).not_to be_nil
      expect(decoded['iat']).not_to be_nil
      expect(decoded['jti']).not_to be_nil
    end
  end

  describe '.valid?' do
    it '有効なトークンはtrueを返す' do
      payload = { user_id: user.id }
      token = described_class.encode(payload)
      expect(described_class.valid?(token)).to be true
      expect(described_class.valid?('invalid_token')).to be false
    end

    it '期限切れトークンはfalseを返す' do
      expired_payload = {
        user_id: user.id,
        exp: 1.hour.ago.to_i,
        iat: 2.hours.ago.to_i,
        jti: SecureRandom.uuid
      }
      expired_token = JWT.encode(expired_payload, JWT_SECRET, 'HS256')
      expect(described_class.valid?(expired_token)).to be false
    end

    it '不正なトークンはfalseを返す' do
      expect(described_class.valid?('invalid.jwt.token')).to be false
    end
  end

  describe '.generate_access_token' do
    it '有効なアクセストークンを生成' do
      token = described_class.generate_access_token(user)
      expect(token).not_to be_nil

      decoded = described_class.decode(token)
      expect(decoded['user_id']).to eq user.id
      expect(decoded['sub']).to eq user.id
      expect(decoded['email']).to eq user.email
      expect(decoded['name']).to eq user.name
      expect(decoded['google_id']).to eq user.google_id
    end
  end

  describe '.generate_token_pair' do
    it 'アクセストークンとリフレッシュトークンのペアを生成' do
      token_pair = described_class.generate_token_pair(user)

      expect(token_pair[:access_token]).not_to be_nil
      expect(token_pair[:refresh_token]).not_to be_nil
      expect(token_pair[:expires_in]).to eq JWT_EXPIRATION.to_i
      expect(token_pair[:refresh_expires_in]).to eq JWT_REFRESH_EXPIRATION.to_i
      expect(token_pair[:token_type]).to eq 'Bearer'

      decoded = described_class.decode(token_pair[:access_token])
      expect(decoded['user_id']).to eq user.id
    end
  end

  describe '.refresh_access_token' do
    it '有効なリフレッシュトークンでアクセストークンを更新' do
      refresh_token = RefreshTokenService.generate(user)
      token_pair = described_class.refresh_access_token(refresh_token.token)

      expect(token_pair).not_to be_nil
      expect(token_pair[:access_token]).not_to be_nil
      expect(token_pair[:refresh_token]).to eq refresh_token.token
      expect(token_pair[:expires_in]).to eq JWT_EXPIRATION.to_i
      expect(token_pair[:token_type]).to eq 'Bearer'
    end

    it '無効なトークンではnilを返す' do
      token_pair = described_class.refresh_access_token('invalid_token')
      expect(token_pair).to be_nil
    end

    it '期限切れトークンではnilを返す' do
      expired_token = RefreshToken.create!(
        user: user,
        expires_at: 1.day.ago,
        revoked: false
      )
      token_pair = described_class.refresh_access_token(expired_token.token)
      expect(token_pair).to be_nil
    end

    it '無効化されたトークンではnilを返す' do
      refresh_token = RefreshTokenService.generate(user)
      refresh_token.revoke!
      token_pair = described_class.refresh_access_token(refresh_token.token)
      expect(token_pair).to be_nil
    end
  end

  describe 'error handling' do
    it '期限切れJWTを適切に処理' do
      expired_payload = {
        user_id: user.id,
        exp: 1.hour.ago.to_i,
        iat: 2.hours.ago.to_i,
        jti: SecureRandom.uuid
      }
      expired_token = JWT.encode(expired_payload, JWT_SECRET, 'HS256')

      expect {
        described_class.decode(expired_token)
      }.to raise_error(JWT::ExpiredSignature)
    end

    it '不正なJWTを適切に処理' do
      expect(described_class.decode('invalid.jwt.token')).to be_nil
    end
  end
end
