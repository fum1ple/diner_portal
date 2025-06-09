'use client';
import React, { useState } from 'react';
import { useRestaurantDetail } from '../../../hooks/useRestaurantDetail';
import RestaurantDetail from '@/components/RestaurantDetail';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import Breadcrumb from '@/components/Breadcrumb';

interface PageProps {
  params: { id: string };
}

export default function RestaurantDetailPage({ params }: PageProps) {
  const { id } = params;
  const { data: restaurant, isLoading, error, refetch } = useRestaurantDetail(id);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    refetch();
  };

  if (isLoading) {
    return <main className="container mx-auto p-4"><LoadingSpinner message="店舗詳細を読み込み中..." /></main>;
  }

  if (error) {
    return <main className="container mx-auto p-4"><ErrorMessage message={error.message || '店舗詳細の読み込みに失敗しました。'} onRetry={() => refetch()} /></main>;
  }

  if (!restaurant) {
    return <main className="container mx-auto p-4"><ErrorMessage message="店舗が見つかりませんでした。" /></main>;
  }

  return (
    <main className="container mx-auto p-4">
      <Breadcrumb
        items={[
          { label: '店舗一覧', href: '/restaurants' },
          { label: restaurant.name },
        ]}
      />
      <div className="mt-6 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/3 lg:w-1/4 sticky top-6 space-y-6">
          <RestaurantDetail restaurant={restaurant} showReviews={false} />
          <button
            onClick={() => setShowReviewForm(prev => !prev)}
            className="w-full px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            {showReviewForm ? 'フォームを閉じる' : 'レビューを書く'}
          </button>
        </aside>

        <section className="w-full md:w-2/3 lg:w-3/4 space-y-8">
          {showReviewForm && (
            <ReviewForm restaurantId={id} onReviewSubmitted={handleReviewSubmitted} />
          )}
          <ReviewList reviews={restaurant.reviews} restaurantName={restaurant.name} />
        </section>
      </div>
    </main>
  );
}
