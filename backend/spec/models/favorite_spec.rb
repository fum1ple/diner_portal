require 'rails_helper'

RSpec.describe Favorite, type: :model do
  describe 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:restaurant) }
  end

  describe 'validations' do
    subject { create(:favorite) }
    it { should validate_uniqueness_of(:user_id).scoped_to(:restaurant_id) }
  end
end
