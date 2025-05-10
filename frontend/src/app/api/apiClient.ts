import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
};

export const fetchApi = async (endpoint: string, options: FetchOptions = {}) => {
  const session = await getSession();
  const token = session?.token;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    method: options.method || 'GET',
    headers,
    credentials: 'include',
  };
  
  if (options.body) {
    config.body = JSON.stringify(options.body);
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `APIリクエストエラー: ${response.status}`);
  }
  
  return response.json();
};

// ユーザー情報取得
export const fetchUserProfile = () => {
  return fetchApi('/api/v1/me');
};

// 自分のレストラン情報を取得
export const fetchMyRestaurants = () => {
  return fetchApi('/api/v1/my_restaurants');
};

// お気に入り一覧を取得
export const fetchFavorites = () => {
  return fetchApi('/api/v1/favorites');
};

// お気に入り追加
export const addFavorite = (restaurantId: number) => {
  return fetchApi(`/api/v1/favorites/${restaurantId}`, {
    method: 'POST'
  });
};

// お気に入り削除
export const removeFavorite = (restaurantId: number) => {
  return fetchApi(`/api/v1/favorites/${restaurantId}`, {
    method: 'DELETE'
  });
};

// 自分のレビュー一覧を取得
export const fetchMyReviews = () => {
  return fetchApi('/api/v1/my_reviews');
};

// レビュー作成
export const createReview = (restaurantId: number, data: { content: string; rating: number }) => {
  return fetchApi(`/api/v1/restaurants/${restaurantId}/reviews`, {
    method: 'POST',
    body: data
  });
};

// レビュー更新
export const updateReview = (reviewId: number, data: { content: string; rating: number }) => {
  return fetchApi(`/api/v1/reviews/${reviewId}`, {
    method: 'PUT',
    body: data
  });
};

// レビュー削除
export const deleteReview = (reviewId: number) => {
  return fetchApi(`/api/v1/reviews/${reviewId}`, {
    method: 'DELETE'
  });
};

// プロフィール更新
export const updateProfile = (data: { name: string; email: string; password?: string; password_confirmation?: string }) => {
  return fetchApi(`/api/v1/users/me`, {
    method: 'PUT',
    body: { user: data }
  });
};
