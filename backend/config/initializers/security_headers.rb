# frozen_string_literal: true

# セキュリティヘッダーの設定
Rails.application.config.force_ssl = Rails.env.production?

Rails.application.config.middleware.use(Rack::Deflater)

# セキュリティヘッダーをレスポンスに追加
Rails.application.config.middleware.insert_before 0, Rack::Attack if Rails.env.production?

class SecurityHeaders
  def initialize(app)
    @app = app
  end

  def call(env)
    status, headers, response = @app.call(env)

    # セキュリティヘッダーを追加
    headers.merge!(security_headers)

    [status, headers, response]
  end

  private

  def security_headers
    {
      # XSS Protection
      'X-XSS-Protection' => '1; mode=block',

      # Content Type Options - MIMEタイプスニッフィングを防ぐ
      'X-Content-Type-Options' => 'nosniff',

      # Frame Options - クリックジャッキング攻撃を防ぐ
      'X-Frame-Options' => 'DENY',

      # Content Security Policy - XSS攻撃を防ぐ
      'Content-Security-Policy' => content_security_policy,

      # Referrer Policy
      'Referrer-Policy' => 'strict-origin-when-cross-origin',

      # Permissions Policy
      'Permissions-Policy' => permissions_policy,

      # HSTS (本番環境のみ)
      **hsts_header
    }
  end

  def content_security_policy
    if Rails.env.development?
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'"
    else
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self'"
    end
  end

  def permissions_policy
    [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()'
    ].join(', ')
  end

  def hsts_header
    return {} unless Rails.env.production?

    {
      'Strict-Transport-Security' => 'max-age=31536000; includeSubDomains; preload'
    }
  end
end

Rails.application.config.middleware.insert_before 0, SecurityHeaders
