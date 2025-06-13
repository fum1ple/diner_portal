# frozen_string_literal: true

module AuthHelpers
  # 認証ヘッダーを生成するヘルパーメソッド
  # JWTアクセストークンを使用してAuthorizationヘッダーを作成
  def auth_headers(user)
    token = JwtService.generate_access_token(user)
    { 'Authorization' => "Bearer #{token}" }
  end
end