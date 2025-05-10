module Api
  module V1
    class UsersController < ApplicationController
      skip_before_action :authenticate_request, only: [:create]
      before_action :set_user, only: [:show, :update]
      before_action :check_owner, only: [:update]

      def create
        @user = User.new(user_params)
        if @user.save
          token = jwt_encode(user_id: @user.id)
          render json: { token: token, user: UserSerializer.new(@user).as_json }, status: :created
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def show
        render json: UserSerializer.new(@user).as_json
      end

      def update
        if @user.update(user_params)
          render json: UserSerializer.new(@user).as_json
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def me
        render json: UserSerializer.new(@current_user).as_json
      end

      private

      def user_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation)
      end

      def set_user
        @user = User.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'User not found' }, status: :not_found
      end

      def check_owner
        unless @user.id == @current_user.id
          render json: { error: 'Not authorized' }, status: :forbidden
        end
      end
    end
  end
end
