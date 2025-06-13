'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import SearchForm from '@/components/SearchForm';
import SearchResultsContainer from '@/components/restaurants/SearchResultsContainer';
import { useRestaurantSearch } from '@/hooks/useRestaurantSearch';

export default function RestaurantListPage() {
  const router = useRouter();
  const {
    filters,
    updateFilter,
    handleSearch,
    handleClear,
    areaTags,
    genreTags,
    restaurants,
    loading,
    error
  } = useRestaurantSearch();

  // 店舗追加ボタンクリック時の処理（検索条件を引き継ぎ）
  const handleAddRestaurant = () => {
    const params = new URLSearchParams();
    if (filters.name) params.set('name', filters.name);
    if (filters.area) params.set('area', filters.area);
    if (filters.genre) params.set('genre', filters.genre);
    
    router.push(`/restaurants/new?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">店舗検索</h1>
        
        <SearchForm
          name={filters.name}
          area={filters.area}
          genre={filters.genre}
          areaTags={areaTags}
          genreTags={genreTags}
          loading={loading}
          onNameChange={value => updateFilter('name', value)}
          onAreaChange={value => updateFilter('area', value)}
          onGenreChange={value => updateFilter('genre', value)}
          onSubmit={handleSearch}
          onClear={handleClear}
        />

        <SearchResultsContainer
          restaurants={restaurants}
          loading={loading}
          error={error}
          filters={filters}
          onAddRestaurant={handleAddRestaurant}
          onClearSearch={handleClear}
        />
      </div>
    </main>
  );
}

