import Image from 'next/image';
import { Review } from '@/types/review';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < rating ? 'text-yellow-500' : 'text-gray-300'}>
      ★
    </span>
  ));

  return (
    <div className="space-y-4">
      {/* ヘッダー */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="font-semibold text-slate-900 mr-3">
              {review.user?.name || '匿名ユーザー'}
            </span>
            <div className="flex items-center">
              {renderStars(review.rating)}
            </div>
          </div>
          <div className="text-sm text-slate-500">
            {formatDate(review.created_at)}
          </div>
        </div>
      </div>

      {/* レビュー内容 */}
      {review.comment && (
        <div className="bg-slate-50 rounded-lg p-4">
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {review.comment}
          </p>
        </div>
      )}
      {/* 画像があれば表示 */}
      {review.image_url && (
        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 max-w-xs relative">
          <Image
            src={review.image_url}
            alt="レビュー画像"
            fill
            className="object-cover hover:scale-105 transition-transform duration-200"
          />
        </div>
      )}
    </div>
  );
}