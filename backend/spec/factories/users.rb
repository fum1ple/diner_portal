FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    name { "Test User #{rand(1000)}" }
    # google_id is optional and can be added via traits if needed for specific tests
  end
end
