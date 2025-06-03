module Api
  class RestaurantsController < ApplicationController
    before_action :authenticate_user!

    def create
      # 実装は後続タスクで
    end

    private

    def restaurant_params
      # レストランの情報から、name, area_tag, genre_tagという項目だけを許可して取得。
      params.require(:restaurant).permit(:name, :area_tag, :genre_tag)
    end
  end
end
