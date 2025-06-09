import React, { memo, useState } from 'react';
import { Review } from '@/types/api';
import { glassmorphismCardDark } from '../styles/glassmorphism';
import ReviewsHeader from './ReviewsHeader';
import ReviewsList from './ReviewsList';
import WriteReviewButton from './WriteReviewButton';
import ReviewForm from '@/components/ReviewForm';

interface ReviewsSectionProps {
  reviews: Review[];
  isVisible: boolean;
  restaurantId: number;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = memo(({
  reviews,
  isVisible,
  restaurantId
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!isVisible) return null;

  const handleWriteReviewClick = () => {
    setShowReviewForm(true);
  };

  const handleReviewSubmit = (review: { rating: number; comment: string }) => {
    console.log('Review submitted in ReviewsSection:', review, 'for restaurantId:', restaurantId);
    setShowReviewForm(false);
  };

  const handleCancelReview = () => {
    setShowReviewForm(false);
  };

  return (
    <div className="lg:col-span-2 transition-all duration-700 transform animate-in slide-in-from-right">
      <div className={glassmorphismCardDark + ' p-10'}>
        <ReviewsHeader reviewCount={reviews.length} />
        {showReviewForm && (
          <ReviewForm 
            restaurantId={restaurantId} 
            onReviewSubmit={handleReviewSubmit} 
            onCancel={handleCancelReview} 
          />
        )}
        <ReviewsList reviews={reviews} />
        {!showReviewForm && <WriteReviewButton onWriteReview={handleWriteReviewClick} />}
      </div>
    </div>
  );
});

ReviewsSection.displayName = 'ReviewsSection';

export default ReviewsSection;
