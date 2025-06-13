import { useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesApi } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';

interface FavoriteToggleOptions {
  onSuccess?: (isFavorited: boolean) => void;
  onError?: (error: unknown, isFavorited: boolean) => void;
}

export const useFavoriteToggle = (
  restaurantId: number, 
  initialFavorited: boolean,
  options?: FavoriteToggleOptions
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (shouldFavorite: boolean) => {
      if (shouldFavorite) {
        return favoritesApi.add(restaurantId);
      } else {
        return favoritesApi.remove(restaurantId);
      }
    },
    onMutate: async (shouldFavorite: boolean) => {
      // 楽観的更新のためにクエリをキャンセル
      await queryClient.cancelQueries({ 
        queryKey: queryKeys.restaurants.detail(restaurantId) 
      });
      await queryClient.cancelQueries({ 
        queryKey: queryKeys.favorites.lists() 
      });

      // 現在のデータを取得（ロールバック用）
      const previousRestaurant = queryClient.getQueryData(
        queryKeys.restaurants.detail(restaurantId)
      );
      const previousFavorites = queryClient.getQueryData(
        queryKeys.favorites.lists()
      );

      // 楽観的更新：レストラン詳細のお気に入り状態を更新
      queryClient.setQueryData(
        queryKeys.restaurants.detail(restaurantId),
        (old: unknown) => {
          if (old && typeof old === 'object' && 'is_favorited' in old) {
            return { ...old, is_favorited: shouldFavorite };
          }
          return old;
        }
      );

      return { previousRestaurant, previousFavorites };
    },
    onError: (error, shouldFavorite, context) => {
      // エラー時にロールバック
      if (context?.previousRestaurant) {
        queryClient.setQueryData(
          queryKeys.restaurants.detail(restaurantId),
          context.previousRestaurant
        );
      }
      if (context?.previousFavorites) {
        queryClient.setQueryData(
          queryKeys.favorites.lists(),
          context.previousFavorites
        );
      }

      console.error('Favorite toggle error:', error);
      options?.onError?.(error, shouldFavorite);
    },
    onSuccess: (data, shouldFavorite) => {
      if (data.error) {
        // API側でエラーが返された場合
        console.error('Favorite API error:', data.error);
        options?.onError?.(new Error(data.error), shouldFavorite);
        return;
      }

      options?.onSuccess?.(shouldFavorite);
    },
    onSettled: () => {
      // 成功・失敗に関わらず関連クエリを無効化して最新状態を取得
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.restaurants.detail(restaurantId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.favorites.lists() 
      });
    },
  });

  const toggleFavorite = () => {
    const currentRestaurantData = queryClient.getQueryData(
      queryKeys.restaurants.detail(restaurantId)
    ) as { is_favorited?: boolean } | undefined;
    
    const isFavorited = currentRestaurantData?.is_favorited ?? initialFavorited;
    mutation.mutate(!isFavorited);
  };

  // 現在のお気に入り状態を取得
  const restaurantData = queryClient.getQueryData(
    queryKeys.restaurants.detail(restaurantId)
  ) as { is_favorited?: boolean } | undefined;
  
  const isFavorited = restaurantData?.is_favorited ?? initialFavorited;

  return {
    isFavorited,
    toggleFavorite,
    isLoading: mutation.isPending,
  };
};