# frozen_string_literal: true

# リフレッシュトークンの管理を担当するサービス
class RefreshTokenService
  class << self
    # リフレッシュトークンを生成
    def generate(user)
      user.refresh_tokens.create!(
        expires_at: JWT_REFRESH_EXPIRATION.from_now,
        revoked: false
      )
    end

    # 有効なリフレッシュトークンを検索
    def find_valid(token_str)
      RefreshToken.find_by(token: token_str, revoked: false)&.tap do |token|
        return nil unless token.valid_token?
      end
    end

    # リフレッシュトークンを無効化
    def revoke(token_str)
      token = RefreshToken.find_by(token: token_str)
      token&.revoke!
    end

    # ユーザーの全リフレッシュトークンを無効化
    def revoke_all(user)
      user.refresh_tokens.update_all(revoked: true)
    end

    # 期限切れのリフレッシュトークンをクリーンアップ
    def cleanup_expired
      RefreshToken.cleanup_expired
    end

    # リフレッシュトークンの統計情報を取得
    def statistics
      {
        total: RefreshToken.count,
        valid: RefreshToken.valid_tokens.count,
        expired: RefreshToken.expired.count,
        revoked: RefreshToken.revoked.count
      }
    end
  end
end
