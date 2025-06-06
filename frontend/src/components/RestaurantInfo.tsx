import React from 'react';

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

interface RestaurantInfoProps {
  restaurant: Restaurant;
}

const RestaurantInfo: React.FC<RestaurantInfoProps> = ({ restaurant }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{restaurant.name}</h1>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
            <span className="mr-1">📍</span>
            <span className="font-medium">{restaurant.area_tag.name}</span>
          </div>
          <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full">
            <span className="mr-1">🍽️</span>
            <span className="font-medium">{restaurant.genre_tag.name}</span>
          </div>
        </div>
      </header>
      
      {restaurant.created_at && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">登録情報</h3>
          <p className="text-sm text-gray-600">
            登録日: {formatDate(restaurant.created_at)}
          </p>
        </div>
      )}
    </div>
  );
};

export default RestaurantInfo;
