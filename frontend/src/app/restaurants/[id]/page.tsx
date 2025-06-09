'use client';
import React from 'react';
import { useRestaurantDetail } from '../../../hooks/useRestaurantDetail';
import RestaurantDetail from '@/components/RestaurantDetail';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import Breadcrumb from '@/components/Breadcrumb';

interface PageProps {
  params: { id: string };
}

export default function RestaurantDetailPage({ params }: PageProps) {
  const { id } = params;
  const { data: restaurant, isLoading, error, refetch } = useRestaurantDetail(id);
  // const [showReviewForm, setShowReviewForm] = useState(false);

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
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 to-emerald-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <Breadcrumb
          items={[
            { label: '店舗一覧', href: '/restaurants' },
            { label: restaurant.name },
          ]}
        />
        <RestaurantDetail restaurant={restaurant} />
      </div>
    </main>
  );
}
