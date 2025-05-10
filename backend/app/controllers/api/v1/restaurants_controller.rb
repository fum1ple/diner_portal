module Api
  module V1
    class RestaurantsController < ApplicationController
      skip_before_action :authenticate_request, only: [:index, :show]
      before_action :set_restaurant, only: [:show, :update, :destroy]
      before_action :check_owner, only: [:update, :destroy]

      def index
        @restaurants = Restaurant.all
        render json: @restaurants.map { |restaurant| RestaurantSerializer.new(restaurant).as_json }
      end

      def show
        render json: RestaurantSerializer.new(@restaurant).as_json
      end

      def create
        @restaurant = @current_user.restaurants.build(restaurant_params)
        if @restaurant.save
          render json: RestaurantSerializer.new(@restaurant).as_json, status: :created
        else
          render json: { errors: @restaurant.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @restaurant.update(restaurant_params)
          render json: RestaurantSerializer.new(@restaurant).as_json
        else
          render json: { errors: @restaurant.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @restaurant.destroy
        head :no_content
      end

      def my_restaurants
        @restaurants = @current_user.restaurants
        render json: @restaurants.map { |restaurant| RestaurantSerializer.new(restaurant).as_json }
      end

      private

      def restaurant_params
        params.require(:restaurant).permit(:name, :description, :address, :image_url)
      end

      def set_restaurant
        @restaurant = Restaurant.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Restaurant not found' }, status: :not_found
      end

      def check_owner
        unless @restaurant.user_id == @current_user.id
          render json: { error: 'Not authorized' }, status: :forbidden
        end
      end
    end
  end
end
