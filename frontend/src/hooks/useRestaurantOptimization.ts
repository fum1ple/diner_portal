// カスタムフック: RestaurantDetail関連のパフォーマンス最適化
import { useMemo, useCallback, useRef, useEffect } from 'react';
import { Restaurant } from '@/types/api';

export interface UseRestaurantOptimizationProps {
  restaurant: Restaurant;
  onToggleReviews?: (show: boolean) => void;
}

export const useRestaurantOptimization = ({ 
  restaurant, 
  onToggleReviews 
}: UseRestaurantOptimizationProps) => {
  // 前回の値を保持するためのref
  const prevRestaurantRef = useRef<Restaurant>();
  
  // レストランデータが変更されたかどうかをチェック
  const hasRestaurantChanged = useMemo(() => {
    const changed = prevRestaurantRef.current?.id !== restaurant.id ||
                   prevRestaurantRef.current?.updated_at !== restaurant.updated_at;
    prevRestaurantRef.current = restaurant;
    return changed;
  }, [restaurant]);

  // Google Maps URLの生成をメモ化
  const googleMapsUrl = useMemo(() => {
    const query = encodeURIComponent(`${restaurant.name} ${restaurant.area_tag.name}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }, [restaurant.name, restaurant.area_tag.name]);

  // レビュー関連データの計算をメモ化
  const reviewsData = useMemo(() => {
    if (!restaurant.reviews || restaurant.reviews.length === 0) {
      return {
        reviews: [],
        reviewCount: 0,
        averageRating: 0,
        hasReviews: false
      };
    }

    const reviews = restaurant.reviews;
    const reviewCount = reviews.length;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = Math.round((sum / reviewCount) * 10) / 10;

    return {
      reviews,
      reviewCount,
      averageRating,
      hasReviews: true
    };
  }, [restaurant.reviews]);

  // レビュー表示切り替えのコールバックをメモ化
  const handleToggleReviews = useCallback((show: boolean) => {
    onToggleReviews?.(show);
  }, [onToggleReviews]);

  // デバッグ用のパフォーマンス測定
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Restaurant data changed:', hasRestaurantChanged);
      console.log('Reviews calculated:', reviewsData.reviewCount);
    }
  }, [hasRestaurantChanged, reviewsData.reviewCount]);

  return {
    googleMapsUrl,
    reviewsData,
    handleToggleReviews,
    hasRestaurantChanged
  };
};
