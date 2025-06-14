Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  #　通常のルーティングはここに記述しますが、API専用のルーティングを設定するために、以下のようにネームスペースを使用します。
  # API専用のルーティングを設定

  namespace :api do
    # 認証関連のルート
    post 'auth/google', to: 'auth#google'
    post 'auth/refresh', to: 'auth#refresh'
    post 'auth/logout', to: 'auth#logout'

    # 認証が必要なユーザー関連のルート
    get 'user/profile', to: 'user#profile'
    put 'user/update', to: 'user#update'

    # レストランに関する機能のうち、only以降のアクションのみを許可
    resources :restaurants, only: [:create, :index, :show] do
      resource :favorite, only: [:create, :destroy], controller: 'favorites'
      resources :reviews, only: [:create, :index]
    end
    resources :favorites, only: [:index]
    # タグに関する機能のうち、indexとcreateアクションを許可
    resources :tags, only: [:index, :create]
  end
end
