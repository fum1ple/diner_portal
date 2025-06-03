require "test_helper"

class Api::RestaurantsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:one)
    @area_tag = Tag.create!(name: "東京", category: "area")
    @genre_tag = Tag.create!(name: "イタリアン", category: "genre")

    # JWTトークンを生成
    @token = JwtService.encode_token({ user_id: @user.id })
    @auth_headers = { "Authorization" => "Bearer #{@token}" }
  end

  test "should create restaurant with valid data" do
    restaurant_params = {
      name: "新しいレストラン",
      area_tag_id: @area_tag.id,
      genre_tag_id: @genre_tag.id
    }

    assert_difference("Restaurant.count", 1) do
      post "/api/restaurants",
           params: { restaurant: restaurant_params },
           headers: @auth_headers,
           as: :json
    end

    assert_response :created

    response_data = JSON.parse(response.body)
    assert_equal "新しいレストラン", response_data["name"]
    assert_equal @user.id, response_data["user_id"]
    assert_equal @area_tag.id, response_data["area_tag_id"]
    assert_equal @genre_tag.id, response_data["genre_tag_id"]

    # 関連データも含まれているかチェック
    assert_equal "東京", response_data["area_tag"]["name"]
    assert_equal "area", response_data["area_tag"]["category"]
    assert_equal "イタリアン", response_data["genre_tag"]["name"]
    assert_equal "genre", response_data["genre_tag"]["category"]
  end

  test "should return 422 when name is missing" do
    restaurant_params = {
      area_tag_id: @area_tag.id,
      genre_tag_id: @genre_tag.id
    }

    assert_no_difference("Restaurant.count") do
      post "/api/restaurants",
           params: { restaurant: restaurant_params },
           headers: @auth_headers,
           as: :json
    end

    assert_response :unprocessable_entity

    response_data = JSON.parse(response.body)
    assert_includes response_data["errors"]["name"], "can't be blank"
  end

  test "should return 422 when area_tag_id is missing" do
    restaurant_params = {
      name: "テストレストラン",
      genre_tag_id: @genre_tag.id
    }

    assert_no_difference("Restaurant.count") do
      post "/api/restaurants",
           params: { restaurant: restaurant_params },
           headers: @auth_headers,
           as: :json
    end

    assert_response :unprocessable_entity

    response_data = JSON.parse(response.body)
    assert_includes response_data["errors"]["area_tag"], "must exist"
  end

  test "should return 422 when genre_tag_id is missing" do
    restaurant_params = {
      name: "テストレストラン",
      area_tag_id: @area_tag.id
    }

    assert_no_difference("Restaurant.count") do
      post "/api/restaurants",
           params: { restaurant: restaurant_params },
           headers: @auth_headers,
           as: :json
    end

    assert_response :unprocessable_entity

    response_data = JSON.parse(response.body)
    assert_includes response_data["errors"]["genre_tag"], "must exist"
  end

  test "should return 422 when area_tag_id does not exist" do
    restaurant_params = {
      name: "テストレストラン",
      area_tag_id: 99999,
      genre_tag_id: @genre_tag.id
    }

    assert_no_difference("Restaurant.count") do
      post "/api/restaurants",
           params: { restaurant: restaurant_params },
           headers: @auth_headers,
           as: :json
    end

    assert_response :unprocessable_entity

    response_data = JSON.parse(response.body)
    assert_includes response_data["errors"]["area_tag"], "must exist"
  end

  test "should return 422 when genre_tag_id does not exist" do
    restaurant_params = {
      name: "テストレストラン",
      area_tag_id: @area_tag.id,
      genre_tag_id: 99999
    }

    assert_no_difference("Restaurant.count") do
      post "/api/restaurants",
           params: { restaurant: restaurant_params },
           headers: @auth_headers,
           as: :json
    end

    assert_response :unprocessable_entity

    response_data = JSON.parse(response.body)
    assert_includes response_data["errors"]["genre_tag"], "must exist"
  end

  test "should return 422 when area_tag is not area category" do
    wrong_tag = Tag.create!(name: "間違いタグ", category: "genre")
    restaurant_params = {
      name: "テストレストラン",
      area_tag_id: wrong_tag.id,
      genre_tag_id: @genre_tag.id
    }

    assert_no_difference("Restaurant.count") do
      post "/api/restaurants",
           params: { restaurant: restaurant_params },
           headers: @auth_headers,
           as: :json
    end

    assert_response :unprocessable_entity

    response_data = JSON.parse(response.body)
    assert_includes response_data["errors"]["area_tag_id"], "must be an area tag"
  end

  test "should return 422 when genre_tag is not genre category" do
    wrong_tag = Tag.create!(name: "間違いタグ", category: "area")
    restaurant_params = {
      name: "テストレストラン",
      area_tag_id: @area_tag.id,
      genre_tag_id: wrong_tag.id
    }

    assert_no_difference("Restaurant.count") do
      post "/api/restaurants",
           params: { restaurant: restaurant_params },
           headers: @auth_headers,
           as: :json
    end

    assert_response :unprocessable_entity

    response_data = JSON.parse(response.body)
    assert_includes response_data["errors"]["genre_tag_id"], "must be a genre tag"
  end

  test "should return 401 when not authenticated" do
    restaurant_params = {
      name: "テストレストラン",
      area_tag_id: @area_tag.id,
      genre_tag_id: @genre_tag.id
    }

    assert_no_difference("Restaurant.count") do
      post "/api/restaurants",
           params: { restaurant: restaurant_params },
           as: :json
    end

    assert_response :unauthorized
  end

  test "should return 401 with invalid token" do
    restaurant_params = {
      name: "テストレストラン",
      area_tag_id: @area_tag.id,
      genre_tag_id: @genre_tag.id
    }

    invalid_headers = { "Authorization" => "Bearer invalid_token" }

    assert_no_difference("Restaurant.count") do
      post "/api/restaurants",
           params: { restaurant: restaurant_params },
           headers: invalid_headers,
           as: :json
    end

    assert_response :unauthorized
  end

  test "should return 422 with empty name" do
    restaurant_params = {
      name: "",
      area_tag_id: @area_tag.id,
      genre_tag_id: @genre_tag.id
    }

    assert_no_difference("Restaurant.count") do
      post "/api/restaurants",
           params: { restaurant: restaurant_params },
           headers: @auth_headers,
           as: :json
    end

    assert_response :unprocessable_entity

    response_data = JSON.parse(response.body)
    assert_includes response_data["errors"]["name"], "can't be blank"
  end

  test "should return 422 with too long name" do
    restaurant_params = {
      name: "a" * 256,
      area_tag_id: @area_tag.id,
      genre_tag_id: @genre_tag.id
    }

    assert_no_difference("Restaurant.count") do
      post "/api/restaurants",
           params: { restaurant: restaurant_params },
           headers: @auth_headers,
           as: :json
    end

    assert_response :unprocessable_entity

    response_data = JSON.parse(response.body)
    assert_includes response_data["errors"]["name"], "is too long (maximum is 255 characters)"
  end

  test "should create restaurant with exact maximum name length" do
    restaurant_params = {
      name: "a" * 255,
      area_tag_id: @area_tag.id,
      genre_tag_id: @genre_tag.id
    }

    assert_difference("Restaurant.count", 1) do
      post "/api/restaurants",
           params: { restaurant: restaurant_params },
           headers: @auth_headers,
           as: :json
    end

    assert_response :created
  end
end
