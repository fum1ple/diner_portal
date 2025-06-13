'use client';

import { useSearchParams } from 'next/navigation';
import RestaurantSearchForm from '@/components/restaurants/RestaurantSearchForm';
import SearchResultsContainer from '@/components/restaurants/SearchResultsContainer';
import { RestaurantSearchParams } from '@/types/restaurant';

export default function RestaurantSearchPage() {
  const searchParams = useSearchParams();

  // URLパラメータから検索パラメータを構築
  const buildSearchParams = (): RestaurantSearchParams | null => {
    const params: RestaurantSearchParams = {};
    const name = searchParams.get('name');
    const area = searchParams.get('area');
    const genre = searchParams.get('genre');

    if (name?.trim()) params.name = name.trim();
    if (area?.trim()) params.area = area.trim();
    if (genre?.trim()) params.genre = genre.trim();

    return Object.keys(params).length > 0 ? params : null;
  };

  const currentSearchParams = buildSearchParams();
  const hasSearched = currentSearchParams !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      {/* モバイル時のヘッダー */}
      <div className="lg:hidden">
        <div className={`transition-all duration-700 ${
          hasSearched 
            ? 'py-2 bg-white shadow-md' 
            : 'py-4 bg-gradient-to-br from-slate-100 via-teal-50 to-cyan-50'
        }`}>
          <div className="container mx-auto px-4">
            <div className={`text-center transition-all duration-700 ${
              hasSearched 
                ? 'mb-2' 
                : 'mb-4'
            }`}>
              <h1 className={`font-bold transition-all duration-700 ${
                hasSearched 
                  ? 'text-2xl text-slate-800 mb-1' 
                  : 'text-3xl text-slate-800 mb-3'
              }`}>
                レストラン検索
              </h1>
              {!hasSearched && (
                <p className="text-slate-600 text-lg">
                  お気に入りのレストランを見つけよう
                </p>
              )}
            </div>
            <RestaurantSearchForm />
          </div>
        </div>
        <div className="px-4 py-4">
          <SearchResultsContainer 
            searchParams={currentSearchParams}
            isVisible={hasSearched}
          />
        </div>
      </div>

      {/* デスクトップ時のレイアウト */}
      <div className="hidden lg:block h-screen overflow-hidden">
        {/* 検索前の中央レイアウト */}
        {!hasSearched && (
          <div className="h-full flex items-start justify-center pt-16">
            <div className="max-w-4xl mx-auto px-8 w-full">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-slate-900 mb-6">
                  レストラン検索
                </h1>
                <p className="text-slate-600 text-xl">
                  お気に入りのレストランを見つけよう
                </p>
              </div>
              <RestaurantSearchForm />
            </div>
          </div>
        )}

        {/* 検索後のサイドバーレイアウト */}
        {hasSearched && (
          <div className="flex h-full animate-fade-in">
            {/* サイドバー */}
            <div className="w-96 bg-white shadow-xl border-r border-gray-200 flex flex-col animate-slide-in-left">
              <div className="p-6 pt-4 border-b border-gray-100">
                <div className="text-center mb-4">
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    レストラン検索
                  </h1>
                  <p className="text-slate-600">
                    お気に入りのレストランを見つけよう
                  </p>
                </div>
                <RestaurantSearchForm />
              </div>
              
              <div className="p-6 bg-teal-50 border-b border-teal-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-teal-700">
                    検索結果
                  </span>
                  <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-semibold">
                    結果を表示中
                  </div>
                </div>
              </div>
            </div>

            {/* メインコンテンツエリア */}
            <div className="flex-1 overflow-hidden animate-slide-in-right">
              <div className="h-full overflow-y-auto p-8">
                <SearchResultsContainer 
                  searchParams={currentSearchParams}
                  isVisible={hasSearched}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}