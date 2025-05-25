# frozen_string_literal: true

class Api::AuthController < ApplicationController
  # Rails APIモードではprotect_from_forgeryは使用しない
  skip_before_action :verify_authenticity_token, raise: false

  require 'googleauth'
  require 'googleauth/id_tokens'

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
        domain = email.split('@').last
        if domain != ALLOWED_DOMAIN
          render json: { error: 'Unauthorized domain' }, status: :unauthorized and return
        end
        # ここで独自のセッション管理やユーザー作成/取得処理を行う
        # 例: user = User.find_or_create_by(email: email)
        render json: { success: true, email: email }, status: :ok
      else
        render json: { error: 'Invalid token or email' }, status: :unauthorized
      end
    rescue Google::Auth::IDTokens::VerificationError => e
      render json: { error: 'Token verification failed', detail: e.message }, status: :unauthorized
    rescue => e
      render json: { error: 'Authentication failed', detail: e.message }, status: :unauthorized
    end
  end
end
