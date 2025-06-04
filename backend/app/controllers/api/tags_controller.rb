module Api
  class TagsController < ApplicationController
    def index
      # params[:category]があれば絞り込み、なければ全件返す
      tags = if params[:category].present?
        Tag.where(category: params[:category])
      else
        Tag.all
      end
      render json: tags.map { |tag| tag_response(tag) }
    end

    private

    def tag_response(tag)
      {
        id: tag.id,
        name: tag.name,
        category: tag.category
      }
    end
  end
end
