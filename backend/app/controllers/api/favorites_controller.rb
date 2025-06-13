# frozen_string_literal: true

class Api::FavoritesController < ApplicationController
  include ApiAuthentication

  requires_authentication_for_all

  # GET /api/favorites
  def index
    favorites = current_user.favorite_restaurants.includes(:area_tag, :genre_tag)
    render json: favorites.as_json(include: [:area_tag, :genre_tag])
  end

  # POST /api/restaurants/:restaurant_id/favorite
  def create
    restaurant = Restaurant.find(params[:restaurant_id])
    favorite = current_user.favorites.build(restaurant: restaurant)
    if favorite.save
      render json: { success: true }, status: :created
    else
      render json: { error: favorite.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Restaurant not found' }, status: :not_found
  end

  # DELETE /api/restaurants/:restaurant_id/favorite
  def destroy
    favorite = current_user.favorites.find_by(restaurant_id: params[:restaurant_id])
    if favorite
      favorite.destroy
      head :no_content
    else
      render json: { error: 'お気に入りが見つかりません' }, status: :not_found
    end
  end
end
