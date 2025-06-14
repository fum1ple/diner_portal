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


  const handleStarClick = (rating: number) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  const handleStarHover = (rating: number) => {
    if (!readOnly) {
      setHoveredRating(rating);
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
    const decimal = effectiveRating % 1;
    
    if (starIndex <= Math.floor(effectiveRating)) {
      // 完全に塗りつぶされた星
      return (
        <span className={`${baseClass} text-yellow-400`}>
          ★
        </span>
      );
    } else if (starIndex === Math.floor(effectiveRating) + 1 && decimal >= 0.5) {
      // 半星表示（0.5以上の小数点がある場合）
      return (
        <span className={`${baseClass} relative inline-block`}>
          <span className="text-gray-300">★</span>
          <span 
            className="absolute inset-0 text-yellow-400 overflow-hidden"
            style={{ width: '50%' }}
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
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
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
