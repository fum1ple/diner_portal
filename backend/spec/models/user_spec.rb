require 'rails_helper'

RSpec.describe User, type: :model do
  let(:valid_user_params) do
    {
      name: '山田太郎',
      email: 'yamada@example.com',
      google_id: '123456789'
    }
  end

  describe 'validations' do
    it '有効な属性で作成できる' do
      user = User.new(valid_user_params)
      expect(user).to be_valid
    end

    it 'emailが必須' do
      user = User.new(valid_user_params.except(:email))
      expect(user).not_to be_valid
      expect(user.errors[:email]).to include("can't be blank")
    end

    it 'nameが必須' do
      user = User.new(valid_user_params.except(:name))
      expect(user).not_to be_valid
      expect(user.errors[:name]).to include("can't be blank")
    end

    it 'emailフォーマットを検証' do
      invalid_emails = ['invalid', 'test@', '@example.com', 'test..test@example.com']

      invalid_emails.each do |invalid_email|
        user = User.new(valid_user_params.merge(email: invalid_email))
        expect(user).not_to be_valid, "#{invalid_email} should be invalid"
        expect(user.errors[:email]).to include('is invalid')
      end
    end

    it 'emailの一意性を検証' do
      User.create!(valid_user_params)
      duplicate_user = User.new(valid_user_params.merge(google_id: '987654321'))
      expect(duplicate_user).not_to be_valid
      expect(duplicate_user.errors[:email]).to include('has already been taken')
    end

    it 'google_idの一意性を検証' do
      User.create!(valid_user_params)
      duplicate_user = User.new(valid_user_params.merge(email: 'different@example.com'))
      expect(duplicate_user).not_to be_valid
      expect(duplicate_user.errors[:google_id]).to include('has already been taken')
    end

    it 'google_idがnilでも有効' do
      user = User.new(valid_user_params.merge(google_id: nil))
      expect(user).to be_valid
    end
  end

  describe 'associations' do
    let(:user) { User.create!(valid_user_params) }

    it 'refresh_tokensとの関連' do
      expect(user).to respond_to(:refresh_tokens)
      expect(user.refresh_tokens).to be_a(ActiveRecord::Associations::CollectionProxy)
    end

    it 'restaurantsとの関連' do
      expect(user).to respond_to(:restaurants)
      expect(user.restaurants).to be_a(ActiveRecord::Associations::CollectionProxy)
    end

    it 'ユーザー削除時にrefresh_tokensも削除' do
      user.refresh_tokens.create!(expires_at: 7.days.from_now)
      expect { user.destroy }.to change(RefreshToken, :count).by(-1)
    end
  end

  describe '.find_or_create_by_google_auth' do
    it '既存ユーザーを見つける' do
      existing_user = User.create!(valid_user_params)
      google_payload = {
        'email' => existing_user.email,
        'sub' => existing_user.google_id,
        'name' => existing_user.name
      }
      found_user = User.find_or_create_by_google_auth(google_payload)
      expect(found_user.id).to eq existing_user.id
    end

    it '新規ユーザーを作成' do
      google_payload = {
        'email' => 'newuser@example.com',
        'sub' => 'new_google_id_123',
        'name' => '新規ユーザー'
      }
      expect {
        User.find_or_create_by_google_auth(google_payload)
      }.to change(User, :count).by(1)
      new_user = User.last
      expect(new_user.email).to eq 'newuser@example.com'
      expect(new_user.google_id).to eq 'new_google_id_123'
      expect(new_user.name).to eq '新規ユーザー'
    end
  end
end
