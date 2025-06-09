import React, { useState, useMemo, useCallback, memo } from 'react';
import { Restaurant } from '@/types/api';
import RestaurantDetailLayout from './RestaurantDetail/RestaurantDetailLayout';
import FloatingActionButton from './RestaurantDetail/FloatingActionButton';
import BackgroundDecorations from './RestaurantDetail/BackgroundDecorations';
import ComponentStyles from './RestaurantDetail/styles/ComponentStyles';

interface RestaurantDetailProps {
  restaurant: Restaurant;
  showReviews?: boolean;
  className?: string;
}

const RestaurantDetail: React.FC<RestaurantDetailProps> = memo(({
  restaurant,
  showReviews: initialShowReviews = false,
  className = ''
}) => {
  const [showReviews, setShowReviews] = useState(initialShowReviews);

  // Google Maps URLを useMemo でメモ化
  const googleMapsUrl = useMemo(() => {
    const query = encodeURIComponent(`${restaurant.name} ${restaurant.area_tag.name}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }, [restaurant.name, restaurant.area_tag.name]);

  // レビュー切り替えハンドラーをuseCallbackでメモ化
  const handleToggleReviews = useCallback(() => {
    setShowReviews(prev => !prev);
  }, []);

  // Google Maps開くハンドラーをuseCallbackでメモ化
  const handleOpenGoogleMaps = useCallback(() => {
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  }, [googleMapsUrl]);

  // レビュー投稿ハンドラー
  const handleWriteReview = useCallback(() => {
    // レビュー投稿モーダルやページへの遷移処理をここに実装
    console.log('レビュー投稿機能は開発中です');
  }, []);

  // レビューデータをuseMemoでメモ化
  const reviewsData = useMemo(() => ({
    reviews: restaurant.reviews || [],
    reviewCount: restaurant.reviews?.length || 0
  }), [restaurant.reviews]);

  return (
    <div className={`bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 relative transition-all duration-700 ${className}`}>
      {/* Background Decorative Elements */}
      <BackgroundDecorations />
      
      {/* Component Styles */}
      <ComponentStyles />
      
      {/* Floating Action Button for Mobile */}
      <FloatingActionButton
        showReviews={showReviews}
        onToggle={handleToggleReviews}
      />

      {/* Main Layout */}
      <RestaurantDetailLayout
        restaurant={restaurant}
        showReviews={showReviews}
        reviewsData={reviewsData}
        onOpenGoogleMaps={handleOpenGoogleMaps}
        onToggleReviews={handleToggleReviews}
        onWriteReview={handleWriteReview}
      />
    </div>
  );
});

RestaurantDetail.displayName = 'RestaurantDetail';

export default RestaurantDetail;
