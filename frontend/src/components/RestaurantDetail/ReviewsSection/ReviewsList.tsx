import React, { memo } from 'react';
import { MessageCircle } from 'lucide-react';
import { Review } from '@/types/api';
import ReviewCard from '../../ReviewCard';
import { animationClasses } from '../styles/animations';

interface ReviewsListProps {
  reviews: Review[];
}

const ReviewsList: React.FC<ReviewsListProps> = memo(({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full flex items-center justify-center shadow-xl">
            <MessageCircle className="w-16 h-16 text-gray-400" />
          </div>
          <div className="absolute -top-2 -right-4 w-8 h-8 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full animate-bounce"></div>
        </div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">まだレビューがありません</h3>
        <p className="text-gray-500 text-lg mb-6">このレストランの最初のレビューを書いてみませんか？</p>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-cyan-300 scrollbar-track-transparent">
      {reviews.map(review => (
        <div
          key={review.id}
          className="group transform transition-all duration-500 hover:scale-[1.02]"
          style={{
            animation: animationClasses.fadeInUp
          }}
        >
          <div className="relative backdrop-blur-sm bg-white/70 rounded-3xl border border-white/60 overflow-hidden hover:shadow-2xl hover:bg-white/80 transition-all duration-300 group-hover:border-cyan-200/60">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-teal-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 p-6">
              <ReviewCard review={review} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

ReviewsList.displayName = 'ReviewsList';

export default ReviewsList;
