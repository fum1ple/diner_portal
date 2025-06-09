import React, { memo } from 'react';
import { MessageCircle } from 'lucide-react';

interface ReviewsHeaderProps {
  reviewCount: number;
}

const ReviewsHeader: React.FC<ReviewsHeaderProps> = memo(({ reviewCount }) => (
  <div className="flex items-center gap-6 mb-10">
    <div className="relative">
      <div className="p-4 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 rounded-3xl shadow-xl">
        <MessageCircle className="w-8 h-8 text-white" />
      </div>
      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
        <span className="text-xs font-bold text-white">{reviewCount}</span>
      </div>
    </div>
    <div className="flex-1">
      <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent mb-2">
        レビュー
      </h2>
    </div>
    <div className="px-6 py-3 bg-gradient-to-r from-cyan-100 via-teal-100 to-emerald-100 rounded-2xl border border-cyan-200/50 shadow-lg">
      <span className="text-cyan-700 font-bold text-lg">
        {reviewCount}件
      </span>
    </div>
  </div>
));

ReviewsHeader.displayName = 'ReviewsHeader';

export default ReviewsHeader;
