namespace :restaurant_ratings do
  desc "既存のレストランの平均評価と評価数を再計算・更新する"
  task update_all: :environment do
    puts "レストランの平均評価を更新中..."

    Restaurant.find_each do |restaurant|
      restaurant.update_average_rating
      puts "レストラン ID #{restaurant.id} (#{restaurant.name}): 平均評価 #{restaurant.average_rating}, 評価数 #{restaurant.review_count}"
    end

    puts "完了しました！"
  end
end
