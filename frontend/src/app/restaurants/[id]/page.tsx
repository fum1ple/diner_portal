'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useRestaurantDetail } from '../../../hooks/useRestaurantDetail';
import LoadingSpinner from '@/components/ui/feedback/LoadingSpinner';
import ErrorMessage from '@/components/ui/feedback/ErrorMessage';
import RestaurantDetailSidebar from '@/components/restaurants/RestaurantDetailSidebar';
import RestaurantReviewsContainer from '@/components/restaurants/RestaurantReviewsContainer';
import FirstReviewPrompt from '@/components/FirstReviewPrompt';

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <LoadingSpinner text="店舗詳細を読み込み中..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <ErrorMessage message={error.message || '店舗詳細の読み込みに失敗しました。'} onRetry={() => refetch()} />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <ErrorMessage message="店舗が見つかりませんでした。" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      {/* モバイル時のレイアウト */}
      <div className="lg:hidden">
        <div className="min-h-screen">
          {/* モバイルヘッダー */}
          <div className="bg-white shadow-md p-4">
            <RestaurantDetailSidebar restaurant={restaurant} />
          </div>
          
          {/* モバイルレビュー */}
          <div className="p-4">
            <RestaurantReviewsContainer 
              restaurant={restaurant}
              isNewlyRegistered={isNewlyRegistered}
            />
          </div>
        </div>
      </div>

      {/* デスクトップ時のサイドバーレイアウト */}
      <div className="hidden lg:flex h-screen animate-fade-in">
        {/* 左サイドバー：店舗詳細情報 */}
        <RestaurantDetailSidebar restaurant={restaurant} />

        {/* 右メインコンテンツ：レビュー */}
        <div className="flex-1 overflow-hidden animate-slide-in-right">
          <div className="h-full overflow-y-auto">
            <RestaurantReviewsContainer 
              restaurant={restaurant}
              isNewlyRegistered={isNewlyRegistered}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
