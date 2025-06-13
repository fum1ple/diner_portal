import React, { memo } from 'react';
import { MapPin, Eye, ArrowLeft } from 'lucide-react';
import { glassmorphismCard, buttonShineEffect, buttonGradientOverlay, gradientOverlay } from './styles/glassmorphism';
import FavoriteButton from '../FavoriteButton';

interface RestaurantActionsProps {
  showReviews: boolean;
  onOpenGoogleMaps: () => void;
  onToggleReviews: () => void;
  restaurant: import('@/types/restaurant').Restaurant;
}

const RestaurantActions: React.FC<RestaurantActionsProps> = memo(({
  showReviews,
  onOpenGoogleMaps,
  onToggleReviews,
  restaurant
}) => (
  <div className={`group ${glassmorphismCard} p-8 space-y-6`}>
    <div className={gradientOverlay}></div>
    <div className="relative z-10 space-y-6">
      {/* お気に入りボタン */}
      <div className="flex justify-end">
        <FavoriteButton restaurant={restaurant} />
      </div>
      {/* Google Maps ボタン */}
      <button
        onClick={onOpenGoogleMaps}
        className="group/btn w-full relative overflow-hidden bg-gradient-to-r from-cyan-600 via-cyan-700 to-cyan-800 hover:from-cyan-700 hover:via-cyan-800 hover:to-cyan-900 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30 active:scale-95"
      >
        <div className={buttonShineEffect}></div>
        <div className={buttonGradientOverlay('from-cyan-400/20 to-cyan-600/20')}></div>
        <div className="relative flex items-center justify-center gap-3">
          <div className="p-1 bg-white/20 rounded-lg">
            <MapPin className="w-6 h-6 transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:rotate-12" />
          </div>
          <span className="text-lg font-semibold">Google Mapで調べる</span>
        </div>
      </button>
      
      {/* レビュー切り替えボタン */}
      <button
        onClick={onToggleReviews}
        className="group/btn w-full relative overflow-hidden bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30 active:scale-95"
      >
        <div className={buttonShineEffect}></div>
        <div className={buttonGradientOverlay('from-emerald-400/20 to-green-600/20')}></div>
        <div className="relative flex items-center justify-center gap-3">
          <div className="p-1 bg-white/20 rounded-lg">
            {showReviews ? (
              <ArrowLeft className="w-6 h-6 transition-all duration-500 group-hover/btn:scale-110 group-hover/btn:-translate-x-2 group-hover/btn:rotate-12" />
            ) : (
              <Eye className="w-6 h-6 transition-all duration-500 group-hover/btn:scale-110 group-hover/btn:rotate-12" />
            )}
          </div>
          <span className="text-lg font-semibold transition-all duration-300">
            {showReviews ? '詳細に戻る' : 'レビューを見る'}
          </span>
        </div>
      </button>
    </div>
  </div>
));

RestaurantActions.displayName = 'RestaurantActions';

export default RestaurantActions;
