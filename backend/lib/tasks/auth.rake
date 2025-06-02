# frozen_string_literal: true

namespace :auth do
  desc "Clean up expired refresh tokens"
  task cleanup_tokens: :environment do
    puts "Starting refresh token cleanup..."

    expired_count = RefreshToken.expired.count
    RefreshToken.cleanup_expired

    puts "Cleaned up #{expired_count} expired refresh tokens"
  end

  desc "Revoke all refresh tokens for a user (usage: rake auth:revoke_user_tokens[user_id])"
  task :revoke_user_tokens, [:user_id] => :environment do |task, args|
    user_id = args[:user_id]

    if user_id.blank?
      puts "Error: user_id is required"
      exit 1
    end

    user = User.find_by(id: user_id)

    if user.nil?
      puts "Error: User with ID #{user_id} not found"
      exit 1
    end

    token_count = user.refresh_tokens.token_valid.count
    JwtService.revoke_all_refresh_tokens(user)

    puts "Revoked #{token_count} refresh tokens for user #{user.email}"
  end

  desc "Show refresh token statistics"
  task stats: :environment do
    total = RefreshToken.count
    valid = RefreshToken.token_valid.count
    expired = RefreshToken.expired.count
    revoked = RefreshToken.revoked.count

    puts "Refresh Token Statistics:"
    puts "  Total: #{total}"
    puts "  Valid: #{valid}"
    puts "  Expired: #{expired}"
    puts "  Revoked: #{revoked}"
  end
end
