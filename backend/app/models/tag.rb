class Tag < ApplicationRecord
  validates :name, :category, presence: true #タグには名前とカテゴリが必要
  validates :name, length: { maximum: 255 } # 名前の長さを制限
  validates :category, inclusion: { in: %w[area genre scene] } #カテゴリはareaまたはgenreのいずれかでなければならない

  scope :areas, -> { where(category: 'area') } # エリアタグを取得するスコープ
  scope :genres, -> { where(category: 'genre') } # ジャンルタグを取得するスコープ
  scope :scenes, -> { where(category: 'scene') } # シーンタグを取得するスコープ
  scope :area_tags, -> { where(category: 'area') } # エリアタグを取得するスコープ（テスト用）
  scope :genre_tags, -> { where(category: 'genre') } # ジャンルタグを取得するスコープ（テスト用）
end
