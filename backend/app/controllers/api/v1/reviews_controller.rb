module Api
  module V1
    class ReviewsController < ApplicationController
      skip_before_action :authenticate_request, only: [:index]
      before_action :set_restaurant, only: [:index, :create]
      before_action :set_review, only: [:update, :destroy]
      before_action :check_owner, only: [:update, :destroy]

      def index
        @reviews = @restaurant.reviews.includes(:user).order(created_at: :desc)
        render json: @reviews.map { |review| ReviewSerializer.new(review).as_json }
      end

      def create
        @review = @current_user.reviews.build(review_params.merge(restaurant: @restaurant))
        if @review.save
          render json: ReviewSerializer.new(@review).as_json, status: :created
        else
          render json: { error: @review.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @review.update(review_params)
          render json: ReviewSerializer.new(@review).as_json
        else
          render json: { error: @review.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @review.destroy
        head :no_content
      end

      def my_reviews
        @reviews = @current_user.reviews.includes(:restaurant).order(created_at: :desc)
        render json: @reviews.map { |review| ReviewSerializer.new(review).as_json }
      end

      private

      def review_params
        params.require(:review).permit(:content, :rating)
      end

      def set_restaurant
        @restaurant = Restaurant.find(params[:restaurant_id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Restaurant not found' }, status: :not_found
      end

      def set_review
        @review = Review.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Review not found' }, status: :not_found
      end

      def check_owner
        unless @review.user_id == @current_user.id
          render json: { error: 'Not authorized' }, status: :forbidden
        end
      end
    end
  end
end
