require 'test_helper'

# Phase 1B 機能統合テスト
class Phase1BIntegrationTest < ActionDispatch::IntegrationTest
  self.use_transactional_tests = true

  def setup
    # 関連するリフレッシュトークンを先に削除
    RefreshToken.delete_all
    User.delete_all
    
    @test_user = User.create!(
      google_id: 'integration_test_google_id',
      email: 'integration@tokium.jp',
      name: 'Integration Test User'
    )
  end

  test "complete Phase 1B workflow" do
    # Step 1: ユーザーが認証APIでJWTトークンを取得する場面をシミュレート
    token = JwtService.generate_user_token(@test_user)
    assert_not_nil token, "JWT token should be generated"
    
    # Step 2: JWTトークンを使って保護されたエンドポイントにアクセス
    get '/api/user/profile', headers: { 'Authorization' => "Bearer #{token}" }
    
    assert_response :success
    response_data = JSON.parse(response.body)
    
    assert response_data['success'], "Response should be successful"
    assert_equal @test_user.id, response_data['user']['id']
    assert_equal @test_user.email, response_data['user']['email']
    assert_equal @test_user.name, response_data['user']['name']
    
    puts "✅ Phase 1B: JWT認証ミドルウェアが正常に動作"
    
    # Step 3: ユーザー情報更新のテスト
    put '/api/user/update', 
        params: { user: { name: 'Updated Integration User' } },
        headers: { 'Authorization' => "Bearer #{token}" }
    
    assert_response :success
    update_response = JSON.parse(response.body)
    
    assert update_response['success'], "Update should be successful"
    assert_equal 'Updated Integration User', update_response['user']['name']
    
    puts "✅ Phase 1B: 保護されたAPIエンドポイントが正常に動作"
    
    # Step 4: 認証なしでのアクセス拒否テスト
    get '/api/user/profile'
    
    assert_response :unauthorized
    error_response = JSON.parse(response.body)
    
    assert_equal 'Missing authorization token', error_response['error']
    
    puts "✅ Phase 1B: 未認証時の適切なエラーレスポンス"
    
    # Step 5: 無効なトークンでのアクセス拒否テスト
    get '/api/user/profile', headers: { 'Authorization' => "Bearer invalid_token" }
    
    assert_response :unauthorized
    invalid_token_response = JSON.parse(response.body)
    
    assert_equal 'Invalid token format', invalid_token_response['error']
    
    puts "✅ Phase 1B: 無効なトークン時の適切なエラーレスポンス"
    
    puts ""
    puts "🎉 Phase 1B 実装完了！"
    puts "   ✅ JWT認証ミドルウェアが動作"
    puts "   ✅ 保護されたAPIエンドポイントが実装"
    puts "   ✅ 適切なエラーハンドリング"
    puts "   ✅ current_userの設定が動作"
  end

  test "should handle malformed authorization header" do
    get '/api/user/profile', headers: { 'Authorization' => "InvalidFormat" }
    
    assert_response :unauthorized
    response_data = JSON.parse(response.body)
    assert_equal 'Invalid token format', response_data['error']
  end

  test "should handle missing user for valid token format" do
    # 存在しないユーザーIDでトークンを生成
    fake_payload = {
      user_id: 999999,
      email: 'nonexistent@tokium.jp',
      name: 'Non Existent User'
    }
    
    fake_token = JwtService.encode(fake_payload)
    
    get '/api/user/profile', headers: { 'Authorization' => "Bearer #{fake_token}" }
    
    assert_response :unauthorized
    response_data = JSON.parse(response.body)
    assert_equal 'User not found', response_data['error']
  end
end
