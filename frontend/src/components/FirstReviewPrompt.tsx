'use client';

import React, { useState, useEffect } from 'react';

interface FirstReviewPromptProps {
  restaurantId: number;
  restaurantName: string;
  onWriteReview?: () => void;
  onSkip?: () => void;
}

const FirstReviewPrompt: React.FC<FirstReviewPromptProps> = ({ 
  restaurantId, 
  restaurantName, 
  onWriteReview,
  onSkip 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // アニメーションの段階的表示
    const timer1 = setTimeout(() => setIsVisible(true), 300);
    const timer2 = setTimeout(() => setStep(1), 800);
    const timer3 = setTimeout(() => setStep(2), 1300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleWriteReview = () => {
    if (onWriteReview) {
      onWriteReview();
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  return (
    <div className={`transform transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
    }`}>
      <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-8 shadow-xl">
        <div className="text-center">
          {/* ステップ1: アイコンとお祝いメッセージ */}
          <div className={`transform transition-all duration-500 ${
            step >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h3 className="text-2xl font-bold text-orange-800 mb-3">
              店舗登録完了！
            </h3>
          </div>

          {/* ステップ2: 説明とレストラン名 */}
          <div className={`transform transition-all duration-500 delay-300 ${
            step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="bg-white/70 rounded-xl p-4 mb-6">
              <p className="text-orange-700 text-lg mb-2">
                「<span className="font-semibold text-orange-900">{restaurantName}</span>」
              </p>
              <p className="text-orange-600">
                初回レビューを書いて、チームに体験を共有しませんか？
              </p>
            </div>
          </div>

          {/* ステップ3: アクションボタン */}
          <div className={`transform transition-all duration-500 delay-500 ${
            step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWriteReview}
                className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <span className="text-xl group-hover:animate-pulse">✍️</span>
                <span>今すぐレビューを書く</span>
              </button>
              
              <button
                onClick={handleSkip}
                className="bg-white/80 hover:bg-white text-orange-600 hover:text-orange-700 font-medium py-4 px-6 rounded-xl transition-all duration-300 border border-orange-200 hover:border-orange-300 flex items-center justify-center gap-2"
              >
                <span>後で書く</span>
              </button>
            </div>

            {/* 後押しメッセージ */}
            <div className="mt-4 text-sm text-orange-500">
              💡 初回レビューは他のメンバーの参考になります
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstReviewPrompt;