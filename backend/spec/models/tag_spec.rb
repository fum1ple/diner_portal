require 'rails_helper'

RSpec.describe Tag, type: :model do
  describe 'validations' do
    it '有効な属性で作成できる' do
      tag = Tag.new(name: '東京', category: 'area')
      expect(tag).to be_valid
    end

    it 'nameが必須' do
      tag = Tag.new(category: 'area')
      expect(tag).not_to be_valid
      expect(tag.errors[:name]).to include("can't be blank")
    end

    it 'categoryが必須' do
      tag = Tag.new(name: '東京')
      expect(tag).not_to be_valid
      expect(tag.errors[:category]).to include("can't be blank")
    end

    it 'categoryの値を検証' do
      tag = Tag.new(name: 'テスト', category: 'invalid')
      expect(tag).not_to be_valid
      expect(tag.errors[:category]).to include('is not included in the list')
    end

    it 'areaカテゴリを受け入れる' do
      tag = Tag.new(name: '東京', category: 'area')
      expect(tag).to be_valid
    end

    it 'genreカテゴリを受け入れる' do
      tag = Tag.new(name: 'イタリアン', category: 'genre')
      expect(tag).to be_valid
    end

    it 'nameの長さを検証' do
      tag = Tag.new(name: 'a' * 256, category: 'area')
      expect(tag).not_to be_valid
      expect(tag.errors[:name]).to include('is too long (maximum is 255 characters)')
    end
  end

  describe 'scopes' do
    let!(:area_tag) { Tag.create!(name: '東京', category: 'area') }
    let!(:genre_tag) { Tag.create!(name: 'イタリアン', category: 'genre') }

    it 'area_tagsスコープはareaタグのみ返す' do
      area_tags = Tag.area_tags
      expect(area_tags).to include(area_tag)
      expect(area_tags).not_to include(genre_tag)
    end

    it 'genre_tagsスコープはgenreタグのみ返す' do
      genre_tags = Tag.genre_tags
      expect(genre_tags).to include(genre_tag)
      expect(genre_tags).not_to include(area_tag)
    end
  end
end
