import { Restaurant } from '../types/restaurant';

export const createRestaurant = async (restaurantData: Omit<Restaurant, 'id'>): Promise<Restaurant> => {
  const response = await fetch('http://localhost:3000/restaurants', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ restaurant: restaurantData }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'レストランの追加に失敗しました');
  }

  return response.json();
};
