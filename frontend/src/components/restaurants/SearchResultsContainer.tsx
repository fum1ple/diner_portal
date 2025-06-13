import React from 'react';
import RestaurantListItem from './RestaurantListItem';
import EmptySearchPrompt from './EmptySearchPrompt';
import type { RestaurantListItem as RestaurantListItemType, RestaurantSearchFilters } from '@/types/restaurant';

interface SearchResultsContainerProps {
  restaurants: RestaurantListItemType[];
  loading: boolean;
  error: string | null;
  filters: RestaurantSearchFilters;
  onAddRestaurant: () => void;
  onClearSearch: () => void;
}

const SearchResultsContainer: React.FC<SearchResultsContainerProps> = ({
  restaurants,
  loading,
  error,
  filters,
  onAddRestaurant,
  onClearSearch
}) => (
  <div className="bg-white rounded-lg shadow-md p-4">
    {loading ? (
      <div className="text-center text-gray-500 py-8">検索中...</div>
    ) : error ? (
      <div className="text-center text-red-500 py-8">エラー: {error}</div>
    ) : restaurants.length === 0 ? (
      <EmptySearchPrompt
        filters={filters}
        onAddRestaurant={onAddRestaurant}
        onClearSearch={onClearSearch}
      />
    ) : (
      <ul className="space-y-4">
        {restaurants.map(restaurant => (
          <RestaurantListItem key={restaurant.id} restaurant={restaurant} />
        ))}
      </ul>
    )}
  </div>
);

export default SearchResultsContainer;