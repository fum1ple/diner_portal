'use client';

import Link from 'next/link';
import type { Restaurant } from '@/types/restaurant';
import { useFavoriteToggle } from '@/hooks/useFavoriteToggle';

interface RestaurantDetailSidebarProps {
  restaurant: Restaurant;
}

export default function RestaurantDetailSidebar({ restaurant }: RestaurantDetailSidebarProps) {
  const { isFavorited, toggleFavorite, isLoading: favoriteLoading } = useFavoriteToggle(restaurant.id, restaurant.is_favorited);

  const handleOpenGoogleMaps = () => {
    const googleMapsUrl = restaurant.address 
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name + ' ' + restaurant.address)}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name)}`;
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="lg:w-96 bg-white lg:shadow-xl lg:border-r border-gray-200 flex flex-col lg:animate-slide-in-left">
      {/* ヘッダー部分 */}
      <div className="p-6 pt-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <Link 
            href="/restaurants/search"
            className="flex items-center text-teal-600 hover:text-teal-700 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            検索に戻る
          </Link>
        </div>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {restaurant.name}
          </h1>
          <div className="flex items-center justify-center gap-2 mb-3">
            {restaurant.area_tag && (
              <span className="bg-teal-100 text-teal-800 px-3 py-1.5 rounded-full text-sm font-medium">
                {restaurant.area_tag.name}
              </span>
            )}
            {restaurant.genre_tag && (
              <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm font-medium">
                {restaurant.genre_tag.name}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* レストラン詳細情報 */}
      <div className="lg:flex-1 lg:overflow-y-auto p-6 space-y-6">
        {/* 評価情報 */}
        <div className="bg-teal-50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-teal-800 mb-3">評価情報</h3>
          <div className="space-y-2">
            {restaurant.average_rating > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">平均評価</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="text-lg font-semibold text-slate-900 ml-1">
                      {typeof restaurant.average_rating === 'number' ? restaurant.average_rating.toFixed(1) : '0.0'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">レビュー数</span>
                  <span className="text-sm font-medium text-slate-900">
                    {restaurant.review_count}件
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center text-slate-500 py-2">
                まだレビューがありません
              </div>
            )}
          </div>
        </div>

        {/* 基本情報 */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-800">基本情報</h3>
          
          {restaurant.address && (
            <div className="space-y-2">
              <div className="flex items-start">
                <svg className="w-4 h-4 text-slate-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm text-slate-600 leading-relaxed">
                  {restaurant.address}
                </span>
              </div>
            </div>
          )}

          {restaurant.phone_number && (
            <div className="flex items-center">
              <svg className="w-4 h-4 text-slate-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-sm text-slate-600">
                {restaurant.phone_number}
              </span>
            </div>
          )}

          {restaurant.website && (
            <div className="flex items-center">
              <svg className="w-4 h-4 text-slate-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <a 
                href={restaurant.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-teal-600 hover:text-teal-700 transition-colors duration-200"
              >
                公式サイト
              </a>
            </div>
          )}
        </div>

        {/* 説明 */}
        {restaurant.description && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-800">店舗について</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {restaurant.description}
            </p>
          </div>
        )}
      </div>

      {/* アクションボタン */}
      <div className="p-6 lg:border-t border-gray-100 space-y-3">
        <button
          onClick={handleOpenGoogleMaps}
          className="w-full px-4 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            地図で見る
          </div>
        </button>

        <button
          onClick={toggleFavorite}
          disabled={favoriteLoading}
          className={`w-full px-4 py-3 font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
            isFavorited
              ? 'bg-red-100 text-red-700 border-2 border-red-200 hover:bg-red-200 focus:ring-red-500'
              : 'bg-slate-100 text-slate-700 border-2 border-slate-200 hover:bg-slate-200 focus:ring-slate-500'
          } ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center justify-center">
            <span className={`mr-2 ${isFavorited ? 'text-red-500' : 'text-slate-400'}`}>
              {isFavorited ? '♥' : '♡'}
            </span>
            {isFavorited ? 'お気に入り解除' : 'お気に入り追加'}
          </div>
        </button>
      </div>
    </div>
  );
}