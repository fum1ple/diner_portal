import React, { memo, useState, useEffect } from 'react';
import { Review } from '@/types/api';
import { glassmorphismCardDark } from '../styles/glassmorphism';
import { ANIMATIONS } from '../styles/constants';
import ReviewsHeader from './ReviewsHeader';
import ReviewsList from './ReviewsList';
import WriteReviewButton from './WriteReviewButton';
import ReviewForm from './ReviewForm';

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
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 700);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const handleWriteReviewClick = () => {
    setShowReviewForm(true);
  };

  const handleReviewSubmit = () => {
    setShowReviewForm(false);
  };

  const handleCancelReview = () => {
    setShowReviewForm(false);
  };

  return (
    <div className={`lg:col-span-2 transition-all duration-700 transform ${
      isAnimating ? ANIMATIONS.slideInRight : ANIMATIONS.fadeIn
    }`}>
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
