Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  namespace :api do
    # 認証関連のルート
    post 'auth/google', to: 'auth#google'
    post 'auth/refresh', to: 'auth#refresh'
    post 'auth/logout', to: 'auth#logout'

    # 認証が必要なユーザー関連のルート
    get 'user/profile', to: 'user#profile'
    put 'user/update', to: 'user#update'
  end
end
