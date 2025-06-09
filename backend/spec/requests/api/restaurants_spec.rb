require 'rails_helper'

RSpec.describe "Api::Restaurants", type: :request do
  let!(:user) { FactoryBot.create(:user) }
  let!(:area_tag) { FactoryBot.create(:tag, :area, name: "Shibuya Area") }
  let!(:genre_tag) { FactoryBot.create(:tag, :genre, name: "Sushi") }
  let!(:scene_tag_for_review) { FactoryBot.create(:tag, :scene, name: "Lunch Special") }

  let(:auth_headers) { { "Authorization" => "Bearer #{JwtService.encode(user_id: user.id)}" } }

  describe "GET /api/restaurants" do
    before do
      FactoryBot.create_list(:restaurant, 3, user: user, area_tag: area_tag, genre_tag: genre_tag)
      # The controller's jwt_authentication_required? for index is true, so auth_headers are needed.
      get "/api/restaurants", headers: auth_headers
    end

    it "returns http success and a list of restaurants" do
      expect(response).to have_http_status(:success)
      json_response = JSON.parse(response.body)
      expect(json_response.length).to eq(3)
    end
  end

  describe "GET /api/restaurants/:id" do
    let!(:restaurant) { FactoryBot.create(:restaurant, user: user, area_tag: area_tag, genre_tag: genre_tag) }

    context "when the restaurant has no reviews" do
      before do
        # Controller's jwt_authentication_required? for show is true
        get "/api/restaurants/#{restaurant.id}", headers: auth_headers
      end

      it "returns the restaurant details with an empty reviews array" do
        expect(response).to have_http_status(:success)
        json_response = JSON.parse(response.body)
        expect(json_response['id']).to eq(restaurant.id)
        expect(json_response['name']).to eq(restaurant.name)
        expect(json_response['reviews']).to be_an(Array).and be_empty
      end
    end

    context "when the restaurant has reviews" do
      let!(:review1) { FactoryBot.create(:review, restaurant: restaurant, user: user, created_at: 1.day.ago) }
      let!(:review2) { FactoryBot.create(:review, :with_scene_tag, scene_tag: scene_tag_for_review, restaurant: restaurant, user: user, created_at: Time.current) }

      before do
        get "/api/restaurants/#{restaurant.id}", headers: auth_headers
      end

      it "returns the restaurant details along with its reviews" do
        expect(response).to have_http_status(:success)
        json_response = JSON.parse(response.body)

        expect(json_response['id']).to eq(restaurant.id)
        expect(json_response['reviews']).to be_an(Array)
        expect(json_response['reviews'].length).to eq(2)
      end

      it "returns reviews ordered by created_at desc (newest first)" do
        json_response = JSON.parse(response.body)
        review_ids_in_response = json_response['reviews'].map { |r| r['id'] }
        expect(review_ids_in_response).to eq([review2.id, review1.id])
      end

      it "includes correct review structure with user and scene_tag" do
        json_response = JSON.parse(response.body)
        first_review_in_response = json_response['reviews'].find { |r| r['id'] == review2.id } # Newest review (review2)

        expect(first_review_in_response['comment']).to eq(review2.comment)
        expect(first_review_in_response['rating']).to eq(review2.rating)

        expect(first_review_in_response['user']).to be_present
        expect(first_review_in_response['user']['id']).to eq(user.id)
        expect(first_review_in_response['user']['name']).to eq(user.name)

        expect(first_review_in_response['scene_tag']).to be_present
        expect(first_review_in_response['scene_tag']['id']).to eq(scene_tag_for_review.id)
        expect(first_review_in_response['scene_tag']['name']).to eq(scene_tag_for_review.name)

        # Check review without scene tag
        second_review_in_response = json_response['reviews'].find { |r| r['id'] == review1.id }
        expect(second_review_in_response['scene_tag']).to be_nil
      end
    end

    context "when restaurant is not found" do
      it "returns status 404" do
        get "/api/restaurants/invalid_id", headers: auth_headers
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "POST /api/restaurants" do
    let(:valid_restaurant_params) do
      {
        restaurant: {
          name: "New Awesome Restaurant",
          area_tag_id: area_tag.id,
          genre_tag_id: genre_tag.id
        }
      }
    end

    context "when authenticated" do
      it "creates a new restaurant" do
        expect {
          post "/api/restaurants", params: valid_restaurant_params, headers: auth_headers
        }.to change(Restaurant, :count).by(1)

        expect(response).to have_http_status(:created)
        json_response = JSON.parse(response.body)
        expect(json_response['name']).to eq("New Awesome Restaurant")
        expect(json_response['user_id']).to eq(user.id) # Ensure it's associated with current_user
      end
    end

    context "when not authenticated" do
      it "returns status 401" do
        post "/api/restaurants", params: valid_restaurant_params # No auth_headers
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
