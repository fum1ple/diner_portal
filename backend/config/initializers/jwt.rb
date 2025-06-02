# frozen_string_literal: true

# JWT設定
JWT_SECRET = Rails.application.credentials.jwt_secret_key || ENV['JWT_SECRET_KEY'] || 'your-secret-key'
JWT_EXPIRATION = 15.minutes # アクセストークンの有効期限（15分）
JWT_REFRESH_EXPIRATION = 7.days # リフレッシュトークンの有効期限（7日）

# JWT関連のユーティリティメソッド
class JwtService
  class << self
    # JWTトークンをエンコード
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

    # ユーザー情報からJWTトークンを生成
    def generate_user_token(user)
      payload = {
        user_id: user.id,
        email: user.email,
        name: user.name
      }
      encode(payload)
    end

    # リフレッシュトークンを生成
    def generate_refresh_token(user)
      refresh_token = user.refresh_tokens.create!(
        expires_at: JWT_REFRESH_EXPIRATION.from_now
      )
      refresh_token
    end

    # アクセストークンとリフレッシュトークンのペアを生成
    def generate_token_pair(user)
      access_token = generate_user_token(user)
      refresh_token = generate_refresh_token(user)

      {
        access_token: access_token,
        refresh_token: refresh_token.token,
        expires_in: JWT_EXPIRATION.to_i,
        token_type: 'Bearer'
      }
    end

    # リフレッシュトークンからアクセストークンを更新
    def refresh_access_token(refresh_token_string)
      refresh_token = RefreshToken.find_by(token: refresh_token_string)

      return nil unless refresh_token&.valid_token?

      user = refresh_token.user
      new_access_token = generate_user_token(user)

      {
        access_token: new_access_token,
        expires_in: JWT_EXPIRATION.to_i,
        token_type: 'Bearer'
      }
    end

    # リフレッシュトークンを無効化
    def revoke_refresh_token(refresh_token_string)
      refresh_token = RefreshToken.find_by(token: refresh_token_string)
      refresh_token&.revoke!
    end

    # ユーザーの全リフレッシュトークンを無効化（ログアウト）
    def revoke_all_refresh_tokens(user)
      user.refresh_tokens.valid_tokens.update_all(revoked: true)
    end
  end
end
