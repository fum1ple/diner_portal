import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="text-red-500 text-5xl mb-4">⚠️</div>
    <h2 className="text-xl font-semibold text-red-600 mb-2">エラーが発生しました</h2>
    <p className="text-gray-600 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        再試行
      </button>
    )}
  </div>
);

export default ErrorMessage;
