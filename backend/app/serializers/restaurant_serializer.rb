class RestaurantSerializer < ApplicationSerializer
  attributes :id, :name, :area_tag_id, :genre_tag_id, :user_id,
             :created_at, :updated_at, :average_rating, :review_count

  one :area_tag, serializer: TagSerializer
  one :genre_tag, serializer: TagSerializer

  attribute :url do |restaurant|
    "/restaurants/#{restaurant.id}"
  end

  attribute :is_favorited do |restaurant|
    # 事前に取得したお気に入りIDのSetを使用してN+1クエリを防ぐ
    user_favorited_ids = params&.dig(:user_favorited_ids)
    # Rails.logger.debug "Restaurant #{restaurant.id}: user_favorited_ids = #{user_favorited_ids.inspect}"
    if user_favorited_ids
      user_favorited_ids.include?(restaurant.id)
    else
      false
    end
  end

  many :reviews, if: proc { |restaurant| 
    restaurant.respond_to?(:reviews) && restaurant.reviews.loaded?
  }, serializer: ReviewSerializer
end