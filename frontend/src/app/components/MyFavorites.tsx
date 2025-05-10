import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFavorites, Restaurant } from '../hooks/useMyPageData';
import { removeFavorite } from '../api/apiClient';

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="text-warning me-2">
      {[...Array(5)].map((_, i) => (
        <i 
          key={i} 
          className={`bi ${i < rating ? 'bi-star-fill' : 'bi-star'}`}
          style={{ fontSize: '0.8rem' }}
        ></i>
      ))}
    </div>
  );
};

const FavoriteCard = ({ 
  restaurant, 
  onRemove 
}: { 
  restaurant: Restaurant, 
  onRemove: (id: number) => void 
}) => {
  const handleRemove = async () => {
    try {
      await removeFavorite(restaurant.id);
      onRemove(restaurant.id);
    } catch (error) {
      console.error('お気に入り削除エラー:', error);
      alert('お気に入りの削除に失敗しました');
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 mb-3">
      <div className="card-body p-3">
        <div className="row g-3">
          <div className="col-md-3 col-lg-2">
            <Image 
              src={restaurant.image_url || '/TOKIEATS-logo.png'} 
              alt={restaurant.name}
              width={100}
              height={100}
              className="rounded-3 object-fit-cover w-100 h-100"
              style={{ minHeight: '100px', backgroundColor: '#f8f9fa' }}
            />
          </div>
          <div className="col-md-9 col-lg-10">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="fw-bold mb-1">
                  <Link href={`/restaurants/${restaurant.id}`} className="text-decoration-none">
                    {restaurant.name}
                  </Link>
                </h5>
                <p className="text-muted small mb-2">
                  <i className="bi bi-geo-alt me-1"></i>{restaurant.address}
                </p>
                <div className="d-flex align-items-center mb-2">
                  <StarRating rating={restaurant.average_rating} />
                  <span className="text-muted small">
                    {restaurant.average_rating} ({restaurant.review_count}件のレビュー)
                  </span>
                </div>
              </div>
              <button 
                className="btn btn-sm btn-outline-danger"
                onClick={handleRemove}
              >
                <i className="bi bi-heart-fill me-1"></i>
                解除
              </button>
            </div>
            <p className="text-muted small mb-0">
              {restaurant.description ? (
                restaurant.description.length > 100 
                  ? `${restaurant.description.substring(0, 100)}...` 
                  : restaurant.description
              ) : '説明がありません'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MyFavorites() {
  const { favorites, isLoading, error } = useFavorites();
  const [favoritesList, setFavoritesList] = React.useState<Restaurant[]>([]);

  React.useEffect(() => {
    if (favorites) {
      setFavoritesList(favorites);
    }
  }, [favorites]);

  const handleRemoveFavorite = (id: number) => {
    setFavoritesList(prev => prev.filter(fav => fav.id !== id));
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
      </div>
    );
  }

  if (favoritesList.length === 0) {
    return (
      <div className="text-center my-5 py-4 text-muted">
        <i className="bi bi-heart fs-1 mb-3 d-block"></i>
        <p className="mb-0">まだお気に入りのレストランはありません</p>
        <p className="small">レストランをお気に入りに追加すると、ここに表示されます</p>
        <Link href="/restaurants" className="btn btn-primary mt-3">
          レストランを探す
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h4 className="fw-bold mb-4">お気に入りレストラン</h4>
      <p className="text-muted mb-4">お気に入りに登録した{favoritesList.length}件のレストラン一覧です。</p>
      
      <div>
        {favoritesList.map(restaurant => (
          <FavoriteCard 
            key={restaurant.id} 
            restaurant={restaurant} 
            onRemove={handleRemoveFavorite}
          />
        ))}
      </div>
    </div>
  );
}
