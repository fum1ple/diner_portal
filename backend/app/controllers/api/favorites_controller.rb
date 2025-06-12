# お気に入りAPIコントローラ雛形
class Api::FavoritesController < ApplicationController
  # JWT認証必須
  def jwt_authentication_required?
    true
  end

  # POST /api/restaurants/:restaurant_id/favorite
  def create
    restaurant = Restaurant.find(params[:restaurant_id])
    favorite = current_user.favorites.find_or_create_by(restaurant: restaurant)
    render json: { success: true, favorite_id: favorite.id }, status: :created
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Restaurant not found' }, status: :not_found
  end

  # DELETE /api/restaurants/:restaurant_id/favorite
  def destroy
    favorite = current_user.favorites.find_by(restaurant_id: params[:restaurant_id])
    if favorite
      favorite.destroy
      render json: { success: true }, status: :ok
    else
      render json: { error: 'Favorite not found' }, status: :not_found
    end
  end

  # GET /api/favorites
  def index
    favorites = current_user.favorite_restaurants.includes(:area_tag, :genre_tag)
    render json: favorites.as_json(include: [:area_tag, :genre_tag])
  end
end
