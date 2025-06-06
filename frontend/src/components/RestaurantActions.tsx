import React from 'react';
// import { useRouter } from 'next/navigation'; // Day5以降で有効化
import { Restaurant } from '@/types/api';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, PenTool } from 'lucide-react';

interface RestaurantActionsProps {
  restaurant: Restaurant;
}

const RestaurantActions: React.FC<RestaurantActionsProps> = ({ restaurant }) => {
  // 将来のレビュー投稿機能用（Day5以降で有効化）
  // const router = useRouter();

  const handleGoogleMapSearch = () => {
    const query = encodeURIComponent(`${restaurant.name} ${restaurant.area_tag.name}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleWriteReview = () => {
    // Day5以降で実装予定のルーティング
    const reviewPath = `/restaurants/${restaurant.id}/reviews/new`;
    
    // 現在は開発中のため、コンソールログとアラートで代替
    console.log(`将来の遷移先: ${reviewPath}`);
    alert('レビュー投稿機能は開発中です（Day5以降で実装予定）');
    
    // 将来的にはこちらを有効化:
    // router.push(reviewPath);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">アクション</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleGoogleMapSearch}
            className="flex items-center gap-2"
            variant="default"
            size="default"
          >
            <MapPin className="w-4 h-4" />
            Google Mapで調べる
          </Button>
          
          <Button
            onClick={handleWriteReview}
            className="flex items-center gap-2"
            variant="secondary"
          >
            <PenTool className="w-4 h-4" />
            レビューを書く
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-3">
          ※ レビュー機能は開発中です
        </p>
      </CardContent>
    </Card>
  );
};

export default RestaurantActions;
