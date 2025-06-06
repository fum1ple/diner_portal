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
}

interface RestaurantActionsProps {
  restaurant: Restaurant;
}

const RestaurantActions: React.FC<RestaurantActionsProps> = ({ restaurant }) => {
  const handleGoogleMapSearch = () => {
    const query = encodeURIComponent(`${restaurant.name} ${restaurant.area_tag.name}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleWriteReview = () => {
    // Day5以降で実装予定
    console.log('レビュー投稿ページに遷移予定');
    // 将来的には: router.push(`/restaurants/${restaurant.id}/reviews/new`);
    
    // 一時的にアラートで通知
    alert('レビュー投稿機能は開発中です（Day5以降で実装予定）');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">アクション</h3>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleGoogleMapSearch}
          className="flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
          type="button"
        >
          <span className="mr-2">📍</span>
          Google Mapで調べる
        </button>
        
        <button
          onClick={handleWriteReview}
          className="flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium"
          type="button"
        >
          <span className="mr-2">✍️</span>
          レビューを書く
        </button>
      </div>
      
      <p className="text-xs text-gray-500 mt-3">
        ※ レビュー機能は開発中です
      </p>
    </div>
  );
};

export default RestaurantActions;
