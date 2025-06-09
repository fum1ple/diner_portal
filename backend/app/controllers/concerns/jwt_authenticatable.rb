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
      render_unauthorized('認証トークンがありません')
      return
    end

    begin
      decoded_token = ::JwtService.decode(token)

      unless decoded_token
        render_unauthorized('無効なトークン形式です')
        return
      end

      user_id = decoded_token['user_id']
      @current_user = User.find_by(id: user_id)

      unless @current_user
        render_unauthorized('ユーザーが見つかりません')
        return
      end

    rescue JWT::ExpiredSignature => e
      render_unauthorized('トークンの有効期限が切れています')
    rescue JWT::DecodeError => e
      render_unauthorized('無効なトークン形式です')
    rescue => e
      render_unauthorized("認証エラー: #{e.message}")
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
  def render_unauthorized(message = '認証が必要です')
    error_code = case message
                when /無効なトークン形式です/, /decode error/i
                  'INVALID_TOKEN'
                when /トークンの有効期限が切れています/, /expired/i
                  'TOKEN_EXPIRED'
                when /認証トークンがありません/
                  'MISSING_TOKEN'
                when /ユーザーが見つかりません/
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
