class Restaurant < ApplicationRecord
  belongs_to :user
  has_many :favorites, dependent: :destroy
  has_many :reviews, dependent: :destroy
  
  validates :name, presence: true
  validates :address, presence: true
end
