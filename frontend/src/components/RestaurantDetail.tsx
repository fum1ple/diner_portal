import React, { useState, useCallback, memo } from 'react';
import { Restaurant } from '@/types/restaurant';
import RestaurantDetailLayout from './RestaurantDetail/RestaurantDetailLayout';
import FloatingActionButton from './RestaurantDetail/FloatingActionButton';
import BackgroundDecorations from './RestaurantDetail/BackgroundDecorations';
import ComponentStyles from './RestaurantDetail/styles/ComponentStyles';
import { useRestaurantOptimization } from '@/hooks/useRestaurantOptimization';

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

  // useRestaurantOptimizationフックを使用して最適化された値を取得
  const { googleMapsUrl, reviewsData } = useRestaurantOptimization({ 
    restaurant 
  });

  // レビュー切り替えハンドラー
  const handleToggleReviews = useCallback(() => {
    setShowReviews(prev => !prev);
  }, []);

  // Google Maps開くハンドラーをuseCallbackでメモ化
  const handleOpenGoogleMaps = useCallback(() => {
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  }, [googleMapsUrl]);

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
      />
    </div>
  );
});

RestaurantDetail.displayName = 'RestaurantDetail';

export default RestaurantDetail;
