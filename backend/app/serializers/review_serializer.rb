class ReviewSerializer
  def initialize(review)
    @review = review
  end

  def as_json
    {
      id: @review.id,
      content: @review.content,
      rating: @review.rating,
      user_id: @review.user_id,
      restaurant_id: @review.restaurant_id,
      created_at: @review.created_at,
      updated_at: @review.updated_at,
      user: {
        id: @review.user.id,
        name: @review.user.name
      },
      restaurant: {
        id: @review.restaurant.id,
        name: @review.restaurant.name,
        image_url: @review.restaurant.image_url
      }
    }
  end
end
