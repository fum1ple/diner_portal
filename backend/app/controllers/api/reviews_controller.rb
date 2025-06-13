require 'fileutils'

module Api
  class ReviewsController < ApplicationController
    before_action :require_authentication!, only: [:create] # Ensures current_user is set
    before_action :set_restaurant, only: [:create]

    def create
      review_attributes = review_params.except(:scene_tag_ids)
      review = @restaurant.reviews.new(review_attributes)
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

      begin
        ActiveRecord::Base.transaction do
          if review.save!
            # シーンタグの関連付けを処理
            if review_params[:scene_tag_ids].present?
              scene_tag_ids = review_params[:scene_tag_ids].reject(&:blank?)
              scene_tag_ids.each do |tag_id|
                tag = Tag.find_by(id: tag_id, category: 'scene')
                if tag
                  review.review_scene_tags.create!(scene_tag: tag)
                else
                  raise ActiveRecord::RecordInvalid.new(review.tap { |r| r.errors.add(:scene_tag_ids, "無効なシーンタグIDです: #{tag_id}") })
                end
              end
            end

            # Reload with associations for serializer
            review.reload
            render json: ReviewSerializer.new(review).serialize, status: :created
          end
        end
      rescue ActiveRecord::RecordInvalid => e
        render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
      rescue => e
        render json: { errors: ['レビューの作成に失敗しました'] }, status: :unprocessable_entity
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
      params.require(:review).permit(:comment, :rating, scene_tag_ids: []) # Image is handled separately
    end

  end
end