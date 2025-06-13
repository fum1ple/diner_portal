# frozen_string_literal: true

class AuthService
  # Google認証情報からユーザーを検索または作成
  # User.find_or_create_by_google_authから移行した統一ロジック
  def self.find_or_create_user(payload)
    email = payload['email']
    google_id = payload['sub']
    name = payload['name']

    user = User.find_by(email: email)

    if user
      # 既存ユーザーのgoogle_idを更新（初回Google認証の場合）
      user.update(google_id: google_id) if user.google_id.blank?
      user
    else
      # 新規ユーザー作成
      User.create!(
        email: email,
        google_id: google_id,
        name: name
      )
    end
  end
end
