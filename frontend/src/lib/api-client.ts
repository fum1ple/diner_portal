// シンプルなAPI呼び出しクライアント
// 全てのAPI呼び出しはNext.js APIルート経由で行う

import type {
  ApiResponse,
  Tag,
  Restaurant,
  CreateRestaurantRequest,
  CreateTagRequest,
  ApiCallOptions
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
      
      const response = await fetch(`/api${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
        signal: controller.signal,
        ...fetchOptions,
      });
      
      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        return {
          status: response.status,
          error: data.error || data.message || `HTTP ${response.status}`,
        };
      }

      return {
        status: response.status,
        data,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === retries - 1) {
        console.error('API呼び出しエラー:', lastError);
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
  getTags: async (category: 'area' | 'genre'): Promise<ApiResponse<Tag[]>> => {
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
};
