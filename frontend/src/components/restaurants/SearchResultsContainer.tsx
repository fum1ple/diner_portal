'use client';

import { useQuery } from '@tanstack/react-query';
import { RestaurantSearchParams } from '@/types/restaurant';
import { restaurantsApi } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
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
  const hasSearched = !!searchParams && isVisible;

  const { 
    data: restaurants = [], 
    isLoading: loading, 
    error 
  } = useQuery({
    queryKey: queryKeys.restaurants.list(searchParams as Record<string, unknown>),
    queryFn: async () => {
      if (!searchParams) return [];
      
      const response = await restaurantsApi.search(searchParams);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || [];
    },
    enabled: hasSearched, // 検索パラメータがあり、表示状態の時のみ実行
    staleTime: 2 * 60 * 1000, // 2分間キャッシュ
    gcTime: 5 * 60 * 1000, // 5分間保持
  });

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
            <p className="text-red-700 font-medium">
              {error.message || '検索中にエラーが発生しました'}
            </p>
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