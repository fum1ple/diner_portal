// タグ関連API
import { apiCall } from './client';
import type { ApiResponse } from '@/types/api';
import type { Tag, CreateTagRequest } from '@/types/tag';

// 型ガード関数
const isTagsResponse = (data: unknown): data is Tag[] => 
  Array.isArray(data) && data.every(item => 
    typeof item === 'object' && 
    item !== null && 
    'id' in item && 
    'name' in item && 
    'category' in item
  );

export const tagsApi = {
  // タグ取得
  getByCategory: async (category: 'area' | 'genre' | 'scene'): Promise<ApiResponse<Tag[]>> => {
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

  // シーンタグ取得 (専用関数)
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
  
  // タグ作成
  create: async (data: CreateTagRequest): Promise<ApiResponse<Tag>> => 
    apiCall<Tag>('/tags', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};