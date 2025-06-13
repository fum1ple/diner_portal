'use client';

import React from 'react';
import Link from 'next/link';

interface FirstReviewPromptProps {
  restaurantId: number;
  restaurantName: string;
}

const FirstReviewPrompt: React.FC<FirstReviewPromptProps> = ({ restaurantId, restaurantName }) => (
    <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-6 mt-6">
      <div className="flex items-start gap-4">
        <div className="text-3xl">✨</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-orange-800 mb-2">
            新しい店舗を追加いただき、ありがとうございます！
          </h3>
          <p className="text-orange-700 mb-4">
            「{restaurantName}」の初回レビューを書いて、チームメンバーに体験を共有しませんか？
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/restaurants/${restaurantId}/reviews/new`}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              <span>📝</span>
              初回レビューを書く
            </Link>
            <Link
              href="/restaurants"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              <span>🔍</span>
              他の店舗を見る
            </Link>
          </div>
        </div>
      </div>
    </div>
);

export default FirstReviewPrompt;