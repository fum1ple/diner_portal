import React from 'react';
import { Restaurant } from '@/types/api';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Utensils, Clock } from 'lucide-react';
import StarRating from './StarRating';

interface RestaurantDetailProps {
  restaurant: Restaurant;
  showReviews?: boolean;
  className?: string;
}

const RestaurantDetail: React.FC<RestaurantDetailProps> = ({ 
  restaurant, 
  className = '' 
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAverageRating = () => {
    if (!restaurant.reviews || restaurant.reviews.length === 0) return 0;
    const sum = restaurant.reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / restaurant.reviews.length) * 10) / 10;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* レストラン基本情報 */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
            
            {/* タグ情報 */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {restaurant.area_tag.name}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Utensils className="w-3 h-3" />
                {restaurant.genre_tag.name}
              </Badge>
            </div>

            {/* 評価情報 */}
            {restaurant.reviews && restaurant.reviews.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <StarRating value={calculateAverageRating()} readOnly size="sm" />
                  <span className="text-lg font-semibold text-gray-700">
                    {calculateAverageRating()}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({restaurant.reviews.length}件のレビュー)
                </span>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* レストラン詳細情報 */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-800">詳細情報</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                <Clock className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">登録日</p>
                <p className="text-sm text-gray-600">{formatDate(restaurant.created_at)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Google Map検索ボタン */}
      <Card>
        <CardContent className="pt-6">
          <button
            onClick={() => {
              const query = encodeURIComponent(`${restaurant.name} ${restaurant.area_tag.name}`);
              const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
              window.open(url, '_blank', 'noopener,noreferrer');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <MapPin className="w-4 h-4" />
            Google Mapで調べる
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantDetail;
