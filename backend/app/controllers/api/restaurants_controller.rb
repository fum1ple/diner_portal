module Api
  class RestaurantsController < ApplicationController

    def create
      #レストランの作成
      restaurant = Restaurant.new(restaurant_params)
      restaurant.user = current_user
      if restaurant.save
        render json: RestaurantSerializer.new(restaurant, params: { current_user: current_user }).serialize, status: :created # レストランの作成に成功した場合、レスポンスを返す
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
          restaurants = restaurants.joins(:area_tag)
                                  .where(area_tag: { name: area, category: 'area' })
        end
      end

      # ジャンルタグ名で絞り込み
      if params[:genre].present?
        genre = params[:genre].strip
        unless genre.blank?
          restaurants = restaurants.joins(:genre_tag)
                                  .where(genre_tag: { name: genre, category: 'genre' })
        end
      end

      # ユーザーのお気に入りを事前にロードしてN+1クエリを防ぐ
      @user_favorited_restaurant_ids = current_user&.favorite_restaurants&.pluck(:id)&.to_set || Set.new

      # レストランの一覧をJSON形式で返す
      render json: RestaurantSerializer.new(restaurants, params: { current_user: current_user }).serialize
    end

    def show
      # 指定IDのレストランを取得（area_tag, genre_tag, reviewsとその関連も含めて）
      restaurant = Restaurant.includes(:area_tag, :genre_tag, reviews: [:user, :scene_tag]).find_by(id: params[:id])
      if restaurant
        # 単一レストランの場合は直接お気に入り状態をチェック（Setのオーバーヘッドを避ける）
        @is_favorited_by_current_user = current_user&.favorites&.exists?(restaurant_id: restaurant.id) || false
        render json: RestaurantSerializer.new(restaurant, params: { current_user: current_user }).serialize
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
  end
end
