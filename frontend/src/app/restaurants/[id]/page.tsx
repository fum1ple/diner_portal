'use client';

import { useRestaurantDetail } from '../../../hooks/useRestaurantDetail';
import RestaurantInfo from '../../../components/RestaurantInfo';
import RestaurantActions from '../../../components/RestaurantActions';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorMessage from '../../../components/ErrorMessage';
import Breadcrumb from '../../../components/Breadcrumb';

interface PageProps {
  params: { id: string };
}

export default function RestaurantDetailPage({ params }: PageProps) {
  const { id } = params;
  const { data: restaurant, isLoading, error, refetch } = useRestaurantDetail(id);

  if (isLoading) {
    return (
      <main className="p-8">
        <LoadingSpinner message="レストラン情報を読み込み中..." />
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-8">
        <ErrorMessage 
          message={error.message} 
          onRetry={() => refetch()}
        />
      </main>
    );
  }

  if (!restaurant) {
    return (
      <main className="p-8">
        <ErrorMessage message="レストランが見つかりません" />
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <Breadcrumb 
        items={[
          { label: '店舗一覧', href: '/restaurants' },
          { label: restaurant.name }
        ]} 
      />
      <div className="space-y-6">
        <RestaurantInfo restaurant={restaurant} />
        <RestaurantActions restaurant={restaurant} />
      </div>
    </main>
  );
}
