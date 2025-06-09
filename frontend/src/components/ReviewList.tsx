import React, { memo, useMemo } from 'react';
import { Review } from '@/types/api';
import ReviewCard from './ReviewCard';

interface ReviewListProps {
  reviews?: Review[];
  restaurantName?: string;
}

const ReviewList: React.FC<ReviewListProps> = memo(({ reviews, restaurantName }) => {
  // レビューの存在チェックとメッセージをuseMemoでメモ化
  const reviewInfo = useMemo(() => {
    const hasReviews = reviews && reviews.length > 0;
    const emptyMessage = restaurantName 
      ? `${restaurantName}のレビューはまだありません` 
      : 'レビューはまだありません';
    
    return {
      hasReviews,
      emptyMessage,
      reviewCount: reviews?.length || 0
    };
  }, [reviews, restaurantName]);

  if (!reviewInfo.hasReviews) {
    return (
      <div className="text-center py-10 px-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2zm3-7V3m10 4V3" />
        </svg>
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          {reviewInfo.emptyMessage}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          あなたの体験を最初にシェアしてみませんか！
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
        レビュー ({reviewInfo.reviewCount}件)
      </h2>
      {reviews!.map(review => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
});

ReviewList.displayName = 'ReviewList';

export default ReviewList;
