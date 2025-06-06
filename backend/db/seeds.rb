# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# エリアタグの作成
area_tags = [
  '東京都',
  '大阪府',
  '神奈川県',
  '愛知県',
  '福岡県',
  '北海道',
  '宮城県',
  '広島県',
  '京都府',
  '兵庫県'
]

area_tags.each do |area_name|
  Tag.find_or_create_by!(name: area_name, category: 'area')
end

# ジャンルタグの作成
genre_tags = [
  '和食',
  '洋食',
  '中華',
  'イタリアン',
  'フレンチ',
  '韓国料理',
  'タイ料理',
  'インド料理',
  'メキシコ料理',
  'ファストフード',
  'カフェ',
  '居酒屋',
  '焼肉',
  '寿司',
  'ラーメン'
]

genre_tags.each do |genre_name|
  Tag.find_or_create_by!(name: genre_name, category: 'genre')
end

puts "シードデータの作成が完了しました！"
puts "エリアタグ: #{Tag.where(category: 'area').count}件"
puts "ジャンルタグ: #{Tag.where(category: 'genre').count}件"
