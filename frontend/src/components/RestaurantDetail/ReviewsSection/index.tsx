import React, { memo } from 'react';
import { Review } from '@/types/api';
import { glassmorphismCardDark } from '../styles/glassmorphism';
import ReviewsHeader from './ReviewsHeader';
import ReviewsList from './ReviewsList';
import WriteReviewButton from './WriteReviewButton';

interface ReviewsSectionProps {
  reviews: Review[];
  isVisible: boolean;
  onWriteReview: () => void;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = memo(({
  reviews,
  isVisible,
  onWriteReview
}) => {
  if (!isVisible) return null;

  return (
    <div className="lg:col-span-2 transition-all duration-700 transform animate-in slide-in-from-right">
      <div className={glassmorphismCardDark + ' p-10'}>
        <ReviewsHeader reviewCount={reviews.length} />
        <ReviewsList reviews={reviews} />
        <WriteReviewButton onWriteReview={onWriteReview} />
      </div>
    </div>
  );
});

ReviewsSection.displayName = 'ReviewsSection';

export default ReviewsSection;
