class ApplicationController < ActionController::API
  include JwtAuthenticatable

  # レート制限チェック（本番環境のみ）
  before_action :check_rate_limit, if: :production?

  # セキュリティログ
  before_action :log_security_info
  after_action :log_response_info

  private

  def production?
    Rails.env.production?
  end

  def check_rate_limit
    # Rack::Attackによるレート制限チェック
    # 設定は config/initializers/rack_attack.rb で行う
  end

  def log_security_info
    return unless Rails.env.production?

    Rails.logger.info({
      event: 'api_request',
      ip: request.remote_ip,
      user_agent: request.user_agent,
      path: request.path,
      method: request.method,
      user_id: current_user&.id,
      timestamp: Time.current.iso8601
    }.to_json)
  end

  def log_response_info
    return unless Rails.env.production?

    Rails.logger.info({
      event: 'api_response',
      status: response.status,
      path: request.path,
      method: request.method,
      user_id: current_user&.id,
      timestamp: Time.current.iso8601
    }.to_json)
  end

  # セキュリティエラーハンドリング
  rescue_from JWT::DecodeError, with: :handle_invalid_token
  rescue_from JWT::ExpiredSignature, with: :handle_expired_token
  rescue_from ActiveRecord::RecordNotFound, with: :handle_not_found

  def handle_invalid_token
    render json: {
      error: '無効なトークンです',
      code: 'INVALID_TOKEN'
    }, status: :unauthorized
  end

  def handle_expired_token
    render json: {
      error: 'トークンの有効期限が切れています',
      code: 'TOKEN_EXPIRED'
    }, status: :unauthorized
  end

  def handle_not_found
    render json: {
      error: 'リソースが見つかりません',
      code: 'NOT_FOUND'
    }, status: :not_found
  end

  # 共通の成功レスポンス
  def render_success(data = {}, status: :ok)
    render json: { success: true, **data }, status: status
  end

  # 共通のエラーレスポンス
  def render_error(message, code: nil, status: :bad_request)
    res = { error: message }
    res[:code] = code if code
    render json: res, status: status
  end
end
