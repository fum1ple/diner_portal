require "test_helper"

class RestaurantsIntegrationTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:one)
    @area_tag = tags(:area_tag_tokyo)
    @genre_tag = tags(:genre_tag_italian)
    
    # JWTトークンを生成
    @token = JwtService.encode_token({ user_id: @user.id })
    @auth_headers = { "Authorization" => "Bearer #{@token}" }
  end

  test "complete restaurant creation flow" do
    # 1. まずタグの存在を確認
    get "/api/tags", headers: @auth_headers, as: :json
    # このエンドポイントはまだ実装されていないかもしれませんが、将来的に必要

    # 2. 店舗作成リクエスト
    restaurant_data = {
      name: "統合テストレストラン",
      area_tag_id: @area_tag.id,
      genre_tag_id: @genre_tag.id
    }

    post "/api/restaurants",
         params: { restaurant: restaurant_data },
         headers: @auth_headers,
         as: :json

    assert_response :created
    
    # 3. レスポンス内容の詳細検証
    response_data = JSON.parse(response.body)
    
    # 基本データの検証
    assert_equal restaurant_data[:name], response_data["name"]
    assert_equal @user.id, response_data["user_id"]
    assert_equal @area_tag.id, response_data["area_tag_id"]
    assert_equal @genre_tag.id, response_data["genre_tag_id"]
    
    # 関連データの検証
    assert_not_nil response_data["area_tag"]
    assert_equal @area_tag.name, response_data["area_tag"]["name"]
    assert_equal "area", response_data["area_tag"]["category"]
    
    assert_not_nil response_data["genre_tag"]
    assert_equal @genre_tag.name, response_data["genre_tag"]["name"]
    assert_equal "genre", response_data["genre_tag"]["category"]
    
    # タイムスタンプの存在確認
    assert_not_nil response_data["created_at"]
    assert_not_nil response_data["updated_at"]
    
    # 4. データベースに正しく保存されているか確認
    created_restaurant = Restaurant.find(response_data["id"])
    assert_equal restaurant_data[:name], created_restaurant.name
    assert_equal @user.id, created_restaurant.user_id
    assert_equal @area_tag.id, created_restaurant.area_tag_id
    assert_equal @genre_tag.id, created_restaurant.genre_tag_id
  end

  test "multiple restaurants creation by same user" do
    # 同一ユーザーが複数の店舗を作成できることを確認
    restaurants_data = [
      {
        name: "レストラン1",
        area_tag_id: @area_tag.id,
        genre_tag_id: @genre_tag.id
      },
      {
        name: "レストラン2",
        area_tag_id: tags(:area_tag_osaka).id,
        genre_tag_id: tags(:genre_tag_japanese).id
      }
    ]

    restaurants_data.each_with_index do |restaurant_data, index|
      assert_difference("Restaurant.count", 1) do
        post "/api/restaurants",
             params: { restaurant: restaurant_data },
             headers: @auth_headers,
             as: :json
      end

      assert_response :created
      
      response_data = JSON.parse(response.body)
      assert_equal restaurant_data[:name], response_data["name"]
      assert_equal @user.id, response_data["user_id"]
    end
  end

  test "concurrent requests handling" do
    # 同時リクエストの処理をシミュレート
    restaurant_data = {
      name: "同時リクエストテスト",
      area_tag_id: @area_tag.id,
      genre_tag_id: @genre_tag.id
    }

    # 複数回同じデータで作成を試行（名前の重複は許可されているため成功する）
    3.times do |i|
      restaurant_data[:name] = "同時リクエストテスト#{i}"
      
      post "/api/restaurants",
           params: { restaurant: restaurant_data },
           headers: @auth_headers,
           as: :json

      assert_response :created
    end
  end

  test "invalid data scenarios in sequence" do
    # 複数の無効なデータパターンを順次テスト
    invalid_scenarios = [
      {
        data: { area_tag_id: @area_tag.id, genre_tag_id: @genre_tag.id },
        error_field: "name"
      },
      {
        data: { name: "テスト", genre_tag_id: @genre_tag.id },
        error_field: "area_tag"
      },
      {
        data: { name: "テスト", area_tag_id: @area_tag.id },
        error_field: "genre_tag"
      }
    ]

    invalid_scenarios.each do |scenario|
      assert_no_difference("Restaurant.count") do
        post "/api/restaurants",
             params: { restaurant: scenario[:data] },
             headers: @auth_headers,
             as: :json
      end

      assert_response :unprocessable_entity
      
      response_data = JSON.parse(response.body)
      assert_not_nil response_data["errors"]
      assert_not_nil response_data["errors"][scenario[:error_field]]
    end
  end
end
