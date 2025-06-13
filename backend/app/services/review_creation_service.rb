# frozen_string_literal: true

require 'fileutils'

# レビュー作成を担当するサービスクラス
# ファイルアップロード、レビュー作成、シーンタグ関連付けを一括処理
class ReviewCreationService
  attr_reader :errors

  def initialize(restaurant, user, review_params, image_file = nil)
    @restaurant = restaurant
    @user = user
    @review_params = review_params
    @image_file = image_file
    @errors = []
  end

  def call
    ActiveRecord::Base.transaction do
      create_review
      handle_image_upload if @image_file.present?
      associate_scene_tags if scene_tag_ids.present?
      @review.reload
      
      Result.success(@review)
    end
  rescue ActiveRecord::RecordInvalid => e
    Result.failure(e.record.errors.full_messages)
  rescue => e
    Rails.logger.error "Review creation failed: #{e.message}"
    Result.failure(['レビューの作成に失敗しました'])
  end

  private

  def create_review
    @review = @restaurant.reviews.new(review_attributes)
    @review.user = @user
    @review.save!
  end

  def handle_image_upload
    upload_dir = Rails.root.join('public', 'uploads', 'reviews')
    FileUtils.mkdir_p(upload_dir) unless Dir.exist?(upload_dir)

    filename = generate_filename(@image_file.original_filename)
    file_path = upload_dir.join(filename)

    File.open(file_path, 'wb') do |file|
      file.write(@image_file.read)
    end

    @review.update!(image_url: "/uploads/reviews/#{filename}")
  end

  def associate_scene_tags
    scene_tag_ids.reject(&:blank?).each do |tag_id|
      tag = Tag.find_by(id: tag_id, category: 'scene')
      
      if tag
        @review.review_scene_tags.create!(scene_tag: tag)
      else
        @review.errors.add(:scene_tag_ids, "無効なシーンタグIDです: #{tag_id}")
        raise ActiveRecord::RecordInvalid.new(@review)
      end
    end
  end

  def review_attributes
    @review_params.except(:scene_tag_ids)
  end

  def scene_tag_ids
    @review_params[:scene_tag_ids] || []
  end

  def generate_filename(original_filename)
    "#{SecureRandom.hex}_#{original_filename}"
  end

  # 結果を表現するValueObject
  class Result
    attr_reader :review, :errors

    def initialize(success, review = nil, errors = [])
      @success = success
      @review = review
      @errors = errors
    end

    def success?
      @success
    end

    def failure?
      !@success
    end

    def self.success(review)
      new(true, review)
    end

    def self.failure(errors)
      new(false, nil, errors)
    end
  end
end