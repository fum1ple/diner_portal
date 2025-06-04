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
end
