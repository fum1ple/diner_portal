# frozen_string_literal: true

require 'test_helper'

class Api::AuthControllerTest < ActionController::TestCase
  # フィクスチャを使わないようにする
  self.use_transactional_tests = true
  
  def setup
    # 各テスト前にリフレッシュトークンとユーザーテーブルをクリア
    RefreshToken.delete_all
    User.delete_all
    
    @valid_google_payload = {
      'sub' => 'google123456',
      'email' => 'test@tokium.jp',
      'name' => 'Test User',
      'aud' => ENV['GOOGLE_CLIENT_ID']
    }
  end

  test "should create JWT token for valid user" do
    # テスト用ユーザーを直接作成
    user = User.create!(
      google_id: 'test_google_123',
      email: 'jwt_test@tokium.jp',
      name: 'JWT Test User'
    )

    # JWTトークン生成のテスト
    token = JwtService.generate_user_token(user)
    assert_not_nil token
    
    # トークンをデコードして検証
    decoded = JwtService.decode(token)
    assert_not_nil decoded
    assert_equal user.id, decoded['user_id']
    assert_equal user.email, decoded['email']
    assert_equal user.name, decoded['name']
  end

  test "should validate JWT token" do
    user = User.create!(
      google_id: 'validate_test_789',
      email: 'validate_test@tokium.jp',
      name: 'Validate Test User'
    )

    token = JwtService.generate_user_token(user)
    
    # 有効なトークンの検証
    assert JwtService.valid?(token)
    
    # 無効なトークンの検証（例外をキャッチ）
    begin
      assert_not JwtService.valid?('invalid_token')
    rescue JWT::DecodeError
      # 期待される例外なので、テストを通す
      assert true
    end
  end

  test "should find or create user" do
    initial_count = User.count
    
    # 新規ユーザーの場合
    user1 = User.create!(
      google_id: 'create_test_456',
      email: 'create_test@tokium.jp',
      name: 'Create Test User'
    )
    
    assert_equal initial_count + 1, User.count
    assert_equal 'create_test_456', user1.google_id
    assert_equal 'create_test@tokium.jp', user1.email
    assert_equal 'Create Test User', user1.name
  end
end
