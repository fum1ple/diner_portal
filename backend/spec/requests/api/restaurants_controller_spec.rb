require 'rails_helper'

def auth_headers(user)
  token = JwtService.generate_access_token(user)
  { 'Authorization' => "Bearer #{token}" }
end

RSpec.describe 'Api::Restaurants', type: :request do
  let!(:user) { User.create!(google_id: 'google123', email: 'user@example.com', name: 'User') }
  let!(:area_tag) { Tag.create!(name: '東京', category: 'area') }
  let!(:genre_tag) { Tag.create!(name: 'イタリアン', category: 'genre') }
  let(:headers) { auth_headers(user) }

  describe 'POST /api/restaurants' do
    it '有効なデータでレストランを作成できる' do
      params = { restaurant: { name: '新しいレストラン', area_tag_id: area_tag.id, genre_tag_id: genre_tag.id } }
      expect {
        post '/api/restaurants', params: params, headers: headers, as: :json
      }.to change(Restaurant, :count).by(1)
      expect(response).to have_http_status(:created)
      data = JSON.parse(response.body)
      expect(data['name']).to eq '新しいレストラン'
      expect(data['user_id']).to eq user.id
      expect(data['area_tag_id']).to eq area_tag.id
      expect(data['genre_tag_id']).to eq genre_tag.id
      expect(data['area_tag']['name']).to eq '東京'
      expect(data['area_tag']['category']).to eq 'area'
      expect(data['genre_tag']['name']).to eq 'イタリアン'
      expect(data['genre_tag']['category']).to eq 'genre'
    end

    it 'nameが空なら422' do
      params = { restaurant: { name: '', area_tag_id: area_tag.id, genre_tag_id: genre_tag.id } }
      expect {
        post '/api/restaurants', params: params, headers: headers, as: :json
      }.not_to change(Restaurant, :count)
      expect(response).to have_http_status(:unprocessable_entity)
      data = JSON.parse(response.body)
      expect(data['errors']['name']).to include("can't be blank")
    end

    it 'nameが未指定なら422' do
      params = { restaurant: { area_tag_id: area_tag.id, genre_tag_id: genre_tag.id } }
      expect {
        post '/api/restaurants', params: params, headers: headers, as: :json
      }.not_to change(Restaurant, :count)
      expect(response).to have_http_status(:unprocessable_entity)
      data = JSON.parse(response.body)
      expect(data['errors']['name']).to include("can't be blank")
    end

    it 'area_tag_idが未指定なら422' do
      params = { restaurant: { name: 'テストレストラン', genre_tag_id: genre_tag.id } }
      expect {
        post '/api/restaurants', params: params, headers: headers, as: :json
      }.not_to change(Restaurant, :count)
      expect(response).to have_http_status(:unprocessable_entity)
      data = JSON.parse(response.body)
      expect(data['errors']['area_tag']).to include('must exist')
    end

    it 'genre_tag_idが未指定なら422' do
      params = { restaurant: { name: 'テストレストラン', area_tag_id: area_tag.id } }
      expect {
        post '/api/restaurants', params: params, headers: headers, as: :json
      }.not_to change(Restaurant, :count)
      expect(response).to have_http_status(:unprocessable_entity)
      data = JSON.parse(response.body)
      expect(data['errors']['genre_tag']).to include('must exist')
    end

    it 'area_tag_idが存在しないなら422' do
      params = { restaurant: { name: 'テストレストラン', area_tag_id: 99999, genre_tag_id: genre_tag.id } }
      expect {
        post '/api/restaurants', params: params, headers: headers, as: :json
      }.not_to change(Restaurant, :count)
      expect(response).to have_http_status(:unprocessable_entity)
      data = JSON.parse(response.body)
      expect(data['errors']['area_tag']).to include('must exist')
    end

    it 'genre_tag_idが存在しないなら422' do
      params = { restaurant: { name: 'テストレストラン', area_tag_id: area_tag.id, genre_tag_id: 99999 } }
      expect {
        post '/api/restaurants', params: params, headers: headers, as: :json
      }.not_to change(Restaurant, :count)
      expect(response).to have_http_status(:unprocessable_entity)
      data = JSON.parse(response.body)
      expect(data['errors']['genre_tag']).to include('must exist')
    end

    it 'area_tagがareaカテゴリでなければ422' do
      wrong_tag = Tag.create!(name: '間違いタグ', category: 'genre')
      params = { restaurant: { name: 'テストレストラン', area_tag_id: wrong_tag.id, genre_tag_id: genre_tag.id } }
      expect {
        post '/api/restaurants', params: params, headers: headers, as: :json
      }.not_to change(Restaurant, :count)
      expect(response).to have_http_status(:unprocessable_entity)
      data = JSON.parse(response.body)
      expect(data['errors']['area_tag_id']).to include('エリアタグを選択してください')
    end

    it 'genre_tagがgenreカテゴリでなければ422' do
      wrong_tag = Tag.create!(name: '間違いタグ', category: 'area')
      params = { restaurant: { name: 'テストレストラン', area_tag_id: area_tag.id, genre_tag_id: wrong_tag.id } }
      expect {
        post '/api/restaurants', params: params, headers: headers, as: :json
      }.not_to change(Restaurant, :count)
      expect(response).to have_http_status(:unprocessable_entity)
      data = JSON.parse(response.body)
      expect(data['errors']['genre_tag_id']).to include('ジャンルタグを選択してください')
    end

    it '認証なしなら401' do
      params = { restaurant: { name: 'テストレストラン', area_tag_id: area_tag.id, genre_tag_id: genre_tag.id } }
      expect {
        post '/api/restaurants', params: params, as: :json
      }.not_to change(Restaurant, :count)
      expect(response).to have_http_status(:unauthorized)
    end

    it '不正なトークンなら401' do
      params = { restaurant: { name: 'テストレストラン', area_tag_id: area_tag.id, genre_tag_id: genre_tag.id } }
      invalid_headers = { 'Authorization' => 'Bearer invalid_token' }
      expect {
        post '/api/restaurants', params: params, headers: invalid_headers, as: :json
      }.not_to change(Restaurant, :count)
      expect(response).to have_http_status(:unauthorized)
    end

    it 'nameが空文字なら422' do
      params = { restaurant: { name: '', area_tag_id: area_tag.id, genre_tag_id: genre_tag.id } }
      expect {
        post '/api/restaurants', params: params, headers: headers, as: :json
      }.not_to change(Restaurant, :count)
      expect(response).to have_http_status(:unprocessable_entity)
      data = JSON.parse(response.body)
      expect(data['errors']['name']).to include("can't be blank")
    end

    it 'nameが256文字なら422' do
      params = { restaurant: { name: 'a' * 256, area_tag_id: area_tag.id, genre_tag_id: genre_tag.id } }
      expect {
        post '/api/restaurants', params: params, headers: headers, as: :json
      }.not_to change(Restaurant, :count)
      expect(response).to have_http_status(:unprocessable_entity)
      data = JSON.parse(response.body)
      expect(data['errors']['name']).to include('is too long (maximum is 255 characters)')
    end

    it 'nameが255文字なら作成できる' do
      params = { restaurant: { name: 'a' * 255, area_tag_id: area_tag.id, genre_tag_id: genre_tag.id } }
      expect {
        post '/api/restaurants', params: params, headers: headers, as: :json
      }.to change(Restaurant, :count).by(1)
      expect(response).to have_http_status(:created)
    end
  end

  describe 'GET /api/restaurants (search functionality)' do
    # Clear any existing restaurants and create a clean set for search tests
    before do
      Restaurant.destroy_all
      Tag.destroy_all
    end
    
    let!(:area_tag_tokyo) { Tag.create!(name: '東京', category: 'area') }
    let!(:area_tag_osaka) { Tag.create!(name: '大阪', category: 'area') }
    let!(:genre_tag_italian) { Tag.create!(name: 'イタリアン', category: 'genre') }
    let!(:genre_tag_french) { Tag.create!(name: 'フレンチ', category: 'genre') }
    let!(:genre_tag_chinese) { Tag.create!(name: '中華', category: 'genre') }
    
    let!(:italian_tokyo) { Restaurant.create!(name: 'イタリアン東京', user: user, area_tag: area_tag_tokyo, genre_tag: genre_tag_italian) }
    let!(:french_tokyo) { Restaurant.create!(name: 'フレンチ東京', user: user, area_tag: area_tag_tokyo, genre_tag: genre_tag_french) }
    let!(:italian_osaka) { Restaurant.create!(name: 'イタリアン大阪', user: user, area_tag: area_tag_osaka, genre_tag: genre_tag_italian) }
    let!(:chinese_tokyo) { Restaurant.create!(name: '中華料理', user: user, area_tag: area_tag_tokyo, genre_tag: genre_tag_chinese) }

    describe 'name search' do
      it 'returns restaurants matching name search' do
        get '/api/restaurants', params: { name: 'イタリアン' }, headers: headers

        expect(response).to have_http_status(:ok)
        data = JSON.parse(response.body)
        expect(data.length).to eq(2)
        names = data.map { |r| r['name'] }
        expect(names).to contain_exactly('イタリアン東京', 'イタリアン大阪')
      end

      it 'returns restaurants with case insensitive search' do
        # Create a restaurant with ASCII characters to test case insensitivity
        ascii_restaurant = Restaurant.create!(name: 'Pizza Tokyo', user: user, area_tag: area_tag_tokyo, genre_tag: genre_tag_italian)
        
        get '/api/restaurants', params: { name: 'pizza' }, headers: headers

        expect(response).to have_http_status(:ok)
        data = JSON.parse(response.body)
        expect(data.length).to eq(1)
        expect(data[0]['name']).to eq('Pizza Tokyo')
      end

      it 'returns partial match results' do
        get '/api/restaurants', params: { name: '東京' }, headers: headers

        expect(response).to have_http_status(:ok)
        data = JSON.parse(response.body)
        expect(data.length).to eq(2)
        names = data.map { |r| r['name'] }
        expect(names).to contain_exactly('イタリアン東京', 'フレンチ東京')
      end

      it 'returns empty array when no matches found' do
        get '/api/restaurants', params: { name: '存在しない店' }, headers: headers

        expect(response).to have_http_status(:ok)
        data = JSON.parse(response.body)
        expect(data).to eq([])
      end

      it 'returns all restaurants when name is empty string' do
        get '/api/restaurants', params: { name: '' }, headers: headers

        expect(response).to have_http_status(:ok)
        data = JSON.parse(response.body)
        expect(data.length).to eq(4) # All restaurants
        names = data.map { |r| r['name'] }
        expect(names).to contain_exactly('イタリアン東京', 'フレンチ東京', 'イタリアン大阪', '中華料理')
      end

      it 'returns all restaurants when name is only whitespace' do
        get '/api/restaurants', params: { name: '   ' }, headers: headers

        expect(response).to have_http_status(:ok)
        data = JSON.parse(response.body)
        expect(data.length).to eq(4) # All restaurants
        names = data.map { |r| r['name'] }
        expect(names).to contain_exactly('イタリアン東京', 'フレンチ東京', 'イタリアン大阪', '中華料理')
      end

    end

    describe 'area search' do
      it 'returns restaurants in specified area' do
        get '/api/restaurants', params: { area: '東京' }, headers: headers

        expect(response).to have_http_status(:ok)
        data = JSON.parse(response.body)
        expect(data.length).to eq(3)
        names = data.map { |r| r['name'] }
        expect(names).to contain_exactly('イタリアン東京', 'フレンチ東京', '中華料理')
      end

      it 'returns restaurants in different area' do
        get '/api/restaurants', params: { area: '大阪' }, headers: headers

        expect(response).to have_http_status(:ok)
        data = JSON.parse(response.body)
        expect(data.length).to eq(1)
        expect(data[0]['name']).to eq('イタリアン大阪')
      end

      it 'returns empty array for non-existent area' do
        get '/api/restaurants', params: { area: '京都' }, headers: headers

        expect(response).to have_http_status(:ok)
        data = JSON.parse(response.body)
        expect(data).to eq([])
      end

      it 'ignores empty area parameter' do
        get '/api/restaurants', params: { area: '' }, headers: headers

        expect(response).to have_http_status(:ok)
        data = JSON.parse(response.body)
        expect(data.length).to eq(4) # All restaurants
      end

      it 'ignores whitespace-only area parameter' do
        get '/api/restaurants', params: { area: '   ' }, headers: headers

        expect(response).to have_http_status(:ok)
        data = JSON.parse(response.body)
        expect(data.length).to eq(4) # All restaurants
      end
    end

    describe 'genre search' do
      it 'returns restaurants of specified genre' do
        get '/api/restaurants', params: { genre: 'イタリアン' }, headers: headers

        expect(response).to have_http_status(:ok)
        data = JSON.parse(response.body)
        expect(data.length).to eq(2)
        names = data.map { |r| r['name'] }
        expect(names).to contain_exactly('イタリアン東京', 'イタリアン大阪')
      end

      it 'returns restaurants of different genre' do
        get '/api/restaurants', params: { genre: 'フレンチ' }, headers: headers

        expect(response).to have_http_status(:ok)
        data = JSON.parse(response.body)
        expect(data.length).to eq(1)
        expect(data[0]['name']).to eq('フレンチ東京')
      end

      it 'returns empty array for non-existent genre' do
        get '/api/restaurants', params: { genre: '和食' }, headers: headers

        expect(response).to have_http_status(:ok)
        data = JSON.parse(response.body)
        expect(data).to eq([])
      end

      it 'ignores empty genre parameter' do
        get '/api/restaurants', params: { genre: '' }, headers: headers

        expect(response).to have_http_status(:ok)
        data = JSON.parse(response.body)
        expect(data.length).to eq(4) # All restaurants
      end

      it 'ignores whitespace-only genre parameter' do
        get '/api/restaurants', params: { genre: '   ' }, headers: headers

        expect(response).to have_http_status(:ok)
        data = JSON.parse(response.body)
        expect(data.length).to eq(4) # All restaurants
      end
    end

    describe 'combined search' do
      it 'returns restaurants matching both name and area' do
        get '/api/restaurants', params: { name: 'イタリアン', area: '東京' }, headers: headers

        expect(response).to have_http_status(:ok)
        data = JSON.parse(response.body)
        expect(data.length).to eq(1)
        expect(data[0]['name']).to eq('イタリアン東京')
      end

      it 'returns restaurants matching both name and genre' do
        get '/api/restaurants', params: { name: 'イタリアン', genre: 'イタリアン' }, headers: headers

        expect(response).to have_http_status(:ok)
        data = JSON.parse(response.body)
        expect(data.length).to eq(2)
        names = data.map { |r| r['name'] }
        expect(names).to contain_exactly('イタリアン東京', 'イタリアン大阪')
      end

      it 'returns restaurants matching both area and genre' do
        get '/api/restaurants', params: { area: '東京', genre: 'イタリアン' }, headers: headers

        expect(response).to have_http_status(:ok)
        data = JSON.parse(response.body)
        expect(data.length).to eq(1)
        expect(data[0]['name']).to eq('イタリアン東京')
      end

      it 'returns restaurants matching all three parameters' do
        get '/api/restaurants', params: { name: 'イタリアン東京', area: '東京', genre: 'イタリアン' }, headers: headers

        expect(response).to have_http_status(:ok)
        data = JSON.parse(response.body)
        expect(data.length).to eq(1)
        expect(data[0]['name']).to eq('イタリアン東京')
      end

      it 'returns empty array when no restaurants match all criteria' do
        get '/api/restaurants', params: { name: 'イタリアン', area: '大阪', genre: 'フレンチ' }, headers: headers

        expect(response).to have_http_status(:ok)
        data = JSON.parse(response.body)
        expect(data).to eq([])
      end
    end

    describe 'without search parameters' do
      it 'returns all restaurants when no search params provided' do
        get '/api/restaurants', headers: headers

        expect(response).to have_http_status(:ok)
        data = JSON.parse(response.body)
        expect(data.length).to eq(4)
        names = data.map { |r| r['name'] }
        expect(names).to contain_exactly('イタリアン東京', 'フレンチ東京', 'イタリアン大阪', '中華料理')
      end
    end

    describe 'authentication' do
      it 'requires authentication for search' do
        get '/api/restaurants', params: { name: 'イタリアン' }
        expect(response).to have_http_status(:unauthorized)
      end

      it 'rejects invalid token for search' do
        invalid_headers = { 'Authorization' => 'Bearer invalid_token' }
        get '/api/restaurants', params: { name: 'イタリアン' }, headers: invalid_headers
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
