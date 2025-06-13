require 'rails_helper'

RSpec.describe "Api::Reviews", type: :request do
  let!(:user) { FactoryBot.create(:user) }
  let!(:restaurant) { FactoryBot.create(:restaurant) }
  let!(:scene_tag) { FactoryBot.create(:tag, :scene, name: "Dinner Date") }
  let(:valid_headers) { { "Authorization" => "Bearer #{JwtService.encode(user_id: user.id)}" } }
  let(:valid_attributes) do
    {
      review: {
        comment: "Amazing experience!",
        rating: 5,
        scene_tag_ids: [scene_tag.id]
      }
    }
  end
  let(:invalid_attributes) do
    {
      review: {
        comment: "",
        rating: 5
      }
    }
  end

  describe "POST /api/restaurants/:restaurant_id/reviews" do
    context "when authenticated" do
      context "with valid parameters" do
        it "creates a new Review and returns status 201" do
          expect {
            post "/api/restaurants/#{restaurant.id}/reviews", params: valid_attributes, headers: valid_headers
          }.to change(Review, :count).by(1)

          expect(response).to have_http_status(:created)
          json_response = JSON.parse(response.body)
          expect(json_response['comment']).to eq("Amazing experience!")
          expect(json_response['rating']).to eq(5)
          expect(json_response['user']['id']).to eq(user.id)
          expect(json_response['scene_tags']).to be_an(Array)
          expect(json_response['scene_tags'].first['id']).to eq(scene_tag.id)
        end

        it "creates a new Review with multiple scene tags" do
          scene_tag_2 = FactoryBot.create(:tag, :scene, name: "Business Lunch")
          attributes_multiple_tags = valid_attributes.deep_dup
          attributes_multiple_tags[:review][:scene_tag_ids] = [scene_tag.id, scene_tag_2.id]

          expect {
            post "/api/restaurants/#{restaurant.id}/reviews", params: attributes_multiple_tags, headers: valid_headers
          }.to change(Review, :count).by(1)

          expect(response).to have_http_status(:created)
          json_response = JSON.parse(response.body)
          expect(json_response['scene_tags']).to be_an(Array)
          expect(json_response['scene_tags'].length).to eq(2)
          scene_tag_ids = json_response['scene_tags'].map { |tag| tag['id'] }
          expect(scene_tag_ids).to contain_exactly(scene_tag.id, scene_tag_2.id)
        end

        it "creates a new Review without scene_tag_ids" do
          attributes_without_scene_tag = valid_attributes.deep_dup
          attributes_without_scene_tag[:review].delete(:scene_tag_ids)

          expect {
            post "/api/restaurants/#{restaurant.id}/reviews", params: attributes_without_scene_tag, headers: valid_headers
          }.to change(Review, :count).by(1)

          expect(response).to have_http_status(:created)
          json_response = JSON.parse(response.body)
          expect(json_response['comment']).to eq("Amazing experience!")
          expect(json_response['scene_tags']).to eq([])
        end

        context "with image upload" do
          let(:image_file) { fixture_file_upload(Rails.root.join('spec/fixtures/files/test_image.png'), 'image/png') }
          let(:valid_attributes_with_image) do
            {
              review: {
                comment: "Great food and photo!",
                rating: 4,
                image: image_file
              }
            }
          end

          before(:all) do
            fixture_dir = Rails.root.join('spec/fixtures/files')
            FileUtils.mkdir_p(fixture_dir) unless Dir.exist?(fixture_dir)
            File.open(fixture_dir.join('test_image.png'), 'w') { |f| f.write('dummy image data') } unless File.exist?(fixture_dir.join('test_image.png'))
          end


          it "creates a new Review with an image and returns status 201" do
            expect {
              post "/api/restaurants/#{restaurant.id}/reviews", params: valid_attributes_with_image, headers: valid_headers.except('Content-Type') # Let Rack::Test set Content-Type for multipart
            }.to change(Review, :count).by(1)

            expect(response).to have_http_status(:created)
            json_response = JSON.parse(response.body)
            expect(json_response['comment']).to eq("Great food and photo!")
            expect(json_response['image_url']).to start_with("/uploads/reviews/")
            expect(json_response['image_url']).to end_with("_test_image.png")
            path_parts = json_response['image_url'].split('/')
            filename_part = path_parts.last
            expect(filename_part.sub("_test_image.png", "")).not_to be_empty
            expect(Review.last.image_url).to be_present
          end
        end
      end

      context "with invalid parameters" do
        it "does not create a new Review and returns status 422" do
          expect {
            post "/api/restaurants/#{restaurant.id}/reviews", params: invalid_attributes, headers: valid_headers
          }.not_to change(Review, :count)

          expect(response).to have_http_status(:unprocessable_entity)
          json_response = JSON.parse(response.body)
          expect(json_response['errors']).to include("Comment can't be blank")
        end

        it "returns status 422 for invalid rating" do
          attributes_invalid_rating = valid_attributes.deep_dup
          attributes_invalid_rating[:review][:rating] = 6
           expect {
            post "/api/restaurants/#{restaurant.id}/reviews", params: attributes_invalid_rating, headers: valid_headers
          }.not_to change(Review, :count)
          expect(response).to have_http_status(:unprocessable_entity)
          json_response = JSON.parse(response.body)
          expect(json_response['errors']).to include("Rating must be less than or equal to 5")
        end

        it "returns status 422 for invalid scene_tag_ids (not a scene tag)" do
          area_tag = FactoryBot.create(:tag, :area)
          attributes_invalid_scene_tag = valid_attributes.deep_dup
          attributes_invalid_scene_tag[:review][:scene_tag_ids] = [area_tag.id]

          expect {
            post "/api/restaurants/#{restaurant.id}/reviews", params: attributes_invalid_scene_tag, headers: valid_headers
          }.not_to change(Review, :count)

          expect(response).to have_http_status(:unprocessable_entity)
          json_response = JSON.parse(response.body)
          expect(json_response['errors']).to include("Scene tag ids 無効なシーンタグIDです: #{area_tag.id}")
        end
      end

      context "when restaurant does not exist" do
        it "returns status 404" do
          post "/api/restaurants/invalid_id/reviews", params: valid_attributes, headers: valid_headers
          expect(response).to have_http_status(:not_found)
          json_response = JSON.parse(response.body)
          expect(json_response['error']).to eq('店舗が見つかりません')
        end
      end
    end

    context "when not authenticated" do
      it "returns status 401" do
        post "/api/restaurants/#{restaurant.id}/reviews", params: valid_attributes
        expect(response).to have_http_status(:unauthorized)
        json_response = JSON.parse(response.body)
        expect(json_response['error']).to include('認証トークンがありません')
      end
    end
  end
end
