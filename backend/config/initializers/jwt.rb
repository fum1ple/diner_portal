# frozen_string_literal: true

# JWT設定
JWT_SECRET = Rails.application.credentials.jwt_secret_key || ENV['JWT_SECRET_KEY'] || 'your-secret-key'
JWT_EXPIRATION = 24.hours # JWTの有効期限（24時間）

# JWT関連のユーティリティメソッド
class JwtService
  class << self
    # JWTトークンをエンコード
    def encode(payload)
      # 有効期限を追加
      payload[:exp] = JWT_EXPIRATION.from_now.to_i
      payload[:iat] = Time.current.to_i # 発行時刻

      JWT.encode(payload, JWT_SECRET, 'HS256')
    end

    # JWTトークンをデコード
    def decode(token)
      decoded = JWT.decode(token, JWT_SECRET, true, { algorithm: 'HS256' })
      decoded[0] # ペイロード部分を返す
    rescue JWT::DecodeError => e
      Rails.logger.error "JWT decode error: #{e.message}"
      nil
    rescue JWT::ExpiredSignature => e
      Rails.logger.error "JWT expired: #{e.message}"
      nil
    end

    # トークンの有効性をチェック
    def valid?(token)
      !!decode(token)
    end

    # ユーザー情報からJWTトークンを生成
    def generate_user_token(user)
      payload = {
        user_id: user.id,
        email: user.email,
        name: user.name
      }
      encode(payload)
    end
  end
end
