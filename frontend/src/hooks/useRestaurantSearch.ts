import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { restaurantsApi } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { useTags } from './useTags';
import type { RestaurantSearchParams } from '@/types/restaurant';

export const useRestaurantSearch = () => {
  // 検索フォームの状態
  const [filters, setFilters] = useState({
    name: '',
    area: '',
    genre: ''
  });

  // 検索を実行するかどうかの状態
  const [shouldSearch, setShouldSearch] = useState(true);

  // タグデータの取得（useTagsを再利用）
  const { areaTags, genreTags, loading: tagsLoading } = useTags();

  // 検索クエリの作成
  const searchParams: RestaurantSearchParams = {
    ...(filters.name && { name: filters.name }),
    ...(filters.area && { area: filters.area }),
    ...(filters.genre && { genre: filters.genre }),
  };

  // 検索結果の取得
  const restaurantsQuery = useQuery({
    queryKey: queryKeys.restaurants.list(searchParams as Record<string, unknown>),
    queryFn: async () => {
      const result = await restaurantsApi.search(searchParams);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data || [];
    },
    enabled: shouldSearch, // shouldSearchがtrueの時のみクエリを実行
    staleTime: 2 * 60 * 1000, // 検索結果は2分間キャッシュ
    gcTime: 5 * 60 * 1000, // 5分間ガベージコレクション保持
  });

  // 検索実行
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setShouldSearch(true);
    // クエリキーが変わることで自動的に新しい検索が実行される
  }, []);

  // 検索条件クリア
  const handleClear = useCallback(() => {
    setFilters({ name: '', area: '', genre: '' });
    setShouldSearch(true);
    // 空の条件で検索が実行される
  }, []);

  // フィルター更新関数
  const updateFilter = useCallback((field: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    // フィルター変更時は自動検索しない（ユーザーが検索ボタンを押すまで待つ）
    setShouldSearch(false);
  }, []);

  // 手動リフェッチ
  const refetch = useCallback(() => {
    setShouldSearch(true);
    return restaurantsQuery.refetch();
  }, [restaurantsQuery]);

  // ローディング状態の統合
  const loading = tagsLoading || restaurantsQuery.isLoading;
  
  // エラー状態の統合
  const error = restaurantsQuery.error?.message || null;

  return {
    // 検索フォーム関連
    filters,
    updateFilter,
    handleSearch,
    handleClear,
    refetch,
    
    // タグデータ
    areaTags,
    genreTags,
    
    // 検索結果
    restaurants: restaurantsQuery.data || [],
    loading,
    error,
    
    // React Query状態
    isRefetching: restaurantsQuery.isRefetching,
    isFetching: restaurantsQuery.isFetching,
  };
};