class Review < ApplicationRecord
  belongs_to :user
  belongs_to :restaurant
  belongs_to :scene_tag, class_name: 'Tag', foreign_key: 'scene_tag_id', optional: true

  validates :comment, presence: true, length: { maximum: 1000 }
  validates :rating, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 1, less_than_or_equal_to: 5 }
  validates :user_id, presence: true
  validates :restaurant_id, presence: true
  validate :scene_tag_is_scene_category

  # レビューの作成・更新・削除時に関連するレストランの平均評価を更新
  after_create :update_restaurant_rating
  after_update :update_restaurant_rating
  after_destroy :update_restaurant_rating

  private

  def scene_tag_is_scene_category
    if scene_tag.present? && scene_tag.category != 'scene'
      errors.add(:scene_tag_id, 'シーンタグを選択してください')
    end
  end

  def update_restaurant_rating
    restaurant.update_average_rating
  end
end
