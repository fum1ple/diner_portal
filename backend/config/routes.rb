Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # API routes
  namespace :api do
    namespace :v1 do
      # Auth
      post '/login', to: 'auth#login'
      
      # Users
      resources :users, only: [:create, :show, :update]
      get '/me', to: 'users#me'
      
      # Restaurants
      resources :restaurants
      get '/my_restaurants', to: 'restaurants#my_restaurants'
      
      # Favorites
      resources :favorites, only: [:index, :destroy]
      post '/favorites/:restaurant_id', to: 'favorites#create'
      
      # Reviews
      resources :reviews, only: [:update, :destroy]
      get '/restaurants/:restaurant_id/reviews', to: 'reviews#index'
      post '/restaurants/:restaurant_id/reviews', to: 'reviews#create'
      get '/my_reviews', to: 'reviews#my_reviews'
    end
  end

  # Defines the root path route ("/")
  # root "posts#index"
end
