'use client';

import Link from 'next/link';
import { Restaurant } from '@/types/restaurant';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {restaurant.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {restaurant.area_tag && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {restaurant.area_tag.name}
              </span>
            )}
            {restaurant.genre_tag && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {restaurant.genre_tag.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {restaurant.average_rating > 0 ? (
              <>
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-medium text-gray-900 ml-1">
                    {restaurant.average_rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  ({restaurant.review_count}件)
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-500">レビューなし</span>
            )}
          </div>

          {restaurant.is_favorited && (
            <span className="text-red-500 text-sm">♥</span>
          )}
        </div>
      </div>
    </Link>
  );
}