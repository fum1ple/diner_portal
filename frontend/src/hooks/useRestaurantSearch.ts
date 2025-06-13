import { useState, useEffect, useCallback } from 'react';
import type { Tag } from '@/types/tag';
import type { RestaurantSearchParams, RestaurantSearchState } from '@/types/restaurant';

export const useRestaurantSearch = () => {
  // 検索フォームの状態
  const [filters, setFilters] = useState({
    name: '',
    area: '',
    genre: ''
  });

  // タグデータの状態
  const [areaTags, setAreaTags] = useState<Tag[]>([]);
  const [genreTags, setGenreTags] = useState<Tag[]>([]);

  // 検索結果の状態
  const [searchState, setSearchState] = useState<RestaurantSearchState>({
    restaurants: [],
    loading: true,
    error: null
  });

  // タグ情報の取得
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const [areaRes, genreRes] = await Promise.all([
          fetch('/api/tags?category=area'),
          fetch('/api/tags?category=genre'),
        ]);

        if (!areaRes.ok || !genreRes.ok) {
          throw new Error('タグ情報の取得に失敗しました。');
        }

        const areaData = await areaRes.json();
        const genreData = await genreRes.json();

        setAreaTags(areaData);
        setGenreTags(genreData);
      } catch (error) {
        setSearchState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : '予期せぬエラーが発生しました。'
        }));
      }
    };
    fetchTags();
  }, []);

  // 店舗検索の実行
  const fetchRestaurants = useCallback(async (searchParams?: RestaurantSearchParams) => {
    setSearchState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const query = new URLSearchParams();
      if (searchParams?.name) query.append('name', searchParams.name);
      if (searchParams?.area) query.append('area', searchParams.area);
      if (searchParams?.genre) query.append('genre', searchParams.genre);
      
      const res = await fetch(`/api/restaurants?${query.toString()}`);
      if (!res.ok) throw new Error('店舗情報の取得に失敗しました。');
      
      const data = await res.json();
      setSearchState(prev => ({
        ...prev,
        restaurants: data,
        loading: false
      }));
    } catch (error) {
      setSearchState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '予期せぬエラーが発生しました。',
        restaurants: [],
        loading: false
      }));
    }
  }, []);

  // 初回データ取得
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  // 検索実行
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    fetchRestaurants(filters);
  }, [filters, fetchRestaurants]);

  // 検索条件クリア
  const handleClear = useCallback(() => {
    setFilters({ name: '', area: '', genre: '' });
    fetchRestaurants();
  }, [fetchRestaurants]);

  // フィルター更新関数
  const updateFilter = useCallback((field: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  return {
    // 検索フォーム関連
    filters,
    updateFilter,
    handleSearch,
    handleClear,
    
    // タグデータ
    areaTags,
    genreTags,
    
    // 検索結果
    restaurants: searchState.restaurants,
    loading: searchState.loading,
    error: searchState.error
  };
};