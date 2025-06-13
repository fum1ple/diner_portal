'use client';

import { useEffect, useState } from 'react';
import { Restaurant, RestaurantSearchParams } from '@/types/restaurant';
import { restaurantsApi } from '@/lib/api';
import RestaurantCard from './RestaurantCard';
import NoResultsMessage from './NoResultsMessage';

interface SearchResultsContainerProps {
  searchParams: RestaurantSearchParams | null;
  isVisible: boolean;
}

export default function SearchResultsContainer({ 
  searchParams, 
  isVisible 
}: SearchResultsContainerProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!searchParams || !isVisible) return;

    const performSearch = async () => {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      try {
        const response = await restaurantsApi.search(searchParams);
        if (response.error) {
          throw new Error(response.error);
        }
        setRestaurants(response.data || []);
      } catch (err) {
        setError('検索中にエラーが発生しました');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [searchParams, isVisible]);

  if (!isVisible) return null;

  return (
    <div className={`transition-all duration-700 ease-out transform ${
      isVisible 
        ? 'opacity-100 translate-y-0 scale-100' 
        : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
    }`}>
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 lg:bg-transparent lg:shadow-none lg:border-none lg:p-0">
        <div className="flex items-center justify-between mb-8 lg:mb-6">
          <h2 className="text-2xl font-bold text-teal-800 lg:text-3xl">
            検索結果
          </h2>
          {hasSearched && !loading && (
            <div className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold">
              {restaurants.length} 件見つかりました
            </div>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-200"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent absolute top-0 left-0"></div>
            </div>
            <span className="mt-4 text-teal-600 font-medium">検索中...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && hasSearched && restaurants.length === 0 && (
          <div className="animate-fade-in">
            <NoResultsMessage 
              searchParams={searchParams}
            />
          </div>
        )}

        {!loading && !error && restaurants.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {restaurants.map((restaurant, index) => (
              <div 
                key={restaurant.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <RestaurantCard 
                  restaurant={restaurant} 
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}