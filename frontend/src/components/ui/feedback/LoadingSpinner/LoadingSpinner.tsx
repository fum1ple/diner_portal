import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text,
  className = '' 
}) => {
  const spinnerClass = size === 'sm' ? 'spinner-border-sm' : '';

  return (
    <div className={`text-center ${className}`}>
      <div className={`spinner-border ${spinnerClass}`} role="status">
        <span className="visually-hidden">読み込み中...</span>
      </div>
      {text && <p className="mt-2">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
