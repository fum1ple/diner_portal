class RestaurantSerializer < ApplicationSerializer
  attributes :id, :name, :area_tag_id, :genre_tag_id, :user_id,
             :created_at, :updated_at, :average_rating, :review_count

  one :area_tag, serializer: TagSerializer
  one :genre_tag, serializer: TagSerializer

  attribute :url do |restaurant|
    "/restaurants/#{restaurant.id}"
  end

  attribute :is_favorited do |restaurant, params|
    current_user = params&.dig(:current_user)
    current_user&.favorites&.exists?(restaurant_id: restaurant.id) || false
  end

  attribute :reviews, if: proc { |restaurant| 
    restaurant.respond_to?(:reviews) && restaurant.reviews.loaded?
  } do |restaurant|
    ReviewSerializer.new(restaurant.reviews.order(created_at: :desc)).serialize
  end
end