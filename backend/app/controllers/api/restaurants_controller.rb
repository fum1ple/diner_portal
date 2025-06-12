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

      # 店舗名で部分一致検索
      if params[:name].present?
        name = params[:name].strip
        unless name.blank?
          restaurants = restaurants.where('restaurants.name ILIKE ?', "%#{name}%") #sqlのILIKEを使用して大文字小文字を区別せずに部分一致検索
        else
          restaurants = Restaurant.none
        end
      end

      # エリアタグ名で絞り込み
      if params[:area].present?
        area = params[:area].strip
        unless area.blank?
          restaurants = restaurants.joins('JOIN tags AS area_tags ON restaurants.area_tag_id = area_tags.id')
                                  .where('area_tags.name = ? AND area_tags.category = ?', area, 'area')
        end
      end

      # ジャンルタグ名で絞り込み
      if params[:genre].present?
        genre = params[:genre].strip
        unless genre.blank?
          restaurants = restaurants.joins('JOIN tags AS genre_tags ON restaurants.genre_tag_id = genre_tags.id')
                                  .where('genre_tags.name = ? AND genre_tags.category = ?', genre, 'genre')
        end
      end

      # レストランの一覧をJSON形式で返す
      render json: restaurants.map { |restaurant| restaurant_response(restaurant) }
    end

    def show
      # 指定IDのレストランを取得（area_tag, genre_tag, reviewsとその関連も含めて）
      restaurant = Restaurant.includes(:area_tag, :genre_tag, reviews: [:user, :scene_tag]).find_by(id: params[:id])
      if restaurant
        render json: restaurant_response(restaurant)
      else
        render json: { error: '店舗が見つかりません' }, status: :not_found
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
    # レストランオブジェクトを受け取り、必要な情報を含むハッシュを返す
    def restaurant_response(restaurant)
      response_data = {
        id: restaurant.id,
        name: restaurant.name,
        area_tag_id: restaurant.area_tag_id,
        genre_tag_id: restaurant.genre_tag_id,
        user_id: restaurant.user_id,
        created_at: restaurant.created_at,
        updated_at: restaurant.updated_at,
        average_rating: restaurant.average_rating,
        review_count: restaurant.review_count,
        area_tag: {
          id: restaurant.area_tag&.id,
          name: restaurant.area_tag&.name,
          category: restaurant.area_tag&.category
        },
        genre_tag: {
          id: restaurant.genre_tag&.id,
          name: restaurant.genre_tag&.name,
          category: restaurant.genre_tag&.category
        },
        url: "/restaurants/#{restaurant.id}"
      }

      # reviewsキーをレスポンスに追加 (showアクションの場合のみ)
      # reviews属性が存在し、かつnilでない場合にのみキーを追加
      if restaurant.respond_to?(:reviews) && restaurant.reviews.loaded?
        response_data[:reviews] = restaurant.reviews.order(created_at: :desc).map do |review|
          review_data = {
            id: review.id,
            comment: review.comment,
            rating: review.rating,
            image_url: review.image_url,
            created_at: review.created_at,
            user: {
              id: review.user.id,
              name: review.user.name
            }
          }
          if review.scene_tag
            review_data[:scene_tag] = {
              id: review.scene_tag.id,
              name: review.scene_tag.name
            }
          else
            review_data[:scene_tag] = nil
          end
          review_data
        end
      end
      # is_favoritedフラグを追加
      response_data[:is_favorited] = current_user&.favorites&.exists?(restaurant_id: restaurant.id) || false
      response_data
    end
  end
end
