import React from 'react';
import { Review } from '@/types/api';
import ReviewCard from './ReviewCard';

interface ReviewListProps {
  reviews?: Review[]; // Make optional to handle loading/undefined states gracefully
  restaurantName?: string; // Optional: for a more descriptive "no reviews" message
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, restaurantName }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-10 px-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2zm3-7V3m10 4V3" />
        </svg>
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          No reviews yet{restaurantName ? ` for ${restaurantName}` : ''}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Be the first to share your thoughts and experiences!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
        Reviews ({reviews.length})
      </h2>
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;
