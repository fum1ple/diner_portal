# frozen_string_literal: true

require 'test_helper'

class RefreshTokenServiceTest < ActiveSupport::TestCase
  def setup
    @user = users(:one)
  end

  test "should generate refresh token" do
    assert_difference("RefreshToken.count", 1) do
      token = RefreshTokenService.generate(@user)
      
      assert_not_nil token
      assert_not_nil token.token
      assert_not_nil token.jti
      assert_equal @user, token.user
      assert_not token.revoked?
      assert_not token.expired?
    end
  end

  test "should find valid refresh token" do
    token = RefreshTokenService.generate(@user)
    
    found_token = RefreshTokenService.find_valid(token.token)
    assert_equal token, found_token
  end

  test "should not find invalid refresh token" do
    invalid_token = RefreshTokenService.find_valid("invalid_token")
    assert_nil invalid_token
  end

  test "should not find expired refresh token" do
    token = RefreshToken.create!(
      user: @user,
      expires_at: 1.day.ago,
      revoked: false
    )
    
    found_token = RefreshTokenService.find_valid(token.token)
    assert_nil found_token
  end

  test "should not find revoked refresh token" do
    token = RefreshTokenService.generate(@user)
    token.revoke!
    
    found_token = RefreshTokenService.find_valid(token.token)
    assert_nil found_token
  end

  test "should revoke refresh token" do
    token = RefreshTokenService.generate(@user)
    assert_not token.revoked?
    
    RefreshTokenService.revoke(token.token)
    token.reload
    
    assert token.revoked?
  end

  test "should revoke all user refresh tokens" do
    # 複数のリフレッシュトークンを作成
    token1 = RefreshTokenService.generate(@user)
    token2 = RefreshTokenService.generate(@user)
    
    assert_not token1.revoked?
    assert_not token2.revoked?
    
    RefreshTokenService.revoke_all(@user)
    
    token1.reload
    token2.reload
    
    assert token1.revoked?
    assert token2.revoked?
  end

  test "should cleanup expired tokens" do
    # 有効なトークンを作成
    valid_token = RefreshTokenService.generate(@user)
    
    # 期限切れのトークンを作成
    expired_token = RefreshToken.create!(
      user: @user,
      expires_at: 1.day.ago,
      revoked: false
    )
    
    initial_count = RefreshToken.count
    expired_count = RefreshToken.expired.count
    
    RefreshTokenService.cleanup_expired
    
    # 期限切れトークンが削除され、有効なトークンは残っていることを確認
    assert_equal initial_count - expired_count, RefreshToken.count
    assert RefreshToken.exists?(valid_token.id)
    assert_not RefreshToken.exists?(expired_token.id)
  end

  test "should return correct statistics" do
    # 初期状態をクリア
    RefreshToken.delete_all
    
    # 有効なトークンを作成
    valid_token = RefreshTokenService.generate(@user)
    
    # 期限切れのトークンを作成
    expired_token = RefreshToken.create!(
      user: @user,
      expires_at: 1.day.ago,
      revoked: false
    )
    
    # 無効化されたトークンを作成
    revoked_token = RefreshTokenService.generate(@user)
    revoked_token.revoke!
    
    stats = RefreshTokenService.statistics
    
    assert_equal 3, stats[:total]
    assert_equal 1, stats[:valid]
    assert_equal 1, stats[:expired]
    assert_equal 1, stats[:revoked]
  end

  test "should handle nil token gracefully" do
    found_token = RefreshTokenService.find_valid(nil)
    assert_nil found_token
  end

  test "should handle empty token gracefully" do
    found_token = RefreshTokenService.find_valid("")
    assert_nil found_token
  end
end
