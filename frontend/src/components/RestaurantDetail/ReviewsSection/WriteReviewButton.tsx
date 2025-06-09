import React, { memo } from 'react';
import { PenTool } from 'lucide-react';
import { buttonShineEffect, buttonGradientOverlay } from '../styles/glassmorphism';

interface WriteReviewButtonProps {
  onWriteReview: () => void;
}

const WriteReviewButton: React.FC<WriteReviewButtonProps> = memo(({ onWriteReview }) => (
  <div className="mt-10 pt-8 border-t border-gradient-to-r from-cyan-200/30 via-teal-200/30 to-emerald-200/30">
    <button
      className="group/write w-full relative overflow-hidden bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-700 hover:via-teal-700 hover:to-emerald-700 text-white font-bold py-6 px-10 rounded-3xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30 active:scale-95"
      onClick={onWriteReview}
    >
      <div className={buttonShineEffect.replace('group-hover/btn:', 'group-hover/write:')}></div>
      <div className={buttonGradientOverlay('from-cyan-400/20 via-teal-400/20 to-emerald-400/20').replace('group-hover/btn:', 'group-hover/write:')}></div>
      <div className="relative flex items-center justify-center gap-4">
        <div className="p-2 bg-white/20 rounded-xl">
          <PenTool className="w-7 h-7 transition-transform duration-300 group-hover/write:scale-110 group-hover/write:rotate-12" />
        </div>
        <span className="text-xl font-semibold">レビューを書く</span>
        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
      </div>
    </button>
  </div>
));

WriteReviewButton.displayName = 'WriteReviewButton';

export default WriteReviewButton;
