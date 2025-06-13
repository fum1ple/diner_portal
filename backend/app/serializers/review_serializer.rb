class ReviewSerializer < ApplicationSerializer
  attributes :id, :comment, :rating, :image_url, :created_at

  one :user, serializer: UserSerializer
  many :scene_tags, serializer: TagSerializer
end