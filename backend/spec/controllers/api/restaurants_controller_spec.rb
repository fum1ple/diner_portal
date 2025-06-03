require 'rails_helper'

describe Api::RestaurantsController, type: :controller do
  let(:user) { User.create!(email: 'test@example.com', name: 'テストユーザー') }
  let(:area_tag) { Tag.create!(name: '新宿', category: 'area') }
  let(:genre_tag) { Tag.create!(name: 'イタリアン', category: 'genre') }
  let(:valid_attributes) do
    { name: 'トキエイツ新宿店', area_tag: area_tag.id, genre_tag: genre_tag.id }
  end
  let(:invalid_attributes) do
    { name: '', area_tag: nil, genre_tag: nil }
  end

  before do
    allow(controller).to receive(:current_user).and_return(user)
  end

  describe 'POST #create' do
    context '正常系' do
      it '店舗を作成し201を返す' do
        expect {
          post :create, params: { restaurant: valid_attributes }
        }.to change(Restaurant, :count).by(1)
        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json['name']).to eq('トキエイツ新宿店')
        expect(json['area_tag']['name']).to eq('新宿')
        expect(json['genre_tag']['name']).to eq('イタリアン')
      end
    end

    context '異常系' do
      it '必須項目不足で422を返す' do
        post :create, params: { restaurant: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json['errors']).to be_present
      end
      it '未認証ユーザーは401を返す' do
        allow(controller).to receive(:current_user).and_return(nil)
        post :create, params: { restaurant: valid_attributes }
        expect(response).to have_http_status(:unauthorized).or have_http_status(:forbidden)
      end
    end
  end
end
