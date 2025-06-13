// お気に入り関連API
import { apiCall } from './client';
import type { ApiResponse } from '@/types/api';

export const favoritesApi = {
  // お気に入り追加
  add: async (restaurantId: number): Promise<ApiResponse<void>> =>
    apiCall<void>(`/restaurants/${restaurantId}/favorite`, {
      method: 'POST',
    }),

  // お気に入り削除
  remove: async (restaurantId: number): Promise<ApiResponse<void>> =>
    apiCall<void>(`/restaurants/${restaurantId}/favorite`, {
      method: 'DELETE',
    }),

  // お気に入り一覧取得（必要に応じて追加）
  // getAll: async (): Promise<ApiResponse<Restaurant[]>> => { ... }
};