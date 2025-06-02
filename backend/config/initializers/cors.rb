# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # 開発環境用のオリジン設定
    if Rails.env.development?
      origins 'http://localhost:3000', 'http://localhost:4000', 'http://127.0.0.1:3000'
    elsif Rails.env.production?
      # 本番環境では実際のドメインを設定
      origins ENV['FRONTEND_URL'] || 'https://your-production-domain.com'
    else
      # テスト環境
      origins '*'
    end

    resource '/api/*',
      headers: %w[Authorization Content-Type Accept],
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: !Rails.env.test?, # テスト環境ではcredentialsをfalseに
      max_age: 600 # プリフライトリクエストのキャッシュ時間（10分）

    # 認証エンドポイントは特別に設定
    resource '/auth/*',
      headers: %w[Authorization Content-Type Accept],
      methods: [:post, :options],
      credentials: !Rails.env.test?, # テスト環境ではcredentialsをfalseに
      max_age: 0 # 認証関連はキャッシュしない
  end
end
