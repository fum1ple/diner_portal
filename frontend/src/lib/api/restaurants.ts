// 店舗関連API
import { apiCall } from './client';
import type { ApiResponse } from '@/types/api';
import type { Restaurant, CreateRestaurantRequest } from '@/types/restaurant';
import type { Review } from '@/types/review';

// 型ガード関数
const isRestaurantsResponse = (data: unknown): data is Restaurant[] => 
  Array.isArray(data) && data.every(item => 
    typeof item === 'object' && 
    item !== null && 
    'id' in item && 
    'name' in item
  );

export const restaurantsApi = {
  // 店舗作成
  create: async (data: CreateRestaurantRequest): Promise<ApiResponse<Restaurant>> => 
    apiCall<Restaurant>('/restaurants', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // 店舗一覧取得
  getAll: async (): Promise<ApiResponse<Restaurant[]>> => {
    const result = await apiCall<Restaurant[]>('/restaurants');
    
    // データの型検証
    if (result.data && !isRestaurantsResponse(result.data)) {
      return {
        status: result.status,
        error: '店舗一覧のレスポンス形式が無効です',
      };
    }
    
    return result;
  },

  // 店舗検索
  search: async (searchParams: { name?: string; area?: string; genre?: string }): Promise<ApiResponse<Restaurant[]>> => {
    const query = new URLSearchParams();
    if (searchParams.name?.trim()) query.append('name', searchParams.name.trim());
    if (searchParams.area?.trim()) query.append('area', searchParams.area.trim());
    if (searchParams.genre?.trim()) query.append('genre', searchParams.genre.trim());
    
    const endpoint = query.toString() ? `/restaurants?${query.toString()}` : '/restaurants';
    const result = await apiCall<Restaurant[]>(endpoint);
    
    // データの型検証
    if (result.data && !isRestaurantsResponse(result.data)) {
      return {
        status: result.status,
        error: '検索結果のレスポンス形式が無効です',
      };
    }
    
    return result;
  },

  // レビュー取得
  getReviews: async (restaurantId: number): Promise<ApiResponse<Review[]>> =>
    apiCall<Review[]>(`/restaurants/${restaurantId}/reviews`),

  // レビュー投稿
  submitReview: async (restaurantId: string, data: FormData): Promise<ApiResponse<Review>> =>
    apiCall<Review>(`/restaurants/${restaurantId}/reviews`, {
      method: 'POST',
      body: data,
    }),
};