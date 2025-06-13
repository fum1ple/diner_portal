require 'rails_helper'

RSpec.describe AuthService, type: :service do
  describe '.find_or_create_user' do
    let(:google_payload) do
      {
        'email' => 'test@example.com',
        'sub' => 'google_id_123',
        'name' => 'テストユーザー'
      }
    end

    context '既存ユーザーが存在する場合' do
      let!(:existing_user) do
        User.create!(
          email: 'test@example.com',
          name: '既存ユーザー',
          google_id: nil
        )
      end

      it '既存ユーザーを返す' do
        user = AuthService.find_or_create_user(google_payload)
        expect(user.id).to eq existing_user.id
      end

      it 'google_idが空の場合は更新する' do
        expect {
          AuthService.find_or_create_user(google_payload)
        }.to change { existing_user.reload.google_id }.from(nil).to('google_id_123')
      end

      it 'google_idが既に設定されている場合は更新しない' do
        existing_user.update!(google_id: 'existing_google_id')
        
        expect {
          AuthService.find_or_create_user(google_payload)
        }.not_to change { existing_user.reload.google_id }
      end
    end

    context '新規ユーザーの場合' do
      it '新しいユーザーを作成する' do
        expect {
          AuthService.find_or_create_user(google_payload)
        }.to change(User, :count).by(1)
      end

      it '正しい属性でユーザーを作成する' do
        user = AuthService.find_or_create_user(google_payload)
        expect(user.email).to eq 'test@example.com'
        expect(user.google_id).to eq 'google_id_123'
        expect(user.name).to eq 'テストユーザー'
      end
    end
  end
end