# frozen_string_literal: true

class User < ApplicationRecord
  # 関連
  has_many :refresh_tokens, dependent: :destroy
  has_many :restaurants
  has_many :favorites, dependent: :destroy
  has_many :favorite_restaurants, through: :favorites, source: :restaurant

  # バリデーション
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validate :email_format_check
  validates :name, presence: true
  validates :google_id, uniqueness: true, allow_nil: true


  # JWTトークンを生成
  def generate_jwt_token
    JwtService.generate_access_token(self)
  end

  private

  def email_format_check
    return unless email.present?

    # 連続したドットをチェック
    if email.include?('..')
      errors.add(:email, 'is invalid')
    end
  end
end
