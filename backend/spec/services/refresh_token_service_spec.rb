require 'rails_helper'

RSpec.describe RefreshTokenService do
  let!(:user) { User.create!(google_id: 'user123', email: 'user@example.com', name: 'Test User') }

  describe '.generate' do
    it 'リフレッシュトークンを生成' do
      expect {
        token = described_class.generate(user)
        expect(token).not_to be_nil
        expect(token.token).not_to be_nil
        expect(token.jti).not_to be_nil
        expect(token.user).to eq user
        expect(token.revoked?).to be false
        expect(token.expired?).to be false
      }.to change(RefreshToken, :count).by(1)
    end
  end

  describe '.find_valid' do
    it '有効なリフレッシュトークンを見つける' do
      token = described_class.generate(user)
      found_token = described_class.find_valid(token.token)
      expect(found_token).to eq token
    end

    it '無効なリフレッシュトークンはnilを返す' do
      invalid_token = described_class.find_valid('invalid_token')
      expect(invalid_token).to be_nil
    end

    it '期限切れリフレッシュトークンはnilを返す' do
      token = RefreshToken.create!(
        user: user,
        expires_at: 1.day.ago,
        revoked: false
      )
      found_token = described_class.find_valid(token.token)
      expect(found_token).to be_nil
    end

    it '無効化されたリフレッシュトークンはnilを返す' do
      token = described_class.generate(user)
      token.revoke!
      found_token = described_class.find_valid(token.token)
      expect(found_token).to be_nil
    end

    it 'nilトークンを適切に処理' do
      found_token = described_class.find_valid(nil)
      expect(found_token).to be_nil
    end

    it '空文字トークンを適切に処理' do
      found_token = described_class.find_valid('')
      expect(found_token).to be_nil
    end
  end

  describe '.revoke' do
    it 'リフレッシュトークンを無効化' do
      token = described_class.generate(user)
      expect(token.revoked?).to be false

      described_class.revoke(token.token)
      token.reload

      expect(token.revoked?).to be true
    end
  end

  describe '.revoke_all' do
    it 'ユーザーの全リフレッシュトークンを無効化' do
      token1 = described_class.generate(user)
      token2 = described_class.generate(user)

      expect(token1.revoked?).to be false
      expect(token2.revoked?).to be false

      described_class.revoke_all(user)

      token1.reload
      token2.reload

      expect(token1.revoked?).to be true
      expect(token2.revoked?).to be true
    end
  end

  describe '.cleanup_expired' do
    it '期限切れトークンをクリーンアップ' do
      valid_token = described_class.generate(user)
      expired_token = RefreshToken.create!(
        user: user,
        expires_at: 1.day.ago,
        revoked: false
      )

      initial_count = RefreshToken.count
      expired_count = RefreshToken.expired.count

      described_class.cleanup_expired

      expect(RefreshToken.count).to eq(initial_count - expired_count)
      expect(RefreshToken.exists?(valid_token.id)).to be true
      expect(RefreshToken.exists?(expired_token.id)).to be false
    end
  end

  describe '.statistics' do
    before do
      RefreshToken.delete_all
    end

    it '正確な統計を返す' do
      valid_token = described_class.generate(user)
      expired_token = RefreshToken.create!(
        user: user,
        expires_at: 1.day.ago,
        revoked: false
      )
      revoked_token = described_class.generate(user)
      revoked_token.revoke!

      stats = described_class.statistics

      expect(stats[:total]).to eq 3
      expect(stats[:valid]).to eq 1
      expect(stats[:expired]).to eq 1
      expect(stats[:revoked]).to eq 1
    end
  end
end
