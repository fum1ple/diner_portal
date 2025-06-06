// API関連の型定義

// 基本的なAPIレスポンス型
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
}

// エラーレスポンス型
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

// タグ関連の型
export interface Tag {
  id: number;
  name: string;
  category: 'area' | 'genre';
  created_at?: string;
  updated_at?: string;
}

export interface TagsResponse {
  tags?: Tag[];
  data?: Tag[];
}

// タグ作成リクエストの型
export interface CreateTagRequest {
  tag: {
    name: string;
    category: 'area' | 'genre';
  };
}

// 店舗関連の型
export interface Restaurant {
  id: number;
  name: string;
  area_tag_id: number;
  genre_tag_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  area_tag?: Tag;
  genre_tag?: Tag;
}

export interface CreateRestaurantRequest {
  restaurant: {
    name: string;
    area_tag_id: number;
    genre_tag_id: number;
  };
}

export interface CreateRestaurantResponse {
  id: number;
  name: string;
  area_tag_id: number;
  genre_tag_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface RestaurantsResponse {
  restaurants?: Restaurant[];
  data?: Restaurant[];
}

// 認証関連の型
export interface User {
  id: string;
  email: string;
  name?: string;
  google_id?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  success: boolean;
}

// API呼び出し時のオプション型
export interface ApiCallOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}
