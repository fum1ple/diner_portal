class Review < ApplicationRecord
  belongs_to :user
  belongs_to :restaurant
  
  # 複数のシーンタグとの多対多関係
  has_many :review_scene_tags, dependent: :destroy
  has_many :scene_tags, through: :review_scene_tags, source: :scene_tag

  validates :comment, presence: true, length: { maximum: 1000 }
  validates :rating, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 1, less_than_or_equal_to: 5 }
  validates :user_id, presence: true
  validates :restaurant_id, presence: true

  # レビューの作成・更新・削除時に関連するレストランの平均評価を更新
  after_create :update_restaurant_rating
  after_update :update_restaurant_rating
  after_destroy :update_restaurant_rating

  private

  def update_restaurant_rating
    restaurant.update_average_rating
  end
end
