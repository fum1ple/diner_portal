class ReviewSceneTag < ApplicationRecord
  belongs_to :review
  belongs_to :scene_tag, class_name: 'Tag', foreign_key: 'scene_tag_id'

  validates :review_id, presence: true
  validates :scene_tag_id, presence: true
  validates :review_id, uniqueness: { scope: :scene_tag_id }
  
  validate :scene_tag_is_scene_category

  private

  def scene_tag_is_scene_category
    if scene_tag.present? && scene_tag.category != 'scene'
      errors.add(:scene_tag_id, 'シーンタグを選択してください')
    end
  end
end