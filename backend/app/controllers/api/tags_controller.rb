module Api
  class TagsController < ApplicationController
    include ApiAuthentication

    requires_authentication :index, :create
    def index
      # params[:category]があれば絞り込み、なければ全件返す
      tags = if params[:category].present?
        Tag.where(category: params[:category])
      else
        Tag.all
      end
      render json: tags.map { |tag| tag_response(tag) }
    end

    def create
      tag = Tag.new(tag_params)

      if tag.save
        render json: tag_response(tag), status: :created
      else
        render json: { errors: tag.errors.messages }, status: :unprocessable_entity
      end
    end

    private

    def tag_response(tag)
      {
        id: tag.id,
        name: tag.name,
        category: tag.category
      }
    end

    def tag_params
      params.require(:tag).permit(:name, :category)
    end

  end
end
