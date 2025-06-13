class ReviewSerializer < ApplicationSerializer
  attributes :id, :comment, :rating, :image_url, :created_at

  one :user, serializer: UserSerializer
  one :scene_tag, serializer: TagSerializer
end