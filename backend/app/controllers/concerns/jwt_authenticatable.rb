# frozen_string_literal: true

module JwtAuthenticatable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_jwt_token, if: :jwt_authentication_required?
    attr_reader :current_user
  end

  private

  # JWT認証が必要かどうかを判定
  def jwt_authentication_required?
    # デフォルトでは認証不要、各コントローラーでオーバーライド
    false
  end

  # Authorizationヘッダーからトークンを取得し、検証
  def authenticate_jwt_token
    token = extract_token_from_header

    unless token
      render_unauthorized('Missing authorization token')
      return
    end

    begin
      decoded_token = ::JwtService.decode(token)

      user_id = decoded_token['user_id']
      @current_user = User.find_by(id: user_id)

      unless @current_user
        render_unauthorized('User not found')
        return
      end

    rescue JWT::ExpiredSignature => e
      render_unauthorized('Token expired')
    rescue JWT::DecodeError => e
      render_unauthorized('Invalid token format')
    rescue => e
      render_unauthorized("Authentication error: #{e.message}")
    end
  end

  # Authorizationヘッダーからトークンを抽出
  def extract_token_from_header
    auth_header = request.headers['Authorization']
    return nil unless auth_header

    # "Bearer <token>" 形式からトークンを抽出
    token = auth_header.split(' ').last
    token unless token.blank?
  end

  # 認証エラーレスポンス
  def render_unauthorized(message = 'Unauthorized')
    error_code = case message
                when /Invalid token format/, /decode error/i
                  'INVALID_TOKEN'
                when /Token expired/, /expired/i
                  'TOKEN_EXPIRED'
                when /Missing authorization token/
                  'MISSING_TOKEN'
                when /User not found/
                  'USER_NOT_FOUND'
                else
                  'UNAUTHORIZED'
                end

    render json: {
      error: message,
      code: error_code
    }, status: :unauthorized
  end

  # 現在のユーザーを取得（nilの場合もある）
  def current_user
    @current_user
  end

  # 認証済みかどうかをチェック
  def authenticated?
    current_user.present?
  end

  # 認証を必須にする（コントローラーで使用）
  def require_authentication!
    render_unauthorized unless authenticated?
  end
end
