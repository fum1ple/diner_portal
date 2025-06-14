
module Api
  class ReviewsController < ApplicationController
    include ApiAuthentication

    requires_authentication :create

    before_action :require_authentication!, only: [:create] # Ensures current_user is set
    before_action :set_restaurant, only: [:create, :index]

    def index
      reviews = @restaurant.reviews.includes(:user, :scene_tags)
      render json: ReviewSerializer.new(reviews).serialize
    end

    def create
      image_file = params[:review]&.[](:image)
      
      result = ReviewCreationService.new(
        @restaurant,
        current_user,
        review_params,
        image_file
      ).call

      if result.success?
        render json: ReviewSerializer.new(result.review).serialize, status: :created
      else
        render json: { errors: result.errors }, status: :unprocessable_entity
      end
    end

    private


    def set_restaurant
      @restaurant = Restaurant.find_by(id: params[:restaurant_id])
      unless @restaurant
        render json: { error: '店舗が見つかりません' }, status: :not_found
      end
    end

    def review_params
      params.require(:review).permit(:comment, :rating, scene_tag_ids: []) # Image is handled separately
    end

  end
end