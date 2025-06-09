require 'rails_helper'

RSpec.describe Review, type: :model do
  describe 'validations' do
    let(:user) { FactoryBot.create(:user) }
    let(:restaurant) { FactoryBot.create(:restaurant) }
    let(:scene_tag) { FactoryBot.create(:tag, :scene) } # Explicitly use scene trait
    let(:area_tag) { FactoryBot.create(:tag, :area) }

    it 'is valid with valid attributes' do
      review = FactoryBot.build(:review, user: user, restaurant: restaurant, scene_tag: scene_tag)
      expect(review).to be_valid
    end

    it 'is valid without a scene_tag' do
      review = FactoryBot.build(:review, user: user, restaurant: restaurant, scene_tag: nil)
      expect(review).to be_valid
    end

    it 'is invalid without a comment' do
      review = FactoryBot.build(:review, comment: nil, user: user, restaurant: restaurant)
      expect(review).not_to be_valid
      expect(review.errors[:comment]).to include("can't be blank")
    end

    it 'is invalid with a comment longer than 1000 characters' do
      review = FactoryBot.build(:review, comment: 'a' * 1001, user: user, restaurant: restaurant)
      expect(review).not_to be_valid
      expect(review.errors[:comment]).to include('is too long (maximum is 1000 characters)')
    end

    it 'is invalid without a rating' do
      review = FactoryBot.build(:review, rating: nil, user: user, restaurant: restaurant)
      expect(review).not_to be_valid
      expect(review.errors[:rating]).to include("can't be blank")
    end

    it 'is invalid with a rating less than 1' do
      review = FactoryBot.build(:review, rating: 0, user: user, restaurant: restaurant)
      expect(review).not_to be_valid
      expect(review.errors[:rating]).to include('must be greater than or equal to 1')
    end

    it 'is invalid with a rating greater than 5' do
      review = FactoryBot.build(:review, rating: 6, user: user, restaurant: restaurant)
      expect(review).not_to be_valid
      expect(review.errors[:rating]).to include('must be less than or equal to 5')
    end

    it 'is invalid with a non-integer rating' do
      review = FactoryBot.build(:review, rating: 3.5, user: user, restaurant: restaurant)
      expect(review).not_to be_valid
      expect(review.errors[:rating]).to include('must be an integer')
    end

    it 'is invalid without a user' do
      review = FactoryBot.build(:review, user: nil, restaurant: restaurant)
      expect(review).not_to be_valid
      # Error message might be for :user or :user_id depending on setup,
      # :user covers association presence.
      expect(review.errors[:user]).to include("must exist")
    end

    it 'is invalid without a restaurant' do
      review = FactoryBot.build(:review, restaurant: nil, user: user)
      expect(review).not_to be_valid
      expect(review.errors[:restaurant]).to include("must exist")
    end

    context 'with scene_tag_is_scene_category validation' do
      it 'is valid when scene_tag has category "scene"' do
        review = FactoryBot.build(:review, user: user, restaurant: restaurant, scene_tag: scene_tag)
        expect(review).to be_valid
      end

      it 'is invalid when scene_tag is not nil and category is not "scene"' do
        review = FactoryBot.build(:review, user: user, restaurant: restaurant, scene_tag: area_tag)
        expect(review).not_to be_valid
        expect(review.errors[:scene_tag_id]).to include('シーンタグを選択してください')
      end
    end
  end

  describe 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:restaurant) }
    it { should belong_to(:scene_tag).optional } # Test optionality
  end
end
