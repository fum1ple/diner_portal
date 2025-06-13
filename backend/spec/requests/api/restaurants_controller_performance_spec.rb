# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::RestaurantsController パフォーマンス', type: :request do
  let(:user) { create(:user) }
  let(:headers) { { 'Authorization' => "Bearer #{user.generate_jwt_token}" } }

  before do
    # テストデータ作成
    area_tag = create(:tag, category: 'area', name: 'Tokyo')
    genre_tag = create(:tag, category: 'genre', name: 'Italian')
    
    # レビューとお気に入りを持つ10件のレストランを作成
    10.times do |i|
      restaurant = create(:restaurant, 
        name: "Restaurant #{i}", 
        area_tag: area_tag, 
        genre_tag: genre_tag,
        user: user
      )
      
      # 異なるユーザーとシーンタグでレビューを追加
      3.times do |j|
        review_user = create(:user, email: "user#{i}#{j}@tokium.jp")
        scene_tag = create(:tag, category: 'scene', name: "Scene #{j}")
        review = create(:review, 
          restaurant: restaurant, 
          user: review_user, 
          comment: "Great food #{j}",
          rating: [3, 4, 5][j]
        )
        review.scene_tags << scene_tag
      end
      
      # 偶数番目のレストランをお気に入りに追加
      if i.even?
        create(:favorite, user: user, restaurant: restaurant)
      end
    end
  end

  describe 'GET /api/restaurants' do
    it 'indexアクションでデータベースクエリを最小化する' do
      queries = []
      allow(ActiveRecord::Base.connection).to receive(:execute) do |sql|
        queries << sql
        ActiveRecord::Base.connection.execute(sql)
      end

      get '/api/restaurants', headers: headers
      expect(response).to have_http_status(:ok)
      
      # お気に入りに関するN+1クエリが発生しないこと（最大1つのお気に入りクエリ）
      favorite_queries = queries.select { |sql| sql.include?('favorites') }
      expect(favorite_queries.length).to be <= 1
    end

    it 'N+1クエリなしで正しいお気に入り状態を返す' do
      get '/api/restaurants', headers: headers
      expect(response).to have_http_status(:ok)
      
      json_response = JSON.parse(response.body)
      expect(json_response).to be_an(Array)
      expect(json_response.length).to eq(10)
      
      # 一部のレストランがお気に入りされ、一部がそうでないことを確認
      favorited_count = json_response.count { |r| r['is_favorited'] }
      expect(favorited_count).to eq(5) # 偶数番目のレストランをお気に入りに追加済み
    end
  end

  describe 'GET /api/restaurants/:id' do
    let(:restaurant) { Restaurant.first }

    it '必要なデータを効率的に読み込む' do
      queries = []
      allow(ActiveRecord::Base.connection).to receive(:execute) do |sql|
        queries << sql
        ActiveRecord::Base.connection.execute(sql)
      end

      get "/api/restaurants/#{restaurant.id}", headers: headers
      expect(response).to have_http_status(:ok)
      
      # レビュー/ユーザー/タグに関するN+1クエリが発生しないこと
      user_queries = queries.select { |sql| sql.include?('users') && sql.include?('SELECT') }
      tag_queries = queries.select { |sql| sql.include?('tags') && sql.include?('SELECT') }
      
      # ユーザーとタグはレビューごとではなく一括で読み込むこと
      expect(user_queries.length).to be <= 2
      expect(tag_queries.length).to be <= 3
    end
  end

  describe 'お気に入りのパフォーマンス' do
    it 'お気に入り状態チェック時にN+1クエリを作成しない' do
      # このテストは、お気に入り状態チェックがレストラン数に
      # 比例したクエリを作成しないことを特別に確認する
      query_count = 0
      
      allow(ActiveRecord::Base.connection).to receive(:execute) do |sql|
        query_count += 1 if sql.include?('favorites')
        ActiveRecord::Base.connection.execute(sql)
      end

      get '/api/restaurants', headers: headers
      expect(response).to have_http_status(:ok)
      
      # お気に入りに関するクエリは1つだけであること（Nクエリではない）
      expect(query_count).to be <= 1
    end
  end
end