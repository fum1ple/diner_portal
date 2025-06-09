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
      case 'sm': return 'text-lg';
      case 'lg': return 'text-3xl';
      default: return 'text-2xl';
    }
  };

  const getStarClass = (starIndex: number) => {
    const effectiveRating = readOnly ? value : (hoveredRating || value);
    const baseClass = `${getSizeClass()} transition-colors duration-150`;
    
    if (starIndex <= effectiveRating) {
      return `${baseClass} text-yellow-400`;
    }
    return `${baseClass} text-gray-300`;
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

  return (
    <div 
      className={`flex items-center space-x-1 ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          className={`${getStarClass(star)} ${
            readOnly 
              ? 'cursor-default' 
              : 'cursor-pointer hover:scale-110 transition-transform duration-150'
          }`}
          disabled={readOnly}
          aria-label={`${star}段階評価${readOnly ? '' : ' (クリックして設定)'}`}
        >
          ★
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
