# frozen_string_literal: true

class Api::AuthController < ApplicationController
  # Rails APIモードではprotect_from_forgeryは使用しない
  skip_before_action :verify_authenticity_token, raise: false

  require 'googleauth'
  require 'googleauth/id_tokens'
  require_relative '../../services/jwt_service'
  require_relative '../../services/auth_service'

  # 許可するGoogle Workspaceドメイン
  ALLOWED_DOMAIN = 'tokium.jp'

  # POST /api/auth/google
  def google
    id_token = params[:id_token]
    email = params[:email]

    begin
      # GoogleAuth gemを使用してIDトークンを検証
      payload = Google::Auth::IDTokens.verify_oidc(id_token, aud: ENV['GOOGLE_CLIENT_ID'])

      if payload && payload['email'] == email
        # ドメインチェック
        domain = email.split('@').last.downcase
        if domain != ALLOWED_DOMAIN.downcase
          render_error('許可されていないドメインです', status: :unauthorized) and return
        end

        # ユーザーを作成または取得
        user = AuthService.find_or_create_user(payload)

        # JWTトークンペアを生成（アクセス + リフレッシュトークン）
        Rails.logger.info "Generating token pair for user: #{user.id}"
        token_pair = JwtService.generate_token_pair(user)
        Rails.logger.info "Token pair generated successfully"

        # 標準化されたレスポンス
        render_success({
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            google_id: user.google_id
          },
          **token_pair
        })
      else
        Rails.logger.error "Invalid token or email condition failed"
        render_error('無効なトークンまたはメールアドレスです', status: :unauthorized)
      end
    rescue Google::Auth::IDTokens::VerificationError => e
      Rails.logger.error "Google token verification error: #{e.message}"
      render_error('トークンの検証に失敗しました', status: :unauthorized, code: 'TOKEN_VERIFICATION_FAILED')
    rescue => e
      Rails.logger.error "Authentication error: #{e.class} - #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      render_error('認証に失敗しました', status: :unauthorized, code: 'AUTH_FAILED')
    end
  end

  # POST /api/auth/refresh
  def refresh
    refresh_token = params[:refresh_token]

    if refresh_token.blank?
      render_error('リフレッシュトークンが必要です', code: 'MISSING_REFRESH_TOKEN', status: :bad_request) and return
    end

    new_tokens = JwtService.refresh_access_token(refresh_token)

    if new_tokens
      render_success(new_tokens)
    else
      render_error('無効または期限切れのリフレッシュトークンです', code: 'INVALID_REFRESH_TOKEN', status: :unauthorized)
    end
  rescue => e
    Rails.logger.error "Refresh token error: #{e.message}"
    render_error('トークンの更新に失敗しました', code: 'REFRESH_FAILED', status: :internal_server_error)
  end

  # POST /api/auth/logout
  def logout
    refresh_token = params[:refresh_token]

    if refresh_token.present?
      RefreshTokenService.revoke(refresh_token)
    end

    # 現在のユーザーの全リフレッシュトークンを無効化（オプション）
    if current_user && params[:revoke_all] == 'true'
      RefreshTokenService.revoke_all(current_user)
    end

    render_success({ message: 'ログアウトしました' })
  rescue => e
    Rails.logger.error "Logout error: #{e.message}"
    render_error('ログアウトに失敗しました', code: 'LOGOUT_FAILED', status: :internal_server_error)
  end

  private

  # JWTトークンを生成
  def generate_jwt_token(user)
    JwtService.generate_access_token(user)
  end
end
