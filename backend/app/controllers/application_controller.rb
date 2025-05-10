class ApplicationController < ActionController::API
  include JsonWebToken
  
  before_action :authenticate_request
  
  private
  
  def authenticate_request
    header = request.headers["Authorization"]
    header = header.split(" ").last if header
    
    begin
      @decoded = jwt_decode(header)
      @current_user = User.find(@decoded[:user_id])
    rescue ActiveRecord::RecordNotFound => e
      render json: { error: e.message }, status: :unauthorized
    rescue JWT::DecodeError => e
      render json: { error: e.message }, status: :unauthorized
    end
  end
end
