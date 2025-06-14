import React, { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  value, 
  onChange, 
  readOnly = false, 
  size = 'md',
  className = '' 
}) => {
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'text-base';
      case 'lg': return 'text-3xl';
      default: return 'text-2xl';
    }
  };


  const handleStarClick = (starIndex: number, event: React.MouseEvent<HTMLButtonElement>) => {
    if (!readOnly && onChange) {
      const rect = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const starWidth = rect.width;
      const percentage = clickX / starWidth;
      
      // 0.5刻みで評価を設定（クリック位置に応じて整数か0.5を選択）
      const baseRating = starIndex - 1;
      const newRating = percentage <= 0.5 ? baseRating + 0.5 : starIndex;
      
      onChange(Math.max(0.5, Math.min(5.0, newRating)));
    }
  };

  const handleStarHover = (starIndex: number, event: React.MouseEvent<HTMLButtonElement>) => {
    if (!readOnly) {
      const rect = event.currentTarget.getBoundingClientRect();
      const hoverX = event.clientX - rect.left;
      const starWidth = rect.width;
      const percentage = hoverX / starWidth;
      
      // ホバー時も0.5刻みで表示
      const baseRating = starIndex - 1;
      const hoverRating = percentage <= 0.5 ? baseRating + 0.5 : starIndex;
      
      setHoveredRating(Math.max(0.5, Math.min(5.0, hoverRating)));
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoveredRating(0);
    }
  };

  const renderStar = (starIndex: number) => {
    const effectiveRating = readOnly ? value : (hoveredRating || value);
    const baseClass = `${getSizeClass()} transition-colors duration-150`;
    
    if (starIndex <= Math.floor(effectiveRating)) {
      // 完全に塗りつぶされた星
      return (
        <span className={`${baseClass} text-yellow-400`}>
          ★
        </span>
      );
    } else if (starIndex === Math.ceil(effectiveRating) && effectiveRating % 1 !== 0) {
      // 部分的に塗りつぶされた星（小数点に応じた割合で塗りつぶし）
      const percentage = (effectiveRating % 1) * 100;
      return (
        <span className={`${baseClass} relative inline-block`}>
          <span className="text-gray-300">★</span>
          <span 
            className="absolute inset-0 text-yellow-400 overflow-hidden"
            style={{ width: `${percentage}%` }}
          >
            ★
          </span>
        </span>
      );
    } else {
      // 空の星
      return (
        <span className={`${baseClass} text-gray-300`}>
          ★
        </span>
      );
    }
  };

  return (
    <div 
      className={`flex items-center space-x-0.5 ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={e => handleStarClick(star, e)}
          onMouseMove={e => handleStarHover(star, e)}
          className={`${
            readOnly 
              ? 'cursor-default' 
              : 'cursor-pointer hover:scale-110 transition-transform duration-150'
          }`}
          disabled={readOnly}
          aria-label={`${star}段階評価${readOnly ? '' : ' (クリックして設定)'}`}
        >
          {renderStar(star)}
        </button>
      ))}
      {!readOnly && (
        <span className="ml-2 text-sm text-gray-600">
          {hoveredRating || value || 0}/5
        </span>
      )}
    </div>
  );
};

export default StarRating;
