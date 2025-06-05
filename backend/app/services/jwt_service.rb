# frozen_string_literal: true

# JWT低レベル操作を担当するサービス
class JwtService
  class << self
    # JWTトークンをエンコード
    def encode(payload, expiration = JWT_EXPIRATION)
      # 必要なクレームを追加
      payload[:exp] = expiration.from_now.to_i
      payload[:iat] = Time.current.to_i
      payload[:jti] = SecureRandom.uuid

      JWT.encode(payload, JWT_SECRET, 'HS256')
    end

    # JWTトークンをデコード
    def decode(token)
      decoded = JWT.decode(token, JWT_SECRET, true, { algorithm: 'HS256' })
      decoded[0] # ペイロード部分を返す
    rescue JWT::ExpiredSignature => e
      Rails.logger.error "JWT expired: #{e.message}"
      raise e
    rescue JWT::DecodeError => e
      Rails.logger.error "JWT decode error: #{e.message}"
      nil
    end

    # トークンの有効性をチェック
    def valid?(token)
      !!decode(token)
    rescue JWT::ExpiredSignature, JWT::DecodeError
      false
    end

    # ユーザー情報からアクセストークンを生成
    def generate_access_token(user)
      payload = {
        sub: user.id,
        user_id: user.id,
        email: user.email,
        name: user.name,
        google_id: user.google_id
      }
      encode(payload, JWT_EXPIRATION)
    end

    # 高レベルAPIメソッド - アクセストークン・リフレッシュトークンのペア生成
    def generate_token_pair(user)
      access_token = generate_access_token(user)
      refresh_token = RefreshTokenService.generate(user)

      {
        access_token: access_token,
        refresh_token: refresh_token.token,
        expires_in: JWT_EXPIRATION.to_i,
        refresh_expires_in: JWT_REFRESH_EXPIRATION.to_i,
        token_type: 'Bearer'
      }
    end

    # リフレッシュトークンからアクセストークンを再生成
    def refresh_access_token(refresh_token_str)
      refresh_token = RefreshTokenService.find_valid(refresh_token_str)
      return nil unless refresh_token

      user = refresh_token.user
      {
        access_token: generate_access_token(user),
        refresh_token: refresh_token.token,
        expires_in: JWT_EXPIRATION.to_i,
        refresh_expires_in: (refresh_token.expires_at - Time.current).to_i,
        token_type: 'Bearer'
      }
    end
  end
end
