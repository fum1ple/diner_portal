require 'rails_helper'

RSpec.describe RefreshToken, type: :model do
  let!(:user) { User.create!(google_id: 'user123', email: 'user@example.com', name: 'Test User') }

  describe 'validations' do
    it '有効な属性で作成できる' do
      token = RefreshToken.new(user: user, expires_at: 7.days.from_now)
      expect(token).to be_valid
    end

    it 'userが必須' do
      token = RefreshToken.new(expires_at: 7.days.from_now)
      expect(token).not_to be_valid
      expect(token.errors[:user]).to be_present
    end

    it 'expires_atが必須' do
      token = RefreshToken.new(user: user)
      expect(token).not_to be_valid
      expect(token.errors[:expires_at]).to be_present
    end

    it '作成時にtokenとjtiが生成される' do
      token = RefreshToken.create!(user: user, expires_at: 7.days.from_now)
      expect(token.token).not_to be_nil
      expect(token.jti).not_to be_nil
      expect(token.token.length).to be > 0
      expect(token.jti.length).to be > 0
    end

    it 'tokenの一意性を検証' do
      token1 = RefreshToken.create!(user: user, expires_at: 7.days.from_now)
      token2 = RefreshToken.new(
        user: user,
        token: token1.token,
        jti: SecureRandom.uuid,
        expires_at: 7.days.from_now
      )
      expect(token2).not_to be_valid
      expect(token2.errors[:token]).to be_present
    end

    it 'jtiの一意性を検証' do
      token1 = RefreshToken.create!(user: user, expires_at: 7.days.from_now)
      token2 = RefreshToken.new(
        user: user,
        token: SecureRandom.hex(32),
        jti: token1.jti,
        expires_at: 7.days.from_now
      )
      expect(token2).not_to be_valid
      expect(token2.errors[:jti]).to be_present
    end
  end

  describe 'instance methods' do
    let(:valid_token) { RefreshToken.create!(user: user, expires_at: 7.days.from_now) }
    let(:expired_token) { RefreshToken.create!(user: user, expires_at: 1.day.ago) }
    let(:revoked_token) { RefreshToken.create!(user: user, expires_at: 7.days.from_now, revoked: true) }

    it '期限切れトークンを検出' do
      expect(expired_token.expired?).to be true
      expect(valid_token.expired?).to be false
    end

    it '無効化されたトークンを検出' do
      expect(revoked_token.revoked?).to be true
      expect(valid_token.revoked?).to be false
    end

    it 'トークンの有効性を検証' do
      expect(valid_token.token_valid?).to be true
      expect(expired_token.token_valid?).to be false
      expect(revoked_token.token_valid?).to be false
    end

    it 'トークンを無効化' do
      expect(valid_token.revoked?).to be false
      valid_token.revoke!
      expect(valid_token.revoked?).to be true
    end
  end

  describe 'scopes' do
    let!(:valid_token) { RefreshToken.create!(user: user, expires_at: 7.days.from_now) }
    let!(:expired_token) { RefreshToken.create!(user: user, expires_at: 1.day.ago) }
    let!(:revoked_token) { RefreshToken.create!(user: user, expires_at: 7.days.from_now, revoked: true) }

    it 'token_validスコープが有効なトークンのみ返す' do
      valid_tokens = RefreshToken.token_valid
      valid_tokens.each do |token|
        expect(token.token_valid?).to be true
      end
      expect(valid_tokens).not_to include(expired_token, revoked_token)
    end

    it 'expiredスコープが期限切れトークンのみ返す' do
      expired_tokens = RefreshToken.expired
      expired_tokens.each do |token|
        expect(token.expired?).to be true
      end
    end

    it 'revokedスコープが無効化されたトークンのみ返す' do
      revoked_tokens = RefreshToken.revoked
      revoked_tokens.each do |token|
        expect(token.revoked?).to be true
      end
    end
  end

  describe '.cleanup_expired' do
    it '期限切れトークンをクリーンアップ' do
      # テスト前にクリーンアップして既存データを削除
      RefreshToken.delete_all

      valid_token = RefreshToken.create!(user: user, expires_at: 7.days.from_now)
      expired_token = RefreshToken.create!(user: user, expires_at: 1.day.ago)

      expect { RefreshToken.cleanup_expired }.to change(RefreshToken, :count).by(-1)
      expect(RefreshToken.exists?(expired_token.id)).to be false
      expect(RefreshToken.exists?(valid_token.id)).to be true
    end
  end

  describe 'associations' do
    let(:token) { RefreshToken.create!(user: user, expires_at: 7.days.from_now) }

    it 'userに属する' do
      expect(token.user).to eq user
    end

    it 'userは複数のrefresh_tokensを持つ' do
      expect(user.refresh_tokens).to include(token)
    end

    it 'ユーザー削除時にrefresh_tokensも削除' do
      test_user = User.create!(email: 'test@tokium.jp', name: 'Test User', google_id: 'test_google_id')
      token = RefreshToken.create!(user: test_user, expires_at: 7.days.from_now)
      token_id = token.id

      test_user.destroy!
      expect(RefreshToken.exists?(token_id)).to be false
    end
  end
end
