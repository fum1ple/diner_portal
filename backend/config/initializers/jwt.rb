# frozen_string_literal: true

# JWT設定
JWT_SECRET = Rails.application.credentials.jwt_secret_key || ENV['JWT_SECRET_KEY'] || 'your-secret-key'
JWT_EXPIRATION = 15.minutes # アクセストークンの有効期限（15分）
JWT_REFRESH_EXPIRATION = 7.days # リフレッシュトークンの有効期限（7日）
