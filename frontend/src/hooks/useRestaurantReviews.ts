import { useQuery } from '@tanstack/react-query';
import { restaurantsApi } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';

export const useRestaurantReviews = (restaurantId: number) => useQuery({
    queryKey: queryKeys.reviews.list(restaurantId),
    queryFn: async () => {
      const response = await restaurantsApi.getReviews(restaurantId);
      
      // レビューが存在しない場合（404など）は正常な状態として扱う
      if (response.error) {
        // 404やレビューなしの場合は空配列を設定してエラーは表示しない
        if (response.status === 404 || 
            response.error.includes('not found') || 
            response.error.includes('レビューが見つかりません')) {
          return [];
        }
        // その他の真のエラーの場合のみエラーを投げる
        throw new Error(response.error);
      }
      
      return response.data || [];
    },
    staleTime: 2 * 60 * 1000, // レビューは2分間キャッシュ
    gcTime: 10 * 60 * 1000, // 10分間ガベージコレクション保持
    retry: (failureCount, error) => {
      // 404エラーの場合はリトライしない
      if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });