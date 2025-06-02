# frozen_string_literal: true

require 'test_helper'

class RefreshTokenTest < ActiveSupport::TestCase
  def setup
    @user = users(:one)
    @refresh_token = refresh_tokens(:one)
  end

  test "should be valid with valid attributes" do
    token = RefreshToken.new(
      user: @user,
      expires_at: 7.days.from_now
    )
    unless token.valid?
      puts "Validation errors: #{token.errors.full_messages}"
    end
    assert token.valid?
  end

  test "should require user" do
    token = RefreshToken.new(expires_at: 7.days.from_now)
    assert_not token.valid?
    assert token.errors[:user].present?
  end

  test "should require expires_at" do
    token = RefreshToken.new(user: @user)
    assert_not token.valid?
    assert token.errors[:expires_at].present?
  end

  test "should generate token and jti on creation" do
    begin
      token = RefreshToken.create!(
        user: @user,
        expires_at: 7.days.from_now
      )

      assert_not_nil token.token
      assert_not_nil token.jti
      assert token.token.length > 0
      assert token.jti.length > 0
    rescue ActiveRecord::RecordInvalid => e
      puts "Validation failed: #{e.message}"
      puts "Record errors: #{e.record.errors.full_messages}"
      raise
    end
  end

  test "should have unique token" do
    token1 = RefreshToken.create!(
      user: @user,
      expires_at: 7.days.from_now
    )

    token2 = RefreshToken.new(
      user: @user,
      token: token1.token,
      jti: SecureRandom.uuid,
      expires_at: 7.days.from_now
    )

    assert_not token2.valid?
    assert token2.errors[:token].present?
  end

  test "should have unique jti" do
    token1 = RefreshToken.create!(
      user: @user,
      expires_at: 7.days.from_now
    )

    token2 = RefreshToken.new(
      user: @user,
      token: SecureRandom.hex(32),
      jti: token1.jti,
      expires_at: 7.days.from_now
    )

    assert_not token2.valid?
    assert token2.errors[:jti].present?
  end

  test "should detect expired tokens" do
    expired_token = refresh_tokens(:expired)
    assert expired_token.expired?

    valid_token = refresh_tokens(:one)
    assert_not valid_token.expired?
  end

  test "should detect revoked tokens" do
    revoked_token = refresh_tokens(:revoked)
    assert revoked_token.revoked?

    valid_token = refresh_tokens(:one)
    assert_not valid_token.revoked?
  end

  test "should validate token validity" do
    valid_token = refresh_tokens(:one)
    assert valid_token.token_valid?

    expired_token = refresh_tokens(:expired)
    assert_not expired_token.token_valid?

    revoked_token = refresh_tokens(:revoked)
    assert_not revoked_token.token_valid?
  end

  test "should revoke token" do
    token = refresh_tokens(:one)
    assert_not token.revoked?

    token.revoke!
    assert token.revoked?
  end

  test "should scope valid tokens correctly" do
    valid_tokens = RefreshToken.token_valid

    # validなトークンのみが含まれている
    valid_tokens.each do |token|
      assert token.token_valid?
    end

    # expiredやrevokedなトークンは含まれていない
    assert_not_includes valid_tokens, refresh_tokens(:expired)
    assert_not_includes valid_tokens, refresh_tokens(:revoked)
  end

  test "should scope expired tokens correctly" do
    expired_tokens = RefreshToken.expired

    expired_tokens.each do |token|
      assert token.expired?
    end
  end

  test "should scope revoked tokens correctly" do
    revoked_tokens = RefreshToken.revoked

    revoked_tokens.each do |token|
      assert token.revoked?
    end
  end

  test "should cleanup expired tokens" do
    # 既存の期限切れトークンの数を確認
    initial_expired_count = RefreshToken.expired.count

    # 新しい期限切れのトークンを作成
    expired_token = RefreshToken.create!(
      user: @user,
      expires_at: 1.day.ago
    )

    # cleanup前の総数を確認
    initial_count = RefreshToken.count

    # cleanupを実行
    RefreshToken.cleanup_expired

    # 期限切れトークンが全て削除されていることを確認
    assert_equal 0, RefreshToken.expired.count
    assert_equal initial_count - (initial_expired_count + 1), RefreshToken.count
    assert_not RefreshToken.exists?(expired_token.id)
  end

  test "should belong to user" do
    assert_equal @user, @refresh_token.user
  end

  test "user should have many refresh tokens" do
    assert_includes @user.refresh_tokens, @refresh_token
  end

  test "should destroy refresh tokens when user is destroyed" do
    user = User.create!(
      email: 'test@tokium.jp',
      name: 'Test User',
      google_id: 'test_google_id'
    )

    token = RefreshToken.create!(
      user: user,
      expires_at: 7.days.from_now
    )

    token_id = token.id
    user.destroy!

    assert_not RefreshToken.exists?(token_id)
  end
end
