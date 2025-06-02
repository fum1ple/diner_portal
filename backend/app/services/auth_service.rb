# frozen_string_literal: true

class AuthService
  # ユーザー作成・取得ロジック
  def self.find_or_create_user(payload)
    google_id = payload['sub']
    email = payload['email']
    name = payload['name']

    user = User.find_by(google_id: google_id)
    if user
      user.update!(email: email, name: name)
    else
      user = User.create!(google_id: google_id, email: email, name: name)
    end
    user
  end
end
