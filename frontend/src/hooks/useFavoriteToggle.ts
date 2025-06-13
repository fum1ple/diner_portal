import { useState } from 'react';
import { authApi } from '@/lib/apiClient';

export function useFavoriteToggle(restaurantId: number, initialFavorited: boolean) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFavorite = async () => {
    try {
      setIsLoading(true);
      
      if (isFavorited) {
        const response = await authApi.removeFavorite(restaurantId);
        if (!response.error) {
          setIsFavorited(false);
        }
      } else {
        const response = await authApi.addFavorite(restaurantId);
        if (!response.error) {
          setIsFavorited(true);
        }
      }
    } catch (error) {
      console.error('Favorite toggle error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isFavorited,
    toggleFavorite,
    isLoading
  };
}