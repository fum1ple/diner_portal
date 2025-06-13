import React, { memo } from 'react';
import { ArrowLeft, Eye } from 'lucide-react';
import { glassmorphismFloatingButton } from './styles/glassmorphism';

interface FloatingActionButtonProps {
  showReviews: boolean;
  onToggle: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = memo(({
  showReviews,
  onToggle
}) => (
  <div className="fixed top-20 right-6 z-20 lg:hidden">
    <button
      onClick={onToggle}
      className={glassmorphismFloatingButton}
    >
      {showReviews ? (
        <ArrowLeft className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
      ) : (
        <Eye className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
      )}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-pulse shadow-lg"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </button>
  </div>
));

FloatingActionButton.displayName = 'FloatingActionButton';

export default FloatingActionButton;
