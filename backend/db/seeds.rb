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
# frozen_string_literal: true

# このファイルは、`bin/rails db:seed` コマンドで実行されます。
# 開発環境で使う、初期データやテストデータを作成するために使用します。

# --- 既存のデータをクリアする (任意) ---
# 毎回まっさらな状態から作り直したい場合は、以下のコメントを外してください。
# puts '古いデータを削除しています...'
# User.destroy_all
# Restaurant.destroy_all
# Tag.destroy_all
# puts '古いデータを削除しました。'
# puts '--------------------'


# --- タグの作成 ---
puts 'タグを作成しています...'

# エリアタグ
area_tags = [
  '東京都', '大阪府', '神奈川県', '愛知県', '福岡県',
  '北海道', '宮城県', '広島県', '京都府', '兵庫県',
  '銀座', '渋谷', '新宿' # テストしやすいように具体的なエリアも追加
]
area_tags.each do |area_name|
  Tag.find_or_create_by!(name: area_name, category: 'area')
end

# ジャンルタグ
genre_tags = [
  '和食', '洋食', '中華', 'イタリアン', 'フレンチ', '韓国料理',
  'タイ料理', 'インド料理', 'メキシコ料理', 'ファストフード',
  'カフェ', '居酒屋', '焼肉', '寿司', 'ラーメン', '天ぷら', 'そば'
]
genre_tags.each do |genre_name|
  Tag.find_or_create_by!(name: genre_name, category: 'genre')
end

# シーンタグ
scene_tags = [
  '一人', 'ビジネス', '歓送迎会', '飲み会', 'ランチ', 'ディナー',
  'モーニング', 'お祝い', '接待', 'カジュアル', 'フォーマル', 'シャッフルランチ'
]
scene_tags.each do |scene_name|
  Tag.find_or_create_by!(name: scene_name, category: 'scene')
end

puts 'タグの作成が完了しました。'
puts '--------------------'


# --- テスト用ユーザーの作成 ---
puts 'テストユーザーを作成しています...'
# 最初のユーザーを検索するか、存在しなければ作成する
# パスワードはdeviseなどを使っていないため、ここでは設定不要
user = User.find_or_create_by!(email: 'test@example.com') do |u|
  u.name = '時生 太郎'
end
puts "#{user.name} を作成しました。"
puts '--------------------'


# --- テスト用店舗データの定義 ---
# 「東銀座周辺のお店」をテーマにした10件の店舗データ
restaurants_data = [
  { name: '篝（かがり）銀座本店', genre: 'ラーメン', reviews: [
    { rating: 5, comment: '濃厚な鶏白湯スープが絶品。いつも行列ができています。', scene: '一人' },
    { rating: 4, comment: 'ランチの〆に最高。トリュフの香りがたまりません。', scene: 'ランチ' }
  ]},
  { name: 'ラ・ベットラ・ダ・オチアイ', genre: 'イタリアン', reviews: [
    { rating: 4, comment: '予約必須の人気店。ウニのパスタが有名です。', scene: 'ディナー' },
    { rating: 5, comment: 'コスパが良くて美味しい。記念日ディナーで利用しました。', scene: 'お祝い' }
  ]},
  { name: '銀座 天ぷら 阿部', genre: '天ぷら', reviews: [
    { rating: 5, comment: 'カウンターで揚げたてを頂くスタイル。サクサクで軽い！', scene: '接待' },
    { rating: 4, comment: '少し贅沢なランチにぴったり。海外のお客さんにも喜ばれそう。', scene: 'ビジネス' }
  ]},
  { name: 'トリコロール本店', genre: 'カフェ', reviews: [
    { rating: 4, comment: '昭和レトロな雰囲気が素敵。アンティークな調度品に囲まれてゆっくりできます。', scene: '一人' },
    { rating: 4, comment: 'エクレアとコーヒーのセットがおすすめ。銀座散策の休憩に。', scene: 'カジュアル' }
  ]},
  { name: '銀座 矢部', genre: 'そば', reviews: [
    { rating: 5, comment: '香り高い十割そばが味わえる名店。天ぷらも美味しい。', scene: 'ランチ' },
    { rating: 4, comment: '落ち着いた雰囲気で、ゆっくり食事とお酒を楽しめます。', scene: 'ディナー' }
  ]},
  { name: '焼肉うしごろ 銀座店', genre: '焼肉', reviews: [
    { rating: 5, comment: '特別な日に使いたい高級焼肉。全部美味しいけど、特にザブトンのすき焼きは最高。', scene: 'お祝い' },
    { rating: 5, comment: '接待で利用。個室もあって、サービスも素晴らしい。', scene: '接待' }
  ]},
  { name: '鮨 銀座おのでら', genre: '寿司', reviews: [
    { rating: 5, comment: 'まさに職人技。一つ一つ丁寧に仕事がされていて感動します。', scene: 'フォーマル' },
  ]},
  { name: '銀座 梅林', genre: '和食', reviews: [
    { rating: 4, comment: 'とんかつ激戦区の中でも人気の老舗。スペシャルカツ丼が有名。', scene: 'ランチ' },
    { rating: 3, comment: '昔ながらの洋食屋さんの雰囲気。ボリューム満点です。', scene: '一人' }
  ]},
  { name: 'YOU', genre: 'カフェ', reviews: [
    { rating: 4, comment: '歌舞伎座のすぐ裏。ふわふわのオムライスが名物です。', scene: 'ランチ' },
    { rating: 4, comment: 'クリームソーダもレトロで可愛い。喫茶店好きにはたまらない。', scene: 'カジュアル' }
  ]},
  { name: 'エル・チャテオ・デル・プエンテ', genre: 'スペイン料理', reviews: [
    { rating: 4, comment: '本格的なパエリアが食べられるお店。魚介の旨味がすごい。', scene: '飲み会' },
    { rating: 4, comment: 'ワインの種類も豊富で、タパスも美味しい。賑やかな雰囲気が楽しい。', scene: 'ディナー' }
  ]},
]

# --- 店舗とレビューの作成 ---
puts '店舗とレビューを作成しています...'

# 先にタグ情報を取得しておくことで、ループ内のDB問い合わせを減らす
ginza_area = Tag.find_by(name: '銀座', category: 'area')
genre_tags_map = Tag.where(category: 'genre').pluck(:name, :id).to_h
scene_tags_map = Tag.where(category: 'scene').pluck(:name, :id).to_h

restaurants_data.each do |data|
  # 店舗の作成
  restaurant = Restaurant.find_or_create_by!(name: data[:name]) do |r|
    r.user = user
    r.area_tag = ginza_area
    r.genre_tag_id = genre_tags_map[data[:genre]]
  end

  # レビューの作成
  data[:reviews].each do |review_data|
    Review.find_or_create_by!(restaurant: restaurant, user: user, comment: review_data[:comment]) do |rev|
      rev.rating = review_data[:rating]
      rev.scene_tag_id = scene_tags_map[review_data[:scene]]
      # 画像URLは必要に応じて設定してください
      # rev.image_url = 'https://example.com/image.jpg'
    end
  end
  print '.' # 進捗を表示
end

puts "\n"
puts '--------------------'
puts "シードデータの作成が完了しました！"
puts "ユーザー: #{User.count}件"
puts "店舗: #{Restaurant.count}件"
puts "レビュー: #{Review.count}件"
puts "タグ（合計）: #{Tag.count}件"

