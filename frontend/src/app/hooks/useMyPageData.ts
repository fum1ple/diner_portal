import { useState, useEffect } from 'react';
import { fetchMyRestaurants, fetchFavorites, fetchMyReviews } from '../api/apiClient';

// レストラン型定義
export type Restaurant = {
  id: number;
  name: string;
  description: string;
  address: string;
  image_url: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
  };
  favorite_count: number;
  review_count: number;
  average_rating: number;
};

// レビュー型定義
export type Review = {
  id: number;
  content: string;
  rating: number;
  user_id: number;
  restaurant_id: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
  };
  restaurant: {
    id: number;
    name: string;
    image_url: string;
  };
};

// 自分のレストラン一覧を取得するフック
export const useMyRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMyRestaurants();
        setRestaurants(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '店舗情報の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  return { restaurants, isLoading, error };
};

// お気に入り一覧を取得するフック
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        const data = await fetchFavorites();
        setFavorites(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'お気に入り情報の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  return { favorites, isLoading, error };
};

// 自分のレビュー一覧を取得するフック
export const useMyReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMyReviews();
        setReviews(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'レビュー情報の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, []);

  return { reviews, isLoading, error };
};
