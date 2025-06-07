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
      tag = FactoryBot.build(:tag, category: 'area')
      expect(tag).to be_valid
    end

    it 'genreカテゴリを受け入れる' do
      tag = FactoryBot.build(:tag, category: 'genre')
      expect(tag).to be_valid
    end

    it 'sceneカテゴリを受け入れる' do
      tag = FactoryBot.build(:tag, category: 'scene')
      expect(tag).to be_valid
    end

    it 'nameの長さを検証' do
      tag = Tag.new(name: 'a' * 256, category: 'area')
      expect(tag).not_to be_valid
      expect(tag.errors[:name]).to include('is too long (maximum is 255 characters)')
    end
  end

  describe 'scopes' do
    let!(:area_tag) { FactoryBot.create(:tag, category: 'area', name: 'Shibuya') }
    let!(:genre_tag) { FactoryBot.create(:tag, category: 'genre', name: 'Ramen') }
    let!(:scene_tag) { FactoryBot.create(:tag, category: 'scene', name: 'Date Night') }

    it 'areasスコープはareaタグのみ返す' do # Changed from area_tags to areas to match model scope
      area_tags_scope = Tag.areas
      expect(area_tags_scope).to include(area_tag)
      expect(area_tags_scope).not_to include(genre_tag)
      expect(area_tags_scope).not_to include(scene_tag)
    end

    it 'genresスコープはgenreタグのみ返す' do # Changed from genre_tags to genres
      genre_tags_scope = Tag.genres
      expect(genre_tags_scope).to include(genre_tag)
      expect(genre_tags_scope).not_to include(area_tag)
      expect(genre_tags_scope).not_to include(scene_tag)
    end

    it 'scenesスコープはsceneタグのみ返す' do
      scene_tags_scope = Tag.scenes
      expect(scene_tags_scope).to include(scene_tag)
      expect(scene_tags_scope).not_to include(area_tag)
      expect(scene_tags_scope).not_to include(genre_tag)
    end
  end
end
