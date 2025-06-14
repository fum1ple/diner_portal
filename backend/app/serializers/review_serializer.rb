class ReviewSerializer < ApplicationSerializer
  attributes :id, :comment, :image_url, :created_at
  
  attribute :rating do |review|
    review.rating.to_f
  end

  one :user, serializer: UserSerializer
  many :scene_tags, serializer: TagSerializer
end