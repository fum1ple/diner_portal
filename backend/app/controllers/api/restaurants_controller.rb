module Api
  class RestaurantsController < ApplicationController

    def create
      #レストランの作成
      restaurant = Restaurant.new(restaurant_params)
      restaurant.user = current_user
      if restaurant.save
        render json: restaurant_response(restaurant), status: :created # レストランの作成に成功した場合、レスポンスを返す
      else
        render json: { errors: restaurant.errors.messages }, status: :unprocessable_entity # レストランの作成に失敗した場合、エラーメッセージを返す
      end
    end

    def index
      # レストランの一覧を取得
      # includesメソッドを使用して、関連するarea_tagとgenre_tagを事前にロード
      # orderメソッドを使用して、作成日時の降順で並べ替え
      restaurants = Restaurant.includes(:area_tag, :genre_tag).order(created_at: :desc)
      # レストランの一覧をJSON形式で返す
      render json: restaurants.map { |restaurant| restaurant_response(restaurant) }
    end

    def show
      # 指定IDのレストランを取得（area_tag, genre_tagも含めて）
      restaurant = Restaurant.includes(:area_tag, :genre_tag).find_by(id: params[:id])
      if restaurant
        render json: restaurant_response(restaurant)
      else
        render json: { error: 'Restaurant not found' }, status: :not_found
      end
    end

    private

    # JWT認証が必要かどうかを判定
    def jwt_authentication_required?
      # create, index, showアクションでは認証が必要
      %w[create index show].include?(action_name)
    end

    def restaurant_params
      params.require(:restaurant).permit(:name, :area_tag_id, :genre_tag_id)
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
        created_at: restaurant.created_at,
        updated_at: restaurant.updated_at,
        area_tag: {
          id: restaurant.area_tag&.id, #&.はnilチェックを行う。restaurant.area_tagがnilの場合、idはnilになる
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
