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

  # find_or_create_by_google_authはAuthServiceに移譲可能。重複を避けるため、Userモデルから削除してAuthServiceに一本化することを推奨。
  # Google認証情報からユーザーを検索または作成
  def self.find_or_create_by_google_auth(google_payload)
    email = google_payload['email']
    google_id = google_payload['sub']
    name = google_payload['name']

    user = find_by(email: email)

    if user
      # 既存ユーザーのgoogle_idを更新（初回Google認証の場合）
      user.update(google_id: google_id) if user.google_id.blank?
      user
    else
      # 新規ユーザー作成
      create!(
        email: email,
        google_id: google_id,
        name: name
      )
    end
  end

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
