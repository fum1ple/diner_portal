ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"
require "mocha/minitest"

module ActiveSupport
  class TestCase
    # Run tests in parallel with specified workers
    parallelize(workers: :number_of_processors)

    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    fixtures :all

    # Add more helper methods to be used by all tests here...
  end
end

# ActionDispatch::IntegrationTest の拡張
class ActionDispatch::IntegrationTest
  # APIテスト用のヘルパーメソッド
  def api_headers(additional_headers = {})
    { "Host" => "localhost" }.merge(additional_headers)
  end

  def auth_headers(user)
    token = JwtService.generate_token_pair(user)[:access_token]
    api_headers("Authorization" => "Bearer #{token}")
  end

  # HTTP リクエストメソッドをオーバーライドして、デフォルトでHostヘッダーを追加
  %w[get post put patch delete].each do |method|
    alias_method :"original_#{method}", method.to_sym

    define_method(method) do |path, **args|
      # headers が指定されていない場合は空のハッシュを作成
      args[:headers] ||= {}

      # Host ヘッダーが設定されていない場合のみ追加
      args[:headers] = api_headers(args[:headers]) unless args[:headers].key?("Host")

      send(:"original_#{method}", path, **args)
    end
  end
end
