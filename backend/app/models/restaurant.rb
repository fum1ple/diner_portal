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

  # 平均評価を計算して更新するメソッド
  def update_average_rating
    if reviews.any?
      self.average_rating = reviews.average(:rating).round(2)
      self.review_count = reviews.count
    else
      self.average_rating = 0.0
      self.review_count = 0
    end
    save!
  end

  private

  def area_tag_category
    # area_tagが選ばれていて、かつ、そのカテゴリが 'area' じゃなかったらエラー
    if area_tag && area_tag.category != 'area'
      errors.add(:area_tag_id, 'エリアタグを選択してください')
    end
  end

  def genre_tag_category
    # genre_tagが選ばれていて、かつ、そのカテゴリが 'genre' じゃなかったらエラー
    if genre_tag && genre_tag.category != 'genre'
      errors.add(:genre_tag_id, 'ジャンルタグを選択してください')
    end
  end
end
