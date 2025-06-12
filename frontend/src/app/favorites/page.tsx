'use client';

import { useState, useEffect } from 'react';
import { Restaurant } from '@/types';
import FavoriteItem from '@/components/FavoriteItem';
import ProtectedPage from '@/components/ProtectedPage';
import { authenticatedFetch } from '@/utils/api';

// お気に入り一覧ページのメインコンテンツ
const FavoritesPageContent = () => {
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        const response = await authenticatedFetch('/api/favorites');
        
        if (!response.ok) {
          throw new Error('お気に入り一覧の取得に失敗しました');
        }

        const data: Restaurant[] = await response.json();
        setFavorites(data);
      } catch (err) {
        console.error('予期せぬエラーが発生しました:', err);
        setError('データの取得に失敗しました。時間をおいて再度お試しください。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-teal-700">保存したお店</h1>
      {favorites.length === 0 ? (
        <div className="text-gray-500">お気に入りはありません</div>
      ) : (
        <ul className="space-y-4">
          {favorites.map(restaurant => (
            <FavoriteItem
              key={restaurant.id}
              restaurant={restaurant}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

// お気に入り一覧ページ
export default function FavoritesPage() {
  return (
    <ProtectedPage>
      <FavoritesPageContent />
    </ProtectedPage>
  );
}