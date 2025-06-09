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
  category: 'area' | 'genre' | 'scene';
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
  area_tag: Tag;  // 必須プロパティとして統一
  genre_tag: Tag; // 必須プロパティとして統一
  user?: User;    // 登録者情報（APIがincludeした場合）
  reviews?: Review[]; // 店舗詳細情報用のレビューリスト
}

// Review関連の型
export interface Review {
  id: number;
  comment: string;
  rating: number;
  image_url?: string;
  created_at: string;
  user: {
    id: number; // Rails IDとの一貫性のため文字列から変更
    name: string;
  };
  scene_tag?: {
    id: number;
    name: string;
  };
}

export interface CreateReviewRequest {
  comment: string;
  rating: number;
  image?: File;
  scene_tag_id?: number;
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

// 店舗詳細・一覧レスポンス型
export interface RestaurantDetailResponse {
  restaurant: Restaurant;
}

export interface RestaurantsListResponse {
  restaurants: Restaurant[];
}

// 認証関連の型
export interface User {
  id: number; // 一貫性のため文字列から数値に変更
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
