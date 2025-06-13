require 'fileutils'

module Api
  class ReviewsController < ApplicationController
    before_action :require_authentication!, only: [:create] # Ensures current_user is set
    before_action :set_restaurant, only: [:create]

    def create
      review = @restaurant.reviews.new(review_params)
      review.user = current_user

      if params[:review] && params[:review][:image].present?
        uploaded_file = params[:review][:image]
        upload_dir = Rails.root.join('public', 'uploads', 'reviews')
        FileUtils.mkdir_p(upload_dir) unless Dir.exist?(upload_dir)

        filename = "#{SecureRandom.hex}_#{uploaded_file.original_filename}"
        file_path = upload_dir.join(filename)

        File.open(file_path, 'wb') do |file|
          file.write(uploaded_file.read)
        end
        review.image_url = "/uploads/reviews/#{filename}"
      end

      if review.save
        # Reload with associations for serializer
        review.reload
        render json: ReviewSerializer.new(review).serialize, status: :created
      else
        render json: { errors: review.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    # JWT認証が必要かどうかを判定
    def jwt_authentication_required?
      action_name.to_sym == :create
    end

    def set_restaurant
      @restaurant = Restaurant.find_by(id: params[:restaurant_id])
      unless @restaurant
        render json: { error: '店舗が見つかりません' }, status: :not_found
      end
    end

    def review_params
      params.require(:review).permit(:comment, :rating, :scene_tag_id) # Image is handled separately
    end

  end
end
