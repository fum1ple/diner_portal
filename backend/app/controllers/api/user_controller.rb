# frozen_string_literal: true

class Api::UserController < ApplicationController
  include ApiAuthentication

  requires_authentication_for_all
  
  # GET /api/user/profile - ユーザー情報取得
  def profile
    render json: {
      success: true,
      user: {
        id: current_user.id,
        email: current_user.email,
        name: current_user.name,
        google_id: current_user.google_id,
        created_at: current_user.created_at,
        updated_at: current_user.updated_at
      }
    }, status: :ok
  end

  # PUT /api/user/update - ユーザー情報更新
  def update
    if current_user.update(user_update_params)
      render json: {
        success: true,
        message: 'User updated successfully',
        user: {
          id: current_user.id,
          email: current_user.email,
          name: current_user.name,
          google_id: current_user.google_id,
          updated_at: current_user.updated_at
        }
      }, status: :ok
    else
      render json: {
        success: false,
        message: 'Failed to update user',
        errors: current_user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private
  

  # 更新可能なパラメータを定義
  def user_update_params
    params.require(:user).permit(:name)
  end
end
