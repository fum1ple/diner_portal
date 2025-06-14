import React from 'react';
import Link from 'next/link';
import type { RestaurantListItem as RestaurantListItemType } from '@/types/restaurant';

interface RestaurantListItemProps {
  restaurant: RestaurantListItemType;
}

const RestaurantListItem: React.FC<RestaurantListItemProps> = ({ restaurant }) => (
  <li className="border-b last:border-b-0 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <Link 
        href={restaurant.url || `/restaurants/${restaurant.id}`} 
        className="font-bold text-lg text-teal-600 hover:underline"
      >
        {restaurant.name}
      </Link>
      <div className="text-sm text-gray-500 mt-1">
        <span>{restaurant.area_tag?.name}</span>
        <span className="mx-2">/</span>
        <span>{restaurant.genre_tag?.name}</span>
      </div>
    </div>
    {typeof restaurant.average_rating === 'number' && (
      <div className="text-yellow-500 font-bold text-lg whitespace-nowrap">
        ★ {typeof restaurant.average_rating === 'number' ? restaurant.average_rating.toFixed(1) : '0.0'}
      </div>
    )}
  </li>
);

export default RestaurantListItem;