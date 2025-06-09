import { useQuery } from '@tanstack/react-query';
import { Restaurant } from '@/types/api';

export const useRestaurantDetail = (id: string) => useQuery<Restaurant, Error>({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      const response = await fetch(`/api/restaurants/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('店舗が見つかりません');
        }
        const errorData = await response.json().catch(() => ({ message: "エラーが発生しました" }));
        throw new Error(errorData.message || `HTTPエラー! ステータス: ${response.status}`);
      }
      
      const data = await response.json();
      // APIの直接レスポンスがRestaurantオブジェクトの場合
      return data as Restaurant;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    gcTime: 10 * 60 * 1000, // 10分間保持
  });
