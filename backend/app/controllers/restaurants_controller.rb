class RestaurantsController < ApplicationController
  def index
    restaurants = Restaurant.all
    render json: restaurants
  end

  def create
    restaurant = Restaurant.new(restaurant_params)
    if restaurant.save
      render json: restaurant, status: :created
    else
      render json: { errors: restaurant.errors }, status: :unprocessable_entity
    end
  end

  def show
    restaurant = Restaurant.find(params[:id])
    render json: restaurant
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Restaurant not found' }, status: :not_found
  end

  private

  def restaurant_params
    params.require(:restaurant).permit(:name, :category, :address, :phone, :website)
  end
end
