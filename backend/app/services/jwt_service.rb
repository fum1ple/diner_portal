# frozen_string_literal: true

class JwtService
  class << self
    # アクセストークン・リフレッシュトークンのペアを生成
    def generate_token_pair(user)
      access_token = generate_access_token(user)
      refresh_token = generate_refresh_token(user)
      {
        access_token: access_token,
        refresh_token: refresh_token.token,
        expires_in: JWT_EXPIRATION.to_i,
        refresh_expires_in: JWT_REFRESH_EXPIRATION.to_i
      }
    end

    def generate_access_token(user)
      payload = {
        sub: user.id,
        email: user.email,
        name: user.name,
        google_id: user.google_id,
        exp: JWT_EXPIRATION.from_now.to_i
      }
      JWT.encode(payload, JWT_SECRET, 'HS256')
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
        refresh_expires_in: (token.expires_at - Time.current).to_i
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
