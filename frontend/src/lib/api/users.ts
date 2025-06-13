// ユーザー関連API
import { authenticatedFetch } from './auth';

export const usersApi = {
  // ユーザープロフィール更新
  updateProfile: async (userData: {
    name?: string;
    email?: string;
  }) => {
    const response = await authenticatedFetch('/api/user/update', {
      method: 'PUT',
      body: JSON.stringify({ user: userData }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`プロフィール更新に失敗しました: ${response.status} ${errorText}`);
    }
    
    return response.json();
  },

  // ユーザー情報取得（必要に応じて追加）
  // getProfile: async () => { ... }
};