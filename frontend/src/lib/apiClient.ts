// シンプルなAPI呼び出しクライアント
// 全てのAPI呼び出しはNext.js APIルート経由で行う

import type { ApiResponse, ApiCallOptions } from '@/types/api';
import type { Tag, CreateTagRequest } from '@/types/tag';
import type { Restaurant, CreateRestaurantRequest } from '@/types/restaurant';
import type { Review } from '@/types/review';

// 型ガード関数
const isTagsResponse = (data: unknown): data is Tag[] => 
  Array.isArray(data) && data.every(item => 
    typeof item === 'object' && 
    item !== null && 
    'id' in item && 
    'name' in item && 
    'category' in item
  );

const isRestaurantsResponse = (data: unknown): data is Restaurant[] => 
  Array.isArray(data) && data.every(item => 
    typeof item === 'object' && 
    item !== null && 
    'id' in item && 
    'name' in item
  );

// 基本的なfetch wrapper
const apiCall = async <T = unknown>(
  endpoint: string,
  options: ApiCallOptions = {}
): Promise<ApiResponse<T>> => {
  const { timeout = 10000, retries = 1, ...fetchOptions } = options;
  
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const headers: HeadersInit = { 
        ...((fetchOptions.headers as Record<string, string>) || {}),
      };
      
      if (!(fetchOptions.body instanceof FormData)) {
        (headers as Record<string, string>)['Content-Type'] = 'application/json';
      }

      const response = await fetch(`/api${url}`, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      // FormDataレスポンスはJSONでない場合や空の場合がある（例：201 Createdでボディなしや異なるボディ）
      // ただし、submitReviewのバックエンドはJSONを返すため、これで問題ないはず
      const responseBody = await response.text();
      const data = responseBody ? JSON.parse(responseBody) : null;

      if (!response.ok) {
        return {
          status: response.status,
          error: data?.error || data?.message || `HTTP ${response.status}`,
        };
      }

      return {
        status: response.status,
        data,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      // 全ての再試行後にのみエラーを返す
      if (attempt === retries - 1) {
        return {
          status: 0,
          error: lastError.message,
        };
      }
      
      // リトライ前に少し待機
      await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  
  return {
    status: 0,
    error: lastError?.message || '不明なエラー',
  };
};

// 公開API（認証不要）
export const publicApi = {
  // 現在は認証不要なAPIはありません
};

// 認証API（認証必要）
export const authApi = {
  // タグ取得
  getTags: async (category: 'area' | 'genre' | 'scene'): Promise<ApiResponse<Tag[]>> => {
    const result = await apiCall<Tag[]>(`/tags?category=${category}`);
    
    // データの型検証
    if (result.data && !isTagsResponse(result.data)) {
      return {
        status: result.status,
        error: 'Invalid response format for tags',
      };
    }
    
    return result;
  },

  // シーンタグ取得 (新しい専用関数)
  getSceneTags: async (): Promise<ApiResponse<Tag[]>> => {
    const result = await apiCall<Tag[]>(`/tags?category=scene`);
    if (result.data && !isTagsResponse(result.data)) {
      return {
        status: result.status,
        error: 'Invalid response format for scene tags',
      };
    }
    return result;
  },

  // 店舗作成
  createRestaurant: async (data: CreateRestaurantRequest): Promise<ApiResponse<Restaurant>> => 
    apiCall<Restaurant>('/restaurants', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // タグ作成
  createTag: async (data: CreateTagRequest): Promise<ApiResponse<Tag>> => 
    apiCall<Tag>('/tags', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // 店舗一覧取得
  getRestaurants: async (): Promise<ApiResponse<Restaurant[]>> => {
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
  searchRestaurants: async (searchParams: { name?: string; area?: string; genre?: string }): Promise<ApiResponse<Restaurant[]>> => {
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

  // レビュー投稿
  submitReview: async (restaurantId: string, data: FormData): Promise<ApiResponse<Review>> =>
    apiCall<Review>(`/restaurants/${restaurantId}/reviews`, {
      method: 'POST',
      body: data,
      // FormDataの場合、Content-Typeは意図的に省略し、apiCallが処理します
    }),
};

// 後方互換性のために default export も提供
export default apiCall;
