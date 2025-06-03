class Restaurant < ApplicationRecord

  belongs_to :user　#登録したユーザーは１人
  belongs_to :area_tag, class_name: 'Tag', foreign_key: 'area_tag'# エリアタグはTagモデルを参照
  belongs_to :genre_tag, class_name: 'Tag', foreign_key: 'genre_tag'# ジャンルタグはTagモデルを参照

  # バリデーション
  validates :name, :user_id, :area_tag, :genre_tag, presence: true

  # タグのカテゴリ整合性チェック（カスタムバリデーション例）
  validate :area_tag_category, :genre_tag_category

  private

  def area_tag_category
    # area_tagが選ばれていて、かつ、そのカテゴリが 'area' じゃなかったらエラー
    if area_tag && area_tag.category != 'area'
      errors.add(:area_tag, 'must be an area tag')
    end
  end

  def genre_tag_category
    # genre_tagが選ばれていて、かつ、そのカテゴリが 'genre' じゃなかったらエラー
    if genre_tag && genre_tag.category != 'genre'
      errors.add(:genre_tag, 'must be a genre tag')
    end
  end
end
