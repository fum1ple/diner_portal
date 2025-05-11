module Api
  module V1
    class AuthController < ApplicationController
      skip_before_action :authenticate_request, only: [:login]

      def login
        @user = User.find_by(email: params[:email])
        if @user&.authenticate(params[:password])
          token = jwt_encode(user_id: @user.id)
          render json: { token: token, user: UserSerializer.new(@user).as_json }, status: :ok
        else
          render json: { error: 'Invalid credentials' }, status: :unauthorized
        end
      end
    end
  end
end
