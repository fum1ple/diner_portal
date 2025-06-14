'use client';

import { useState } from 'react';
import { Restaurant } from '@/types/restaurant';
import { useRestaurantReviews } from '@/hooks/useRestaurantReviews';
import LoadingSpinner from '@/components/ui/feedback/LoadingSpinner';
import ErrorMessage from '@/components/ui/feedback/ErrorMessage';
import FirstReviewPrompt from '@/components/FirstReviewPrompt';
import ReviewForm from '@/components/restaurant/RestaurantDetail/ReviewsSection/ReviewForm';
import ReviewCard from '@/components/reviews/ReviewCard';

interface RestaurantReviewsContainerProps {
  restaurant: Restaurant;
  isNewlyRegistered: boolean;
}

export default function RestaurantReviewsContainer({ 
  restaurant, 
  isNewlyRegistered 
}: RestaurantReviewsContainerProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // React Queryを使用してレビューを取得
  const { 
    data: reviews = [], 
    isLoading: loading, 
    error: queryError,
    refetch 
  } = useRestaurantReviews(restaurant.id);

  const error = queryError?.message || null;

  const handleWriteReview = () => {
    setShowReviewForm(true);
  };

  const handleFirstReviewPrompt = () => {
    setShowReviewForm(true);
  };

  const handleSkipFirstReview = () => {
    // 初回レビュープロンプトを非表示にする処理は親コンポーネントで制御
  };

  const handleReviewSubmit = () => {
    setShowReviewForm(false);
    setShowSuccessMessage(true);
    
    // 成功メッセージを3秒後に非表示
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
    
    // React Queryでレビューリストを再取得
    refetch();
  };

  const handleCancelReview = () => {
    setShowReviewForm(false);
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* 成功メッセージ */}
        {showSuccessMessage && (
          <div className="mb-8 animate-fade-in-up">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 text-center shadow-xl">
              <div className="text-6xl mb-4 animate-pulse">🎉</div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                レビュー投稿完了！
              </h3>
              <p className="text-green-600 text-lg">
                貴重な体験を共有していただき、ありがとうございます
              </p>
              <div className="mt-4 text-sm text-green-500">
                💫 チームメンバーがあなたのレビューを参考にできます
              </div>
            </div>
          </div>
        )}

        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-slate-900">
              レビュー
            </h2>
            {!showReviewForm && reviews.length > 0 && (
              <button
                onClick={handleWriteReview}
                className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  レビューを書く
                </div>
              </button>
            )}
            {!showReviewForm && reviews.length === 0 && !isNewlyRegistered && (
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse">
                <div className="flex items-center gap-2">
                  <span>✨</span>
                  <span>初回レビュー募集中</span>
                </div>
              </div>
            )}
          </div>

          {reviews.length > 0 && (
            <div className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold inline-block">
              {reviews.length} 件のレビュー
            </div>
          )}
        </div>

        {/* レビューフォーム */}
        {showReviewForm && (
          <div className="mb-8 animate-fade-in-up">
            <div className="bg-gradient-to-br from-white to-teal-50/30 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-2 border-teal-200/50 relative overflow-hidden">
              {/* 背景装飾 */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400/5 to-blue-400/5 rounded-2xl"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-blue-400"></div>
              
              {/* フォームヘッダー */}
              <div className="relative z-10 mb-6 text-center">
                <div className="text-4xl mb-3 animate-bounce">✨</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  レビューを書く
                </h3>
                <p className="text-slate-600">
                  {restaurant.name}での体験を教えてください
                </p>
              </div>
              
              {/* フォーム本体 */}
              <div className="relative z-10">
                <ReviewForm 
                  restaurantId={restaurant.id} 
                  onReviewSubmit={handleReviewSubmit} 
                  onCancel={handleCancelReview} 
                />
              </div>
            </div>
          </div>
        )}

        {/* 新規登録プロンプト */}
        {isNewlyRegistered && !showReviewForm && (
          <div className="mb-8">
            <FirstReviewPrompt 
              restaurantName={restaurant.name}
              onWriteReview={handleFirstReviewPrompt}
              onSkip={handleSkipFirstReview}
            />
          </div>
        )}

        {/* コンテンツエリア */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-12 border border-gray-200/50">
              <LoadingSpinner text={isNewlyRegistered ? "初期化中..." : "レビューを読み込み中..."} />
              {isNewlyRegistered && (
                <p className="text-slate-500 text-sm mt-4 text-center">
                  店舗情報を準備しています
                </p>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <ErrorMessage message={error} />
          </div>
        )}

        {!showReviewForm && (!reviews || reviews.length === 0) && (
          <div className="py-8 lg:py-12">
            {/* メインプロモーション */}
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl lg:rounded-3xl shadow-2xl p-6 lg:p-12 border-2 border-orange-200/50 mb-6 lg:mb-8 relative overflow-hidden">
              {/* 背景装飾 */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 to-amber-400/5"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-300/20 to-amber-300/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-300/20 to-orange-300/20 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10 text-center">
                {/* アニメーションアイコン */}
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full shadow-lg animate-bounce">
                    <span className="text-3xl">✨</span>
                  </div>
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-bold text-orange-900 mb-4">
                  最初のレビューを書きませんか？
                </h3>
                
                <p className="text-base lg:text-lg text-orange-700 mb-6 lg:mb-8 max-w-2xl mx-auto leading-relaxed">
                  あなたの体験が<span className="font-semibold text-orange-800">チームの宝物</span>になります。<br className="hidden sm:block" />
                  <span className="font-medium">{restaurant.name}</span>での思い出を共有して、<br className="hidden sm:block" />
                  みんなの食事選びをもっと楽しくしましょう！
                </p>

                {/* メインCTAボタン */}
                <div className="mb-6 lg:mb-8">
                  <button
                    onClick={handleWriteReview}
                    className="group relative px-8 lg:px-12 py-3 lg:py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-base lg:text-lg rounded-xl lg:rounded-2xl shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex items-center justify-center">
                      <span className="text-2xl mr-3 group-hover:animate-pulse">🍽️</span>
                      <span>レビューを書く</span>
                      <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                    
                    {/* ホバー時の光沢効果 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 group-hover:animate-pulse rounded-2xl"></div>
                  </button>
                </div>

                {/* 動機付けメッセージ */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 text-center">
                  <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                    <div className="text-2xl mb-2">💫</div>
                    <div className="text-sm font-semibold text-orange-800">チームに貢献</div>
                    <div className="text-xs text-orange-600 mt-1">みんなの参考になります</div>
                  </div>
                  <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="text-sm font-semibold text-orange-800">簡単3分</div>
                    <div className="text-xs text-orange-600 mt-1">サクッと書けます</div>
                  </div>
                  <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                    <div className="text-2xl mb-2">🏆</div>
                    <div className="text-sm font-semibold text-orange-800">初回特典</div>
                    <div className="text-xs text-orange-600 mt-1">最初のレビュアーに！</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* レビューリスト */}
        {!loading && !error && reviews.length > 0 && !showReviewForm && (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div 
                key={review.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                  <ReviewCard review={review} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}