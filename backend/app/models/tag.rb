class Tag < ApplicationRecord
  validates :name, :category, presence: true #タグには名前とカテゴリが必要
  validates :category, inclusion: { in: %w[area genre] } #カテゴリはareaまたはgenreのいずれかでなければならない

  scope :areas, -> { where(category: 'area') } # エリアタグを取得するスコープ
  scope :genres, -> { where(category: 'genre') } # ジャンルタグを取得するスコープ
end
