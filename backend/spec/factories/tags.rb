FactoryBot.define do
  factory :tag do
    sequence(:name) { |n| "Tag #{n}" }
    category { %w[area genre scene].sample } # Ensure scene is possible

    trait :area do
      category { 'area' }
    end

    trait :genre do
      category { 'genre' }
    end

    trait :scene do
      category { 'scene' }
    end
  end
end
