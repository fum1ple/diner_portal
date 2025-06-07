require 'fileutils'

module Api
  class ReviewsController < ApplicationController
    before_action :require_authentication!, only: [:create] # Ensures current_user is set
    before_action :set_restaurant, only: [:create]

    def create
      review = @restaurant.reviews.new(review_params)
      review.user = current_user

      # Handle image upload
      if params[:review] && params[:review][:image].present?
        uploaded_file = params[:review][:image]
        # Ensure the directory exists
        upload_dir = Rails.root.join('public', 'uploads', 'reviews')
        FileUtils.mkdir_p(upload_dir) unless Dir.exist?(upload_dir)

        # Generate a unique filename
        filename = "#{SecureRandom.hex}_#{uploaded_file.original_filename}"
        file_path = upload_dir.join(filename)

        File.open(file_path, 'wb') do |file|
          file.write(uploaded_file.read)
        end
        review.image_url = "/uploads/reviews/#{filename}"
      end

      if review.save
        render json: review_response(review), status: :created
      else
        render json: { errors: review.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    # This ensures that authenticate_jwt_token from JwtAuthenticatable concern runs for :create
    def jwt_authentication_required?
      action_name.to_sym == :create
    end

    def set_restaurant
      @restaurant = Restaurant.find_by(id: params[:restaurant_id])
      unless @restaurant
        render json: { error: 'Restaurant not found' }, status: :not_found
      end
    end

    def review_params
      params.require(:review).permit(:comment, :rating, :scene_tag_id) # Image is handled separately
    end

    def review_response(review)
      response = {
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
        response[:scene_tag] = {
          id: review.scene_tag.id,
          name: review.scene_tag.name
        }
      else
        response[:scene_tag] = nil
      end
      response
    end
  end
end
