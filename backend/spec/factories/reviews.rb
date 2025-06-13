FactoryBot.define do
  factory :review do
    comment { "This is a great place!" }
    rating { [1, 2, 3, 4, 5].sample } # Random valid rating
    association :user
    association :restaurant
    image_url { nil } # Default to no image, can be added in traits or specific tests

    trait :with_scene_tags do
      # Creates scene tags after the review is created
      after(:create) do |review|
        scene_tag = create(:tag, category: 'scene')
        review.scene_tags << scene_tag
      end
    end

    trait :with_specific_scene_tags do
      # Allows passing specific scene tags
      transient do
        scene_tags_list { [] }
      end
      
      after(:create) do |review, evaluator|
        review.scene_tags = evaluator.scene_tags_list if evaluator.scene_tags_list.any?
      end
    end

    # Trait for review with an image placeholder
    # Note: Actual image upload testing in request specs requires Rack::Test::UploadedFile
    trait :with_image_placeholder do
      image_url { "/uploads/reviews/sample_image_#{SecureRandom.hex(4)}.jpg" }
    end
  end
end
