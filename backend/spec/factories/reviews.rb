FactoryBot.define do
  factory :review do
    comment { "This is a great place!" }
    rating { [1, 2, 3, 4, 5].sample } # Random valid rating
    association :user
    association :restaurant
    image_url { nil } # Default to no image, can be added in traits or specific tests

    trait :with_scene_tag do
      # Creates a tag with category 'scene' and associates it
      association :scene_tag, factory: :tag, category: 'scene'
    end

    trait :with_specific_scene_tag do
      # Allows passing a specific scene tag
      # Example: create(:review, :with_specific_scene_tag, scene_tag: my_scene_tag)
      association :scene_tag, factory: :tag # Will default to random category unless specified
    end

    # Trait for review with an image placeholder
    # Note: Actual image upload testing in request specs requires Rack::Test::UploadedFile
    trait :with_image_placeholder do
      image_url { "/uploads/reviews/sample_image_#{SecureRandom.hex(4)}.jpg" }
    end
  end
end
