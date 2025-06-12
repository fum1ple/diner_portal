require 'rails_helper'

RSpec.describe Favorite, type: :model do
  let(:user) { User.create!(google_id: 'google123', email: 'user@example.com', name: 'User') }
  let(:area_tag) { Tag.create!(name: '東京', category: 'area') }
  let(:genre_tag) { Tag.create!(name: 'イタリアン', category: 'genre') }
  let(:restaurant) { Restaurant.create!(name: 'テストレストラン', user: user, area_tag: area_tag, genre_tag: genre_tag) }

  describe 'associations' do
    it 'belongs to user' do
      favorite = Favorite.new(user: user, restaurant: restaurant)
      expect(favorite.user).to eq(user)
    end

    it 'belongs to restaurant' do
      favorite = Favorite.new(user: user, restaurant: restaurant)
      expect(favorite.restaurant).to eq(restaurant)
    end
  end

  describe 'validations' do
    it 'is valid with valid attributes' do
      favorite = Favorite.new(user: user, restaurant: restaurant)
      expect(favorite).to be_valid
    end

    it 'is invalid without user' do
      favorite = Favorite.new(restaurant: restaurant)
      expect(favorite).not_to be_valid
      expect(favorite.errors[:user]).to include('must exist')
    end

    it 'is invalid without restaurant' do
      favorite = Favorite.new(user: user)
      expect(favorite).not_to be_valid
      expect(favorite.errors[:restaurant]).to include('must exist')
    end
  end

  describe 'unique constraints' do
    it 'allows one favorite per user per restaurant' do
      Favorite.create!(user: user, restaurant: restaurant)
      duplicate_favorite = Favorite.new(user: user, restaurant: restaurant)
      expect(duplicate_favorite).not_to be_valid
    end

    it 'allows different users to favorite the same restaurant' do
      another_user = User.create!(google_id: 'google456', email: 'another@example.com', name: 'Another User')
      Favorite.create!(user: user, restaurant: restaurant)
      another_favorite = Favorite.new(user: another_user, restaurant: restaurant)
      expect(another_favorite).to be_valid
    end

    it 'allows same user to favorite different restaurants' do
      another_restaurant = Restaurant.create!(name: '別のレストラン', user: user, area_tag: area_tag, genre_tag: genre_tag)
      Favorite.create!(user: user, restaurant: restaurant)
      another_favorite = Favorite.new(user: user, restaurant: another_restaurant)
      expect(another_favorite).to be_valid
    end
  end
end
