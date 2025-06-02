# frozen_string_literal: true

# Rack::Attack設定
# 不正アクセス、ブルートフォース攻撃、DDoS攻撃からAPIを保護

class Rack::Attack
  # キャッシュストアの設定（Redisがある場合はRedisを使用）
  if Rails.env.production?
    Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new
  else
    # 開発環境では制限を緩める
    Rack::Attack.enabled = false
  end

  # IPアドレスベースの制限
  # 一般的なAPIリクエスト制限（5分間で300回）
  throttle('api/ip', limit: 300, period: 5.minutes) do |req|
    req.ip if req.path.start_with?('/api/')
  end

  # 認証エンドポイントの制限（1分間で5回）
  throttle('auth/ip', limit: 5, period: 1.minute) do |req|
    req.ip if req.path.start_with?('/auth/')
  end

  # ユーザーベースの制限（認証済みユーザー）
  throttle('api/user', limit: 1000, period: 1.hour) do |req|
    if req.path.start_with?('/api/') && req.env['current_user']
      req.env['current_user'].id
    end
  end

  # 特定のパスをブロック
  blocklist('block_bad_paths') do |req|
    # 悪意のあるパスパターンをブロック
    bad_paths = %w[
      /admin
      /wp-admin
      /phpmyadmin
      /.env
      /config
    ]
    bad_paths.any? { |path| req.path.include?(path) }
  end

  # 疑わしいUser-Agentをブロック
  blocklist('block_bad_user_agents') do |req|
    bad_agents = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i
    ]
    user_agent = req.user_agent.to_s
    bad_agents.any? { |pattern| user_agent.match?(pattern) }
  end

  # 大量のリクエストを送信するIPをブロック（1時間で1000回以上）
  blocklist('block_heavy_traffic') do |req|
    # カウンターを使用して大量リクエストを検知
    count = Rack::Attack.cache.count("heavy_traffic:#{req.ip}", 1.hour)
    count > 1000
  end

  # レスポンスの設定
  self.throttled_responder = lambda do |req|
    match_data = req.env['rack.attack.match_data']
    now = match_data[:epoch_time]

    headers = {
      'Content-Type' => 'application/json',
      'Retry-After' => match_data[:period].to_s,
      'X-RateLimit-Limit' => match_data[:limit].to_s,
      'X-RateLimit-Remaining' => '0',
      'X-RateLimit-Reset' => (now + match_data[:period]).to_s
    }

    [429, headers, [{
      error: 'Rate limit exceeded',
      code: 'RATE_LIMIT_EXCEEDED',
      retry_after: match_data[:period]
    }.to_json]]
  end

  self.blocklisted_responder = lambda do |req|
    [403, { 'Content-Type' => 'application/json' }, [{
      error: 'Forbidden',
      code: 'ACCESS_FORBIDDEN'
    }.to_json]]
  end

  # ログ設定
  ActiveSupport::Notifications.subscribe('rack.attack') do |name, start, finish, request_id, payload|
    req = payload[:request]
    Rails.logger.warn({
      event: 'rack_attack',
      type: name.split('.').last,
      ip: req.ip,
      path: req.path,
      user_agent: req.user_agent,
      timestamp: Time.current.iso8601
    }.to_json)
  end
end
