import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { Restaurant } from '@/types';

interface FavoriteButtonProps {
  restaurant: Restaurant;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ restaurant, className }) => {
  const [isFavorited, setIsFavorited] = useState(restaurant.is_favorited);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      const method = isFavorited ? 'DELETE' : 'POST';
    const res = await fetch(`/api/restaurants/${restaurant.id}/favorite`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
      if (res.status === 401) {
        router.push('/auth/signin');
        return;
      }
      if (res.ok) {
        setIsFavorited(!isFavorited);
      } else {
        // エラー時は何もしない or トースト表示など
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      aria-label={isFavorited ? 'お気に入り解除' : 'お気に入り登録'}
      onClick={handleClick}
      disabled={loading}
      className={`group flex items-center gap-1 ${className || ''}`}
    >
      <Heart
        className={`w-7 h-7 transition-colors duration-200 ${isFavorited ? 'text-pink-500 fill-pink-400' : 'text-gray-400 group-hover:text-pink-400'}`}
        fill={isFavorited ? '#f472b6' : 'none'}
      />
      <span className="sr-only">{isFavorited ? 'お気に入り解除' : 'お気に入り登録'}</span>
    </button>
  );
};

export default FavoriteButton;
