import { useQuery } from '@tanstack/react-query';

interface Tag {
  id: number;
  name: string;
  category: string;
}

interface Restaurant {
  id: number;
  name: string;
  area_tag: Tag;
  genre_tag: Tag;
  created_at?: string;
  updated_at?: string;
}

interface RestaurantDetailResponse {
  restaurant: Restaurant;
}

export const useRestaurantDetail = (id: string) => useQuery<Restaurant, Error>({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      const response = await fetch(`/api/restaurants/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('店舗が見つかりません');
        }
        const errorData = await response.json().catch(() => ({ message: "エラーが発生しました" }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data: RestaurantDetailResponse = await response.json();
      return data.restaurant;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    gcTime: 10 * 60 * 1000, // 10分間保持
  });
