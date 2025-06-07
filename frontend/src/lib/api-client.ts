// シンプルなAPI呼び出しクライアント
// 全てのAPI呼び出しはNext.js APIルート経由で行う

import type {
  ApiResponse,
  Tag,
  Restaurant,
  CreateRestaurantRequest,
  CreateTagRequest,
  ApiCallOptions,
  Review // Added Review type
} from '@/types/api';

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
      
      const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const headers: HeadersInit = { ...fetchOptions.headers };
      if (!(fetchOptions.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(`/api${url}`, {
        ...fetchOptions, // Spread options first
        headers,         // Then override headers
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      // FormData responses might not be JSON, or might be empty (e.g., 201 Created with no body or different body)
      // However, our backend for submitReview returns JSON, so this should be fine.
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
      // Ensure that the error is logged only once after all retries.
      if (attempt === retries - 1) {
        console.error(`API call to ${endpoint} failed after ${retries} attempts:`, lastError);
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
  }
};

// 認証API（認証必要）
export const authApi = {
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
        error: 'Invalid response format for restaurants',
      };
    }
    
    return result;
  },

  // レビュー投稿
  submitReview: async (restaurantId: string, data: FormData): Promise<ApiResponse<Review>> =>
    apiCall<Review>(`/restaurants/${restaurantId}/reviews`, {
      method: 'POST',
      body: data,
      // Content-Type is intentionally omitted for FormData, apiCall will handle it
    }),
};
