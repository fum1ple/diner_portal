require 'rails_helper'

RSpec.describe Review, type: :model do
  describe 'validations' do
    let(:user) { FactoryBot.create(:user) }
    let(:restaurant) { FactoryBot.create(:restaurant) }
    let(:scene_tag) { FactoryBot.create(:tag, :scene) } # Explicitly use scene trait
    let(:area_tag) { FactoryBot.create(:tag, :area) }

    it 'is valid with valid attributes' do
      review = FactoryBot.build(:review, user: user, restaurant: restaurant)
      expect(review).to be_valid
    end

    it 'is valid without scene_tags' do
      review = FactoryBot.build(:review, user: user, restaurant: restaurant)
      expect(review).to be_valid
      expect(review.scene_tags).to be_empty
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

    context 'with scene_tags association' do
      it 'can have multiple scene tags' do
        review = FactoryBot.create(:review, user: user, restaurant: restaurant)
        scene_tag1 = FactoryBot.create(:tag, :scene, name: 'デート')
        scene_tag2 = FactoryBot.create(:tag, :scene, name: '友人との食事')
        
        review.scene_tags << [scene_tag1, scene_tag2]
        expect(review.scene_tags.count).to eq(2)
        expect(review.scene_tags).to include(scene_tag1, scene_tag2)
      end

      it 'can have no scene tags' do
        review = FactoryBot.create(:review, user: user, restaurant: restaurant)
        expect(review.scene_tags).to be_empty
      end
    end
  end

  describe 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:restaurant) }
    it { should have_many(:review_scene_tags).dependent(:destroy) }
    it { should have_many(:scene_tags).through(:review_scene_tags) }
  end
end
