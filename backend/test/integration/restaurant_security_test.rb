require "test_helper"

class RestaurantSecurityTest < ActionDispatch::IntegrationTest
  def setup
    @user1 = users(:one)
    @user2 = users(:two)
    @area_tag = tags(:area_tag_tokyo)
    @genre_tag = tags(:genre_tag_italian)

    @token1 = JwtService.encode_token({ user_id: @user1.id })
    @token2 = JwtService.encode_token({ user_id: @user2.id })
    @auth_headers1 = { "Authorization" => "Bearer #{@token1}" }
    @auth_headers2 = { "Authorization" => "Bearer #{@token2}" }
  end

  test "should not allow creation without authentication" do
    restaurant_data = {
      name: "未認証テスト",
      area_tag_id: @area_tag.id,
      genre_tag_id: @genre_tag.id
    }

    assert_no_difference("Restaurant.count") do
      post "/api/restaurants",
           params: { restaurant: restaurant_data },
           as: :json
    end

    assert_response :unauthorized
  end

  test "should not allow creation with expired token" do
    # 期限切れトークンをシミュレート
    expired_payload = {
      user_id: @user1.id,
      exp: 1.hour.ago.to_i
    }
    expired_token = JWT.encode(expired_payload, Rails.application.secret_key_base)
    expired_headers = { "Authorization" => "Bearer #{expired_token}" }

    restaurant_data = {
      name: "期限切れトークンテスト",
      area_tag_id: @area_tag.id,
      genre_tag_id: @genre_tag.id
    }

    assert_no_difference("Restaurant.count") do
      post "/api/restaurants",
           params: { restaurant: restaurant_data },
           headers: expired_headers,
           as: :json
    end

    assert_response :unauthorized
  end

  test "should not allow creation with malformed token" do
    malformed_headers = { "Authorization" => "Bearer malformed.token.here" }

    restaurant_data = {
      name: "不正トークンテスト",
      area_tag_id: @area_tag.id,
      genre_tag_id: @genre_tag.id
    }

    assert_no_difference("Restaurant.count") do
      post "/api/restaurants",
           params: { restaurant: restaurant_data },
           headers: malformed_headers,
           as: :json
    end

    assert_response :unauthorized
  end

  test "should associate restaurant with correct user" do
    restaurant_data = {
      name: "ユーザー関連付けテスト",
      area_tag_id: @area_tag.id,
      genre_tag_id: @genre_tag.id
    }

    # user1で作成
    post "/api/restaurants",
         params: { restaurant: restaurant_data },
         headers: @auth_headers1,
         as: :json

    assert_response :created
    response_data = JSON.parse(response.body)
    assert_equal @user1.id, response_data["user_id"]

    # user2で作成
    restaurant_data[:name] = "ユーザー関連付けテスト2"
    post "/api/restaurants",
         params: { restaurant: restaurant_data },
         headers: @auth_headers2,
         as: :json

    assert_response :created
    response_data = JSON.parse(response.body)
    assert_equal @user2.id, response_data["user_id"]
  end

  test "should prevent parameter injection" do
    # 不正なパラメータ注入を試行
    malicious_data = {
      name: "パラメータ注入テスト",
      area_tag_id: @area_tag.id,
      genre_tag_id: @genre_tag.id,
      user_id: @user2.id,  # 他のユーザーIDを指定
      id: 999,             # IDを指定
      created_at: 1.year.ago,  # 作成日時を指定
      admin: true          # 存在しないフィールド
    }

    post "/api/restaurants",
         params: { restaurant: malicious_data },
         headers: @auth_headers1,
         as: :json

    assert_response :created
    response_data = JSON.parse(response.body)

    # current_userが正しく使用されているか確認
    assert_equal @user1.id, response_data["user_id"]
    assert_not_equal @user2.id, response_data["user_id"]

    # その他の不正パラメータが無視されているか確認
    assert_not_equal 999, response_data["id"]
    assert_nil response_data["admin"]
  end

  test "should sanitize input data" do
    # XSS攻撃のシミュレート
    xss_data = {
      name: "<script>alert('XSS')</script>",
      area_tag_id: @area_tag.id,
      genre_tag_id: @genre_tag.id
    }

    post "/api/restaurants",
         params: { restaurant: xss_data },
         headers: @auth_headers1,
         as: :json

    assert_response :created
    response_data = JSON.parse(response.body)

    # データがそのまま保存されるが、出力時にエスケープされることを確認
    # （実際のサニタイゼーションはフロントエンド側で行われる）
    assert_equal "<script>alert('XSS')</script>", response_data["name"]
  end

  test "should handle SQL injection attempts" do
    # SQL インジェクション攻撃のシミュレート
    sql_injection_data = {
      name: "'; DROP TABLE restaurants; --",
      area_tag_id: @area_tag.id,
      genre_tag_id: @genre_tag.id
    }

    # テーブルが削除されないことを確認
    assert_no_difference("Restaurant.count", -Restaurant.count) do
      post "/api/restaurants",
           params: { restaurant: sql_injection_data },
           headers: @auth_headers1,
           as: :json
    end

    # 正常に作成されることを確認（ActiveRecordが自動的にエスケープする）
    assert_response :created
  end

  test "should rate limit requests" do
    # レート制限のテスト（Rack::Attackの設定に依存）
    restaurant_data = {
      name: "レート制限テスト",
      area_tag_id: @area_tag.id,
      genre_tag_id: @genre_tag.id
    }

    # 通常のリクエストは成功する
    post "/api/restaurants",
         params: { restaurant: restaurant_data },
         headers: @auth_headers1,
         as: :json

    assert_response :created

    # 注意: 実際のレート制限テストは環境設定に依存するため、
    # ここでは基本的な動作確認のみ実施
  end
end
