require "test_helper"

class UserTest < ActiveSupport::TestCase
  def setup
    @valid_user_params = {
      name: "山田太郎",
      email: "yamada@example.com",
      google_id: "123456789"
    }
  end

  test "should be valid with valid attributes" do
    user = User.new(@valid_user_params)
    assert user.valid?
  end

  test "should require email" do
    user = User.new(@valid_user_params.except(:email))
    assert_not user.valid?
    assert_includes user.errors[:email], "can't be blank"
  end

  test "should require name" do
    user = User.new(@valid_user_params.except(:name))
    assert_not user.valid?
    assert_includes user.errors[:name], "can't be blank"
  end

  test "should validate email format" do
    invalid_emails = ["invalid", "test@", "@example.com", "test..test@example.com"]

    invalid_emails.each do |invalid_email|
      user = User.new(@valid_user_params.merge(email: invalid_email))
      assert_not user.valid?, "#{invalid_email} should be invalid"
      assert_includes user.errors[:email], "is invalid"
    end
  end

  test "should validate email uniqueness" do
    # 最初のユーザーを作成
    User.create!(@valid_user_params)

    # 同じemailで2番目のユーザーを作成試行
    duplicate_user = User.new(@valid_user_params.merge(google_id: "987654321"))
    assert_not duplicate_user.valid?
    assert_includes duplicate_user.errors[:email], "has already been taken"
  end

  test "should validate google_id uniqueness" do
    # 最初のユーザーを作成
    User.create!(@valid_user_params)

    # 同じgoogle_idで2番目のユーザーを作成試行
    duplicate_user = User.new(@valid_user_params.merge(email: "different@example.com"))
    assert_not duplicate_user.valid?
    assert_includes duplicate_user.errors[:google_id], "has already been taken"
  end

  test "should allow nil google_id" do
    user = User.new(@valid_user_params.merge(google_id: nil))
    assert user.valid?
  end

  test "should have many refresh_tokens" do
    user = User.create!(@valid_user_params)
    assert_respond_to user, :refresh_tokens
    assert_kind_of ActiveRecord::Associations::CollectionProxy, user.refresh_tokens
  end

  test "should have many restaurants" do
    user = User.create!(@valid_user_params)
    assert_respond_to user, :restaurants
    assert_kind_of ActiveRecord::Associations::CollectionProxy, user.restaurants
  end

  test "should destroy associated refresh_tokens when user is destroyed" do
    user = User.create!(@valid_user_params)
    user.refresh_tokens.create!(expires_at: 7.days.from_now)

    assert_difference("RefreshToken.count", -1) do
      user.destroy
    end
  end

  test "find_or_create_by_google_auth should find existing user" do
    existing_user = User.create!(@valid_user_params)

    google_payload = {
      'email' => existing_user.email,
      'sub' => existing_user.google_id,
      'name' => existing_user.name
    }

    found_user = User.find_or_create_by_google_auth(google_payload)
    assert_equal existing_user.id, found_user.id
  end

  test "find_or_create_by_google_auth should create new user" do
    google_payload = {
      'email' => 'newuser@example.com',
      'sub' => 'new_google_id_123',
      'name' => '新規ユーザー'
    }

    assert_difference("User.count", 1) do
      User.find_or_create_by_google_auth(google_payload)
    end

    new_user = User.last
    assert_equal 'newuser@example.com', new_user.email
    assert_equal 'new_google_id_123', new_user.google_id
    assert_equal '新規ユーザー', new_user.name
  end
end
