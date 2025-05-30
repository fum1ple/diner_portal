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
        domain = email.split('@').last.downcase
        if domain != ALLOWED_DOMAIN.downcase
          render json: { error: 'Unauthorized domain' }, status: :unauthorized and return
        end
        
        # ユーザーを作成または取得
        user = find_or_create_user(payload)
        
        # JWTトークンを生成
        token = generate_jwt_token(user)
        
        # 標準化されたレスポンス
        render json: {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            google_id: user.google_id
          },
          token: token
        }, status: :ok
      else
        render json: { error: 'Invalid token or email' }, status: :unauthorized
      end
    rescue Google::Auth::IDTokens::VerificationError => e
      render json: { error: 'Token verification failed', detail: e.message }, status: :unauthorized
    rescue => e
      render json: { error: 'Authentication failed', detail: e.message }, status: :unauthorized
    end
  end
  
  private
  
  # ユーザーを作成または取得
  def find_or_create_user(payload)
    google_id = payload['sub']
    email = payload['email']
    name = payload['name']
    
    user = User.find_by(google_id: google_id)
    
    if user
      # 既存ユーザーの情報を更新
      user.update!(
        email: email,
        name: name
      )
    else
      # 新規ユーザーを作成
      user = User.create!(
        google_id: google_id,
        email: email,
        name: name
      )
    end
    
    user
  end
  
  # JWTトークンを生成
  def generate_jwt_token(user)
    JwtService.generate_user_token(user)
  end
end
