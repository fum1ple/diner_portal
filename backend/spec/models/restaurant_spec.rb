require 'rails_helper'

RSpec.describe Restaurant, type: :model do
  let!(:user) { User.create!(google_id: 'user123', email: 'user@example.com', name: 'Test User') }
  let!(:area_tag) { Tag.create!(name: '東京', category: 'area') }
  let!(:genre_tag) { Tag.create!(name: 'イタリアン', category: 'genre') }
  let(:valid_restaurant_params) do
    {
      name: 'テストレストラン',
      user: user,
      area_tag: area_tag,
      genre_tag: genre_tag
    }
  end

  describe 'validations' do
    it '有効な属性で作成できる' do
      restaurant = Restaurant.new(valid_restaurant_params)
      expect(restaurant).to be_valid
    end

    it 'nameが必須' do
      restaurant = Restaurant.new(valid_restaurant_params.except(:name))
      expect(restaurant).not_to be_valid
      expect(restaurant.errors[:name]).to include("can't be blank")
    end

    it 'userが必須' do
      restaurant = Restaurant.new(valid_restaurant_params.except(:user))
      expect(restaurant).not_to be_valid
      expect(restaurant.errors[:user_id]).to include("can't be blank")
    end

    it 'area_tagが必須' do
      restaurant = Restaurant.new(valid_restaurant_params.except(:area_tag))
      expect(restaurant).not_to be_valid
      expect(restaurant.errors[:area_tag_id]).to include("can't be blank")
    end

    it 'genre_tagが必須' do
      restaurant = Restaurant.new(valid_restaurant_params.except(:genre_tag))
      expect(restaurant).not_to be_valid
      expect(restaurant.errors[:genre_tag_id]).to include("can't be blank")
    end

    it 'nameの長さを検証' do
      long_name = 'a' * 256
      restaurant = Restaurant.new(valid_restaurant_params.merge(name: long_name))
      expect(restaurant).not_to be_valid
      expect(restaurant.errors[:name]).to include('is too long (maximum is 255 characters)')
    end

    it '最大長のnameを受け入れる' do
      max_length_name = 'a' * 255
      restaurant = Restaurant.new(valid_restaurant_params.merge(name: max_length_name))
      expect(restaurant).to be_valid
    end

    it 'area_tagのカテゴリを検証' do
      wrong_category_tag = Tag.create!(name: 'フレンチ', category: 'genre')
      restaurant = Restaurant.new(valid_restaurant_params.merge(area_tag: wrong_category_tag))
      expect(restaurant).not_to be_valid
      expect(restaurant.errors[:area_tag_id]).to include('エリアタグを選択してください')
    end

    it 'genre_tagのカテゴリを検証' do
      wrong_category_tag = Tag.create!(name: '大阪', category: 'area')
      restaurant = Restaurant.new(valid_restaurant_params.merge(genre_tag: wrong_category_tag))
      expect(restaurant).not_to be_valid
      expect(restaurant.errors[:genre_tag_id]).to include('ジャンルタグを選択してください')
    end

    it '空のnameを許可しない' do
      ['', '   ', "\n\t"].each do |empty_name|
        restaurant = Restaurant.new(valid_restaurant_params.merge(name: empty_name))
        expect(restaurant).not_to be_valid, "#{empty_name.inspect} should be invalid"
      end
    end

    it '特殊文字を含むnameを受け入れる' do
      special_names = [
        'café & restaurant',
        'レストラン「美味」',
        "Restaurant l'Étoile",
        '焼肉・韓国料理 金太郎',
        '中華料理 (本格) 龍鳳',
        'Pizza & Pasta 123'
      ]

      special_names.each do |name|
        restaurant = Restaurant.new(valid_restaurant_params.merge(name: name))
        expect(restaurant).to be_valid, "#{name} should be valid"
      end
    end
  end

  describe 'associations' do
    let(:restaurant) { Restaurant.create!(valid_restaurant_params) }

    it 'userに属する' do
      expect(restaurant.user).to eq user
      expect(restaurant).to respond_to(:user)
    end

    it 'area_tagに属する' do
      expect(restaurant.area_tag).to eq area_tag
      expect(restaurant).to respond_to(:area_tag)
    end

    it 'genre_tagに属する' do
      expect(restaurant.genre_tag).to eq genre_tag
      expect(restaurant).to respond_to(:genre_tag)
    end

    it 'userは複数のrestaurantsを持つ' do
      restaurant1 = Restaurant.create!(valid_restaurant_params)
      restaurant2 = Restaurant.create!(valid_restaurant_params.merge(name: '別のレストラン'))

      expect(user.restaurants).to include(restaurant1, restaurant2)
      expect(user.restaurants.count).to eq 2
    end
  end

  describe 'timestamps' do
    it '適切なタイムスタンプで保存' do
      restaurant = Restaurant.create!(valid_restaurant_params)

      expect(restaurant.created_at).not_to be_nil
      expect(restaurant.updated_at).not_to be_nil
      expect(restaurant.created_at).to be_a(Time)
      expect(restaurant.updated_at).to be_a(Time)
    end

    it '更新時にupdated_atが更新される' do
      restaurant = Restaurant.create!(valid_restaurant_params)
      original_updated_at = restaurant.updated_at

      sleep(0.01)
      restaurant.update!(name: '更新されたレストラン名')

      expect(restaurant.updated_at).to be > original_updated_at
    end
  end
end
