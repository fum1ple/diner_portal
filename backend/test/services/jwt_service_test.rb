# frozen_string_literal: true

require 'test_helper'

class JwtServiceTest < ActiveSupport::TestCase
  def setup
    @user = users(:one)
  end

  test "should encode and decode JWT token" do
    payload = { user_id: @user.id, email: @user.email }
    token = JwtService.encode(payload)
    
    assert_not_nil token
    
    decoded = JwtService.decode(token)
    assert_equal @user.id, decoded['user_id']
    assert_equal @user.email, decoded['email']
    assert_not_nil decoded['exp']
    assert_not_nil decoded['iat']
    assert_not_nil decoded['jti']
  end

  test "should validate token" do
    payload = { user_id: @user.id }
    token = JwtService.encode(payload)
    
    assert JwtService.valid?(token)
    assert_not JwtService.valid?('invalid_token')
  end

  test "should generate access token" do
    token = JwtService.generate_access_token(@user)
    
    assert_not_nil token
    
    decoded = JwtService.decode(token)
    assert_equal @user.id, decoded['user_id']
    assert_equal @user.id, decoded['sub']
    assert_equal @user.email, decoded['email']
    assert_equal @user.name, decoded['name']
    assert_equal @user.google_id, decoded['google_id']
  end

  test "should generate token pair" do
    token_pair = JwtService.generate_token_pair(@user)
    
    assert_not_nil token_pair[:access_token]
    assert_not_nil token_pair[:refresh_token]
    assert_equal JWT_EXPIRATION.to_i, token_pair[:expires_in]
    assert_equal JWT_REFRESH_EXPIRATION.to_i, token_pair[:refresh_expires_in]
    assert_equal 'Bearer', token_pair[:token_type]
    
    # アクセストークンが正しく生成されているか確認
    decoded = JwtService.decode(token_pair[:access_token])
    assert_equal @user.id, decoded['user_id']
  end

  test "should refresh access token" do
    # リフレッシュトークンを作成
    refresh_token = RefreshTokenService.generate(@user)
    
    token_pair = JwtService.refresh_access_token(refresh_token.token)
    
    assert_not_nil token_pair
    assert_not_nil token_pair[:access_token]
    assert_equal refresh_token.token, token_pair[:refresh_token]
    assert_equal JWT_EXPIRATION.to_i, token_pair[:expires_in]
    assert_equal 'Bearer', token_pair[:token_type]
  end

  test "should not refresh with invalid token" do
    token_pair = JwtService.refresh_access_token('invalid_token')
    assert_nil token_pair
  end

  test "should not refresh with expired token" do
    # 期限切れのリフレッシュトークンを作成
    expired_token = RefreshToken.create!(
      user: @user,
      expires_at: 1.day.ago,
      revoked: false
    )
    
    token_pair = JwtService.refresh_access_token(expired_token.token)
    assert_nil token_pair
  end

  test "should not refresh with revoked token" do
    refresh_token = RefreshTokenService.generate(@user)
    refresh_token.revoke!
    
    token_pair = JwtService.refresh_access_token(refresh_token.token)
    assert_nil token_pair
  end

  test "should handle expired JWT gracefully" do
    expired_payload = {
      user_id: @user.id,
      exp: 1.hour.ago.to_i,
      iat: 2.hours.ago.to_i,
      jti: SecureRandom.uuid
    }
    
    expired_token = JWT.encode(expired_payload, JWT_SECRET, 'HS256')
    
    assert_raises(JWT::ExpiredSignature) do
      JwtService.decode(expired_token)
    end
    
    assert_not JwtService.valid?(expired_token)
  end

  test "should handle invalid JWT gracefully" do
    assert_nil JwtService.decode('invalid.jwt.token')
    assert_not JwtService.valid?('invalid.jwt.token')
  end

  # === 後方互換性テスト ===

  test "deprecated generate_user_token should still work" do
    # 非推奨警告をキャプチャ
    Rails.logger.expects(:warn).with(includes("DEPRECATED: generate_user_token"))
    
    token = JwtService.generate_user_token(@user)
    
    assert_not_nil token
    decoded = JwtService.decode(token)
    assert_equal @user.id, decoded['user_id']
  end

  test "deprecated encode_token should still work" do
    Rails.logger.expects(:warn).with(includes("DEPRECATED: encode_token"))
    
    payload = { user_id: @user.id }
    token = JwtService.encode_token(payload)
    
    assert_not_nil token
    decoded = JwtService.decode(token)
    assert_equal @user.id, decoded['user_id']
  end

  test "deprecated generate_refresh_token should still work" do
    Rails.logger.expects(:warn).with(includes("DEPRECATED: generate_refresh_token"))
    
    assert_difference("RefreshToken.count", 1) do
      token = JwtService.generate_refresh_token(@user)
      assert_not_nil token
      assert_equal @user, token.user
    end
  end

  test "deprecated revoke_refresh_token should still work" do
    Rails.logger.expects(:warn).with(includes("DEPRECATED: revoke_refresh_token"))
    
    refresh_token = RefreshTokenService.generate(@user)
    assert_not refresh_token.revoked?
    
    JwtService.revoke_refresh_token(refresh_token.token)
    refresh_token.reload
    
    assert refresh_token.revoked?
  end

  test "deprecated revoke_all_refresh_tokens should still work" do
    Rails.logger.expects(:warn).with(includes("DEPRECATED: revoke_all_refresh_tokens"))
    
    token1 = RefreshTokenService.generate(@user)
    token2 = RefreshTokenService.generate(@user)
    
    JwtService.revoke_all_refresh_tokens(@user)
    
    token1.reload
    token2.reload
    
    assert token1.revoked?
    assert token2.revoked?
  end
end
