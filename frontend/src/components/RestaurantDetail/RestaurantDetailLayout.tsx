import React, { memo } from 'react';
import { Restaurant, Review } from '@/types/api';
import { LAYOUT, TRANSITIONS } from './styles/constants';
import { glassmorphismCard, gradientOverlay } from './styles/glassmorphism';
import RestaurantInfo from '../RestaurantInfo';
import RestaurantActions from './RestaurantActions';
import ReviewsSection from './ReviewsSection';

interface RestaurantDetailLayoutProps {
  restaurant: Restaurant;
  showReviews: boolean;
  reviewsData: {
    reviews: Review[];
    reviewCount: number;
    averageRating: number;
    hasReviews: boolean;
  };
  onOpenGoogleMaps: () => void;
  onToggleReviews: () => void;
}

const RestaurantDetailLayout: React.FC<RestaurantDetailLayoutProps> = memo(({
  restaurant,
  showReviews,
  reviewsData,
  onOpenGoogleMaps,
  onToggleReviews,
}) => (
  <div
    className={`${LAYOUT.container} px-4 py-6 ${TRANSITIONS.extraLong} ${
      showReviews ? LAYOUT.grid.reviews : LAYOUT.grid.center
    }`}
  >
    {/* 左パネル：レストラン詳細 */}
    <div
      className={`${TRANSITIONS.extraLong} transform ${
        showReviews 
          ? LAYOUT.responsive.leftPanel.withReviews
          : LAYOUT.responsive.leftPanel.withoutReviews
      }`}
    >
      {/* レストラン情報カード */}
      <div className={`group ${glassmorphismCard} p-8 mb-6`}>
        <div className={gradientOverlay}></div>
        <div className="relative z-10">
          <RestaurantInfo restaurant={restaurant} />
        </div>
      </div>

      {/* アクションボタン */}
      <RestaurantActions
        showReviews={showReviews}
        onOpenGoogleMaps={onOpenGoogleMaps}
        onToggleReviews={onToggleReviews}
      />
    </div>

    {/* 右パネル：レビュー */}
    <ReviewsSection
      reviews={reviewsData.reviews}
      isVisible={showReviews}
      restaurantId={restaurant.id}
    />
  </div>
));

RestaurantDetailLayout.displayName = 'RestaurantDetailLayout';

export default RestaurantDetailLayout;
