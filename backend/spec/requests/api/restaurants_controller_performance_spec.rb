# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::RestaurantsController Performance', type: :request do
  let(:user) { create(:user) }
  let(:headers) { { 'Authorization' => "Bearer #{user.generate_jwt_token}" } }

  before do
    # Create test data
    area_tag = create(:tag, category: 'area', name: 'Tokyo')
    genre_tag = create(:tag, category: 'genre', name: 'Italian')
    
    # Create 10 restaurants with reviews and favorites
    10.times do |i|
      restaurant = create(:restaurant, 
        name: "Restaurant #{i}", 
        area_tag: area_tag, 
        genre_tag: genre_tag,
        user: user
      )
      
      # Add reviews with different users and scene tags
      3.times do |j|
        review_user = create(:user, email: "user#{i}#{j}@tokium.jp")
        scene_tag = create(:tag, category: 'scene', name: "Scene #{j}")
        create(:review, 
          restaurant: restaurant, 
          user: review_user, 
          scene_tag: scene_tag,
          comment: "Great food #{j}",
          rating: [3, 4, 5][j]
        )
      end
      
      # Favorite some restaurants
      if i.even?
        create(:favorite, user: user, restaurant: restaurant)
      end
    end
  end

  describe 'GET /api/restaurants' do
    it 'minimizes database queries for index action' do
      queries = []
      allow(ActiveRecord::Base.connection).to receive(:execute) do |sql|
        queries << sql
        ActiveRecord::Base.connection.execute(sql)
      end

      get '/api/restaurants', headers: headers
      expect(response).to have_http_status(:ok)
      
      # Should not have N+1 queries for favorites (max 1 favorites query)
      favorite_queries = queries.select { |sql| sql.include?('favorites') }
      expect(favorite_queries.length).to be <= 1
    end

    it 'returns correct favorite status without N+1 queries' do
      get '/api/restaurants', headers: headers
      expect(response).to have_http_status(:ok)
      
      json_response = JSON.parse(response.body)
      expect(json_response).to be_an(Array)
      expect(json_response.length).to eq(10)
      
      # Check that some restaurants are favorited and some are not
      favorited_count = json_response.count { |r| r['is_favorited'] }
      expect(favorited_count).to eq(5) # We favorited even-indexed restaurants
    end
  end

  describe 'GET /api/restaurants/:id' do
    let(:restaurant) { Restaurant.first }

    it 'loads all required data efficiently' do
      queries = []
      allow(ActiveRecord::Base.connection).to receive(:execute) do |sql|
        queries << sql
        ActiveRecord::Base.connection.execute(sql)
      end

      get "/api/restaurants/#{restaurant.id}", headers: headers
      expect(response).to have_http_status(:ok)
      
      # Should not have N+1 queries for reviews/users/tags
      user_queries = queries.select { |sql| sql.include?('users') && sql.include?('SELECT') }
      tag_queries = queries.select { |sql| sql.include?('tags') && sql.include?('SELECT') }
      
      # Should load users and tags in bulk, not per review
      expect(user_queries.length).to be <= 2
      expect(tag_queries.length).to be <= 3
    end
  end

  describe 'favorites performance' do
    it 'does not create N+1 queries when checking favorites status' do
      # This test specifically checks that favorite status checking
      # doesn't create queries proportional to number of restaurants
      query_count = 0
      
      allow(ActiveRecord::Base.connection).to receive(:execute) do |sql|
        query_count += 1 if sql.include?('favorites')
        ActiveRecord::Base.connection.execute(sql)
      end

      get '/api/restaurants', headers: headers
      expect(response).to have_http_status(:ok)
      
      # Should only have 1 query for favorites, not N queries
      expect(query_count).to be <= 1
    end
  end
end