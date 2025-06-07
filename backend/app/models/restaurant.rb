class Restaurant < ApplicationRecord
  belongs_to :user # 登録したユーザーは１人
  belongs_to :area_tag, class_name: 'Tag', foreign_key: 'area_tag_id' # エリアタグはTagモデルを参照
  belongs_to :genre_tag, class_name: 'Tag', foreign_key: 'genre_tag_id' # ジャンルタグはTagモデルを参照

  has_many :reviews, dependent: :destroy # レストランは複数のレビューを持つことができる

  # バリデーション
  validates :name, presence: true, length: { maximum: 255 }
  validates :user_id, :area_tag_id, :genre_tag_id, presence: true

  # タグのカテゴリ整合性チェック（カスタムバリデーション）
  validate :area_tag_category, :genre_tag_category

  private

  def area_tag_category
    # area_tagが選ばれていて、かつ、そのカテゴリが 'area' じゃなかったらエラー
    if area_tag && area_tag.category != 'area'
      errors.add(:area_tag_id, 'must be an area tag')
    end
  end

  def genre_tag_category
    # genre_tagが選ばれていて、かつ、そのカテゴリが 'genre' じゃなかったらエラー
    if genre_tag && genre_tag.category != 'genre'
      errors.add(:genre_tag_id, 'must be a genre tag')
    end
  end
end
