# frozen_string_literal: true

class RefreshToken < ApplicationRecord
  belongs_to :user

  validates :token, presence: true, uniqueness: true
  validates :jti, presence: true, uniqueness: true
  validates :expires_at, presence: true

  # 不要なスコープやバリデーションを削除（valid_tokens, expired, revokedのみ残す）
  scope :valid_tokens, -> { where(revoked: false).where('expires_at > ?', Time.current) }
  scope :token_valid, -> { where(revoked: false).where('expires_at > ?', Time.current) }
  scope :expired, -> { where('expires_at <= ?', Time.current) }
  scope :revoked, -> { where(revoked: true) }

  before_validation :generate_token, :generate_jti, on: :create

  def expired?
    expires_at <= Time.current
  end

  def revoked?
    revoked
  end

  def valid_token?
    !expired? && !revoked?
  end

  # テスト用エイリアス
  def token_valid?
    valid_token?
  end

  def revoke!
    update!(revoked: true)
  end

  # 期限切れのトークンを削除
  def self.cleanup_expired
    expired.delete_all
  end

  private

  def generate_token
    return if self.token.present? # 既にトークンが設定されている場合はスキップ
    self.token = SecureRandom.hex(32)
    Rails.logger.info "Generated token: #{self.token}"
  end

  def generate_jti
    return if self.jti.present? # 既にJTIが設定されている場合はスキップ
    self.jti = SecureRandom.uuid
    Rails.logger.info "Generated jti: #{self.jti}"
  end
end
