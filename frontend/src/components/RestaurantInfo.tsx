import React from 'react';
import { Restaurant } from '@/types/api';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { MapPin, Utensils, Star } from 'lucide-react';

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

  // バックエンドから提供される平均評価と件数を使用
  const reviewStats = {
    averageRating: restaurant.average_rating || 0,
    reviewCount: restaurant.review_count || 0,
    hasReviews: (restaurant.review_count || 0) > 0
  };

  // 星評価表示コンポーネント
  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating 
              ? 'text-yellow-400 fill-yellow-400' 
              : 'text-gray-300 fill-gray-300'
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium text-gray-700">
        {rating.toFixed(1)}
      </span>
      <span className="text-sm text-gray-500">
        ({reviewStats.reviewCount}件)
      </span>
    </div>
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <h1 className="text-3xl font-bold mb-3">{restaurant.name}</h1>
        
        {/* レビュー評価の表示 */}
        {reviewStats.hasReviews && (
          <div className="mb-3">
            <StarRating rating={reviewStats.averageRating} />
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {restaurant.area_tag.name}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Utensils className="w-3 h-3" />
            {restaurant.genre_tag.name}
          </Badge>
        </div>
      </CardHeader>
      
      {(restaurant.created_at) && (
        <CardContent>
          <Separator className="mb-4" />
          <div>
            <h3 className="text-sm font-semibold mb-2">登録情報</h3>
            <div className="space-y-1">
              {restaurant.created_at && (
                <p className="text-sm text-muted-foreground">
                  登録日: {formatDate(restaurant.created_at)}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default RestaurantInfo;
