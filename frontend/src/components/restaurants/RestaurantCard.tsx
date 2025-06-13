'use client';

import Link from 'next/link';
import { Restaurant } from '@/types/restaurant';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors duration-200">
            {restaurant.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            {restaurant.area_tag && (
              <span className="bg-teal-100 text-teal-800 px-3 py-1.5 rounded-full font-medium">
                {restaurant.area_tag.name}
              </span>
            )}
            {restaurant.genre_tag && (
              <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full font-medium">
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
                  <span className="text-sm font-medium text-slate-900 ml-1">
                    {restaurant.average_rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  ({restaurant.review_count}件)
                </span>
              </>
            ) : (
              <span className="text-sm text-slate-500">レビューなし</span>
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