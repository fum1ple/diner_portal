import { useState } from 'react';
import { favoritesApi } from '@/lib/api';

export const useFavoriteToggle = (restaurantId: number, initialFavorited: boolean) => {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFavorite = async () => {
    try {
      setIsLoading(true);
      
      if (isFavorited) {
        const response = await favoritesApi.remove(restaurantId);
        if (!response.error) {
          setIsFavorited(false);
        }
      } else {
        const response = await favoritesApi.add(restaurantId);
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
};