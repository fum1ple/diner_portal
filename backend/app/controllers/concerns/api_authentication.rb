# frozen_string_literal: true

module ApiAuthentication
  extend ActiveSupport::Concern

  class_methods do
    # 指定されたアクションで認証を要求する
    def requires_authentication(*actions)
      define_method :jwt_authentication_required? do
        actions.map(&:to_s).include?(action_name)
      end
    end

    # 全てのアクションで認証を要求する
    def requires_authentication_for_all
      define_method :jwt_authentication_required? do
        true
      end
    end
  end
end