module Api
  class RestaurantsController < ApplicationController
    # 認証はタスク1.5で追加

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
