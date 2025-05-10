class RestaurantSerializer
  def initialize(restaurant)
    @restaurant = restaurant
  end

  def as_json
    {
      id: @restaurant.id,
      name: @restaurant.name,
      description: @restaurant.description,
      address: @restaurant.address,
      image_url: @restaurant.image_url,
      user_id: @restaurant.user_id,
      created_at: @restaurant.created_at,
      updated_at: @restaurant.updated_at,
      user: {
        id: @restaurant.user.id,
        name: @restaurant.user.name
      },
      favorite_count: @restaurant.favorites.count,
      review_count: @restaurant.reviews.count,
      average_rating: average_rating
    }
  end

  private

  def average_rating
    return 0 if @restaurant.reviews.empty?
    @restaurant.reviews.average(:rating).to_f.round(1)
  end
end
