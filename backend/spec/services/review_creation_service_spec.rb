# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ReviewCreationService, type: :service do
  let(:user) { create(:user) }
  let(:restaurant) { create(:restaurant) }
  let(:scene_tag) { create(:tag, category: 'scene', name: 'デート') }
  
  let(:review_params) do
    {
      comment: 'とても美味しかったです',
      rating: 5,
      scene_tag_ids: [scene_tag.id]
    }
  end

  let(:service) { described_class.new(restaurant, user, review_params) }

  describe '#call' do
    context 'when review creation is successful' do
      it 'creates a review successfully' do
        result = service.call
        
        expect(result.success?).to be true
        expect(result.review).to be_persisted
        expect(result.review.comment).to eq('とても美味しかったです')
        expect(result.review.rating).to eq(5)
        expect(result.review.user).to eq(user)
        expect(result.review.restaurant).to eq(restaurant)
      end

      it 'associates scene tags correctly' do
        result = service.call
        
        expect(result.review.scene_tags).to include(scene_tag)
        expect(result.review.review_scene_tags.count).to eq(1)
      end
    end

    context 'when image file is provided' do
      let(:image_file) do
        fixture_file_upload('spec/fixtures/test_image.jpg', 'image/jpeg')
      end
      
      let(:service_with_image) do
        described_class.new(restaurant, user, review_params, image_file)
      end

      before do
        # Create test image file
        FileUtils.mkdir_p(Rails.root.join('spec', 'fixtures'))
        File.write(Rails.root.join('spec', 'fixtures', 'test_image.jpg'), 'fake image data')
      end

      after do
        # Clean up uploaded files
        uploads_dir = Rails.root.join('public', 'uploads', 'reviews')
        FileUtils.rm_rf(uploads_dir) if Dir.exist?(uploads_dir)
      end

      it 'handles image upload correctly' do
        result = service_with_image.call
        
        expect(result.success?).to be true
        expect(result.review.image_url).to match(/\/uploads\/reviews\/.*test_image.jpg/)
      end
    end

    context 'when scene tag is invalid' do
      let(:review_params) do
        {
          comment: 'とても美味しかったです',
          rating: 5,
          scene_tag_ids: [999] # 存在しないID
        }
      end

      it 'returns failure with error message' do
        result = service.call
        
        expect(result.failure?).to be true
        expect(result.errors).to include(match(/無効なシーンタグIDです: 999/))
      end
    end

    context 'when review params are invalid' do
      let(:review_params) do
        {
          comment: '',
          rating: nil
        }
      end

      it 'returns failure with validation errors' do
        result = service.call
        
        expect(result.failure?).to be true
        expect(result.errors).not_to be_empty
      end
    end
  end

  describe 'Result class' do
    describe '.success' do
      it 'creates successful result' do
        review = build(:review)
        result = ReviewCreationService::Result.success(review)
        
        expect(result.success?).to be true
        expect(result.failure?).to be false
        expect(result.review).to eq(review)
        expect(result.errors).to be_empty
      end
    end

    describe '.failure' do
      it 'creates failure result' do
        errors = ['エラーメッセージ']
        result = ReviewCreationService::Result.failure(errors)
        
        expect(result.failure?).to be true
        expect(result.success?).to be false
        expect(result.review).to be_nil
        expect(result.errors).to eq(errors)
      end
    end
  end
end