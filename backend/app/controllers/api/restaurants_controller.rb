module Api
  class RestaurantsController < ApplicationController
    #ユーザーがログインしていることを確認
    before_action :authenticate_user!

    def create
        #レストランの作成
      restaurant = Restaurant.new(restaurant_params)
      restaurant.user = current_user
      if restaurant.save
        render json: restaurant_response(restaurant), status: :created # レストランの作成に成功した場合、レスポンスを返す 
      else
        render json: { errors: restaurant.errors.full_messages }, status: :unprocessable_entity # レストランの作成に失敗した場合、エラーメッセージを返す
      end
    end

    private 
    def restaurant_params
      params.require(:restaurant).permit(:name, :area_tag, :genre_tag)
    end

    # レストランのレスポンス形式を定義
    # @レストランオブジェクトｗを受け取り、必要な情報を含むハッシュを返す
    def restaurant_response(restaurant)
      {
        id: restaurant.id,
        name: restaurant.name,
        area_tag_id: restaurant.area_tag_id,
        genre_tag_id: restaurant.genre_tag_id,
        user_id: restaurant.user_id,
        area_tag: {
          id: restaurant.area_tag&.id,　#&.はnilチェックを行う。restaurant.area_tagがnilの場合、idはnilになる
          name: restaurant.area_tag&.name, 
          category: restaurant.area_tag&.category 
        },
        genre_tag: {
          id: restaurant.genre_tag&.id,
          name: restaurant.genre_tag&.name,
          category: restaurant.genre_tag&.category
        }
      }
    end
  end
end
