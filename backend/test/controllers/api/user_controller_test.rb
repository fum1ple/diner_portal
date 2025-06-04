# frozen_string_literal: true

require 'test_helper'

class Api::UserControllerTest < ActionController::TestCase
  self.use_transactional_tests = true

  def setup
    # 各テスト前にリフレッシュトークンとユーザーテーブルをクリア
    RefreshToken.delete_all
    User.delete_all

    @test_user = User.create!(
      google_id: 'test_user_google_id',
      email: 'testuser@tokium.jp',
      name: 'Test User'
    )

    @valid_token = JwtService.generate_access_token(@test_user)
  end

  test "should get user profile with valid token" do
    request.headers['Authorization'] = "Bearer #{@valid_token}"

    get :profile

    assert_response :success

    response_data = JSON.parse(response.body)
    assert response_data['success']
    assert_equal @test_user.id, response_data['user']['id']
    assert_equal @test_user.email, response_data['user']['email']
    assert_equal @test_user.name, response_data['user']['name']
  end

  test "should reject request without token" do
    get :profile

    assert_response :unauthorized

    response_data = JSON.parse(response.body)
    assert_equal 'Missing authorization token', response_data['error']
  end

  test "should reject request with invalid token" do
    request.headers['Authorization'] = "Bearer invalid_token"

    get :profile

    assert_response :unauthorized

    response_data = JSON.parse(response.body)
    assert_equal 'Invalid token format', response_data['error']
  end

  test "should update user with valid token" do
    request.headers['Authorization'] = "Bearer #{@valid_token}"

    put :update, params: { user: { name: 'Updated Name' } }

    assert_response :success

    response_data = JSON.parse(response.body)
    assert response_data['success']
    assert_equal 'Updated Name', response_data['user']['name']

    # DBも更新されているか確認
    @test_user.reload
    assert_equal 'Updated Name', @test_user.name
  end

  test "should reject update without token" do
    put :update, params: { user: { name: 'Updated Name' } }

    assert_response :unauthorized
  end

  test "should handle malformed authorization header" do
    request.headers['Authorization'] = "InvalidFormat"

    get :profile

    assert_response :unauthorized
  end

  test "should handle expired token" do
    # 過去の時刻でトークンを生成
    expired_payload = {
      user_id: @test_user.id,
      email: @test_user.email,
      name: @test_user.name,
      exp: 1.hour.ago.to_i
    }

    expired_token = JWT.encode(expired_payload, Rails.application.secret_key_base, 'HS256')
    request.headers['Authorization'] = "Bearer #{expired_token}"

    get :profile

    assert_response :unauthorized
  end
end
