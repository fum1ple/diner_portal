# frozen_string_literal: true

class JwtService
  class << self
    # JWTトークンをエンコード（低レベルメソッド）
    def encode(payload, expiration = JWT_EXPIRATION)
      # 有効期限を追加
      payload[:exp] = expiration.from_now.to_i
      payload[:iat] = Time.current.to_i # 発行時刻
      payload[:jti] = SecureRandom.uuid # JWT ID

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

    # アクセストークン・リフレッシュトークンのペアを生成
    def generate_token_pair(user)
      access_token = generate_access_token(user)
      refresh_token = generate_refresh_token(user)
      {
        access_token: access_token,
        refresh_token: refresh_token.token,
        expires_in: JWT_EXPIRATION.to_i,
        refresh_expires_in: JWT_REFRESH_EXPIRATION.to_i,
        token_type: 'Bearer'
      }
    end

    def generate_access_token(user)
      payload = {
        sub: user.id,
        user_id: user.id, # 後方互換性のため
        email: user.email,
        name: user.name,
        google_id: user.google_id
      }
      encode(payload, JWT_EXPIRATION)
    end

    # ユーザー情報からJWTトークンを生成（後方互換性のため）
    def generate_user_token(user)
      generate_access_token(user)
    end

    def generate_refresh_token(user)
      token = user.refresh_tokens.create!(
        expires_at: JWT_REFRESH_EXPIRATION.from_now,
        revoked: false
      )
      token
    end

    def refresh_access_token(refresh_token_str)
      token = RefreshToken.find_by(token: refresh_token_str, revoked: false)
      return nil unless token&.valid_token?

      user = token.user
      {
        access_token: generate_access_token(user),
        refresh_token: token.token,
        expires_in: JWT_EXPIRATION.to_i,
        refresh_expires_in: (token.expires_at - Time.current).to_i,
        token_type: 'Bearer'
      }
    end

    def revoke_refresh_token(refresh_token_str)
      token = RefreshToken.find_by(token: refresh_token_str)
      token&.revoke!
    end

    def revoke_all_refresh_tokens(user)
      user.refresh_tokens.update_all(revoked: true)
    end
  end
end
