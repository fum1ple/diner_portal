FactoryBot.define do
  factory :restaurant do
    sequence(:name) { |n| "Restaurant #{n}" }
    association :user

    # Associate with existing tags or create new ones if not provided
    # By default, create area and genre tags.
    association :area_tag, factory: :tag, category: 'area'
    association :genre_tag, factory: :tag, category: 'genre'

    # Example of how to allow passing specific tags:
    # transient do
    #   area { create(:tag, :area) }
    #   genre { create(:tag, :genre) }
    # end
    # after(:build) do |restaurant, evaluator|
    #   restaurant.area_tag = evaluator.area
    #   restaurant.genre_tag = evaluator.genre
    # end
  end
end
