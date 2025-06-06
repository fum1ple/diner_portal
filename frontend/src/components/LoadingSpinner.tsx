import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = '読み込み中...' }) => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
    <p className="text-gray-600">{message}</p>
  </div>
);

export default LoadingSpinner;
