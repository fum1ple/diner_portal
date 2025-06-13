'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useRestaurantDetail } from '../../../hooks/useRestaurantDetail';
import LoadingSpinner from '@/components/ui/feedback/LoadingSpinner';
import ErrorMessage from '@/components/ui/feedback/ErrorMessage';
import Breadcrumb from '@/components/ui/navigation/Breadcrumb';
import FirstReviewPrompt from '@/components/FirstReviewPrompt';

const RestaurantDetail = dynamic(() => import('@/components/RestaurantDetail'), {
  loading: () => <LoadingSpinner text="コンポーネントを読み込み中..." />,
  ssr: false
});

interface PageProps {
  params: { id: string };
}

export default function RestaurantDetailPage({ params }: PageProps) {
  const { id } = params;
  const searchParams = useSearchParams();
  const { data: restaurant, isLoading, error, refetch } = useRestaurantDetail(id);
  
  // 新規登録直後かどうかを判定
  const isNewlyRegistered = searchParams.get('newly_registered') === 'true';

  if (isLoading) {
    return <main className="container mx-auto p-4"><LoadingSpinner text="店舗詳細を読み込み中..." /></main>;
  }

  if (error) {
    return <main className="container mx-auto p-4"><ErrorMessage message={error.message || '店舗詳細の読み込みに失敗しました。'} onRetry={() => refetch()} /></main>;
  }

  if (!restaurant) {
    return <main className="container mx-auto p-4"><ErrorMessage message="店舗が見つかりませんでした。" /></main>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 to-emerald-50 py-8">
      <div className="w-full mx-auto px-6">
        <div className="max-w-6xl mx-auto mb-6">
          <Breadcrumb
            items={[
              { label: '店舗一覧', href: '/restaurants' },
              { label: restaurant.name },
            ]}
          />
        </div>
        <RestaurantDetail restaurant={restaurant} />
        
        {/* 新規登録直後の場合は初回レビュー促進プロンプトを表示 */}
        {isNewlyRegistered && (
          <div className="max-w-6xl mx-auto px-6">
            <FirstReviewPrompt 
              restaurantId={restaurant.id} 
              restaurantName={restaurant.name}
            />
          </div>
        )}
      </div>
    </main>
  );
}
