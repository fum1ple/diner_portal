import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useFavorites, Restaurant } from '../hooks/useMyPageData';

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="d-inline-flex align-items-center">
      {[...Array(5)].map((_, i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
          fill={i < Math.round(rating) ? "#ffc107" : "#e0e0e0"} 
          className="bi bi-star-fill me-1" viewBox="0 0 16 16">
          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
        </svg>
      ))}
    </div>
  );
};

export default function MyFavorites() {
  const { favorites, isLoading, error } = useFavorites();
  const [favoritesList, setFavoritesList] = React.useState<Restaurant[]>([]);
  
  // サンプルデータ（APIがまだ実装されていない場合のダミーデータ）
  const sampleFavorites = React.useMemo(() => [
    {
      id: 1,
      name: 'レストラン名 1',
      description: '本格的なイタリア料理を提供する高級レストラン。シェフ自慢のパスタとピッツァがおすすめです。',
      address: '東京都港区赤坂1-2-3',
      image_url: '/TOKIEATS-logo.png',
      user_id: 2,
      created_at: '2025-03-15T00:00:00.000Z',
      updated_at: '2025-03-15T00:00:00.000Z',
      user: { id: 2, name: '山田シェフ' },
      favorite_count: 42,
      review_count: 38,
      average_rating: 4.7
    },
    {
      id: 2,
      name: 'レストラン名 2',
      description: '季節の食材を使った本格和食が楽しめる料亭。個室があり接待にも最適です。',
      address: '東京都中央区銀座4-5-6',
      image_url: '/TOKIEATS-logo.png',
      user_id: 3,
      created_at: '2025-02-20T00:00:00.000Z',
      updated_at: '2025-02-20T00:00:00.000Z',
      user: { id: 3, name: '鈴木オーナー' },
      favorite_count: 28,
      review_count: 22,
      average_rating: 4.5
    },
    {
      id: 3,
      name: 'レストラン名 3',
      description: '厳選した豆を使用した本格コーヒーとこだわりのスイーツが自慢のカフェ。',
      address: '東京都渋谷区神宮前7-8-9',
      image_url: '/TOKIEATS-logo.png',
      user_id: 4,
      created_at: '2025-01-10T00:00:00.000Z',
      updated_at: '2025-01-10T00:00:00.000Z',
      user: { id: 4, name: '佐藤バリスタ' },
      favorite_count: 36,
      review_count: 42,
      average_rating: 4.2
    },
    {
      id: 4,
      name: 'レストラン名 4',
      description: '本場の味を追求した中華料理店。北京ダックと小籠包が人気メニューです。',
      address: '東京都新宿区歌舞伎町1-2-3',
      image_url: '/TOKIEATS-logo.png',
      user_id: 5,
      created_at: '2024-12-05T00:00:00.000Z',
      updated_at: '2024-12-05T00:00:00.000Z',
      user: { id: 5, name: '李シェフ' },
      favorite_count: 52,
      review_count: 48,
      average_rating: 4.8
    }
  ], []);

  React.useEffect(() => {
    if (favorites && favorites.length > 0) {
      setFavoritesList(favorites);
    } else {
      // APIからデータが取得できない場合はサンプルデータを使用
      setFavoritesList(sampleFavorites);
    }
  }, [favorites, sampleFavorites]);

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

  // エラー発生時もサンプルデータがあれば表示する
  if (error && favoritesList.length === 0) {
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <p className="text-muted small mb-0">お気に入りに登録した{favoritesList.length}件のレストラン</p>
        </div>
      </div>
      
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {favoritesList.map(restaurant => (
          <div className="col" key={restaurant.id}>
            <div className="card border-0 bg-white rounded shadow-sm h-100">
              <div className="position-relative" style={{ height: '150px' }}>
                <Image 
                  src={restaurant.image_url || '/TOKIEATS-logo.png'} 
                  alt={restaurant.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="card-img-top object-fit-cover"
                  style={{ backgroundColor: '#f8f9fa' }}
                />
                <button
                  className="btn btn-sm btn-light rounded-circle position-absolute top-0 end-0 m-2"
                  onClick={() => handleRemoveFavorite(restaurant.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-heart-fill" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                  </svg>
                </button>
              </div>
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="fw-bold mb-0">
                    <Link href={`/restaurants/${restaurant.id}`} className="text-decoration-none text-dark">
                      {restaurant.name}
                    </Link>
                  </h5>
                  <Link href={`/restaurants/${restaurant.id}`} className="ms-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#6c757d" className="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                      <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                    </svg>
                  </Link>
                </div>
                <div className="mb-2 small text-muted">
                  {restaurant.address ? `${restaurant.address}` : 'ジャンル・エリア'}
                </div>
                <div className="d-flex align-items-center mb-3">
                  <StarRating rating={restaurant.average_rating} />
                  <span className="ms-1 text-muted">{restaurant.average_rating.toFixed(1)}</span>
                  <span className="ms-1 text-muted">({restaurant.review_count}件)</span>
                </div>
                <p className="text-muted small mb-0">
                  {restaurant.description && restaurant.description.length > 80 
                    ? `${restaurant.description.substring(0, 80)}...` 
                    : restaurant.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
