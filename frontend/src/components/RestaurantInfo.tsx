import React from 'react';
import { Restaurant } from '@/types/api';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { MapPin, Utensils } from 'lucide-react';

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
    <Card className="mb-6">
      <CardHeader>
        <h1 className="text-3xl font-bold mb-3">{restaurant.name}</h1>
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
      
      {(restaurant.created_at || restaurant.user) && (
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
              {restaurant.user && (
                <p className="text-sm text-muted-foreground">
                  登録者: {restaurant.user.name || restaurant.user.email}
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
