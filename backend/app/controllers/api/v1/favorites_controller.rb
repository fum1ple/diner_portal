module Api
  module V1
    class FavoritesController < ApplicationController
      before_action :set_restaurant, only: [:create]

      def index
        @favorites = @current_user.favorite_restaurants
        render json: @favorites.map { |restaurant| RestaurantSerializer.new(restaurant).as_json }
      end

      def create
        @favorite = @current_user.favorites.build(restaurant: @restaurant)
        if @favorite.save
          render json: { message: 'Added to favorites' }, status: :created
        else
          render json: { error: @favorite.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @favorite = @current_user.favorites.find_by(restaurant_id: params[:id])
        if @favorite
          @favorite.destroy
          head :no_content
        else
          render json: { error: 'Favorite not found' }, status: :not_found
        end
      end

      private

      def set_restaurant
        @restaurant = Restaurant.find(params[:restaurant_id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Restaurant not found' }, status: :not_found
      end
    end
  end
end
