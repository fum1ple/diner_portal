import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMyRestaurants, Restaurant } from '../hooks/useMyPageData';

const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
  return (
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
          {[...Array(5)].map((_, i) => (
            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
              fill={i < Math.round(restaurant.average_rating) ? "#ffc107" : "#e0e0e0"} 
              className="bi bi-star-fill me-1" viewBox="0 0 16 16">
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
          ))}
          <span className="ms-1 text-muted">{restaurant.average_rating.toFixed(1)}</span>
          <span className="ms-1 text-muted">({restaurant.review_count}件)</span>
        </div>
        <p className="text-muted small mb-0">
          あなたが2024年3月15日に追加したレストランです。
        </p>
      </div>
    </div>
  );
};

export default function MyRestaurants() {
  const { restaurants, isLoading, error } = useMyRestaurants();
  
  // サンプルデータ（APIがまだ実装されていない場合のダミーデータ）
  const sampleRestaurants: Restaurant[] = [
    {
      id: 1,
      name: 'レストラン名 1',
      description: '美味しい料理と素晴らしいサービスが魅力です。',
      address: '東京都渋谷区',
      image_url: '/TOKIEATS-logo.png',
      user_id: 1,
      created_at: '2024-03-15T00:00:00.000Z',
      updated_at: '2024-03-15T00:00:00.000Z',
      user: { id: 1, name: '田中 太郎' },
      favorite_count: 12,
      review_count: 24,
      average_rating: 4.2
    },
    {
      id: 2,
      name: 'レストラン名 2',
      description: '美味しい料理と素晴らしいサービスが魅力です。',
      address: '東京都新宿区',
      image_url: '/TOKIEATS-logo.png',
      user_id: 1,
      created_at: '2024-03-15T00:00:00.000Z',
      updated_at: '2024-03-15T00:00:00.000Z',
      user: { id: 1, name: '田中 太郎' },
      favorite_count: 8,
      review_count: 24,
      average_rating: 4.2
    },
    {
      id: 3,
      name: 'レストラン名 3',
      description: '美味しい料理と素晴らしいサービスが魅力です。',
      address: '東京都中央区',
      image_url: '/TOKIEATS-logo.png',
      user_id: 1,
      created_at: '2024-03-15T00:00:00.000Z',
      updated_at: '2024-03-15T00:00:00.000Z',
      user: { id: 1, name: '田中 太郎' },
      favorite_count: 5,
      review_count: 24,
      average_rating: 4.2
    },
    {
      id: 4,
      name: 'レストラン名 4',
      description: '美味しい料理と素晴らしいサービスが魅力です。',
      address: '東京都港区',
      image_url: '/TOKIEATS-logo.png',
      user_id: 1,
      created_at: '2024-03-15T00:00:00.000Z',
      updated_at: '2024-03-15T00:00:00.000Z',
      user: { id: 1, name: '田中 太郎' },
      favorite_count: 3,
      review_count: 24,
      average_rating: 4.2
    }
  ];

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // 実際のデータがある場合はそれを使用し、なければサンプルデータを使用
  const displayRestaurants = restaurants.length > 0 ? restaurants : sampleRestaurants;

  if (error && displayRestaurants.length === 0) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
      </div>
    );
  }

  return (
    <div>
      {displayRestaurants.length === 0 ? (
        <div className="text-center my-5 py-4 text-muted">
          <i className="bi bi-shop fs-1 mb-3 d-block"></i>
          <p className="mb-0">まだ登録した店舗はありません</p>
          <p className="small">最初の店舗を登録してみましょう</p>
          <Link href="/restaurants/new" className="btn btn-primary mt-3">
            <i className="bi bi-plus-lg me-1"></i>
            店舗を登録する
          </Link>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {displayRestaurants.map(restaurant => (
            <div className="col" key={restaurant.id}>
              <RestaurantCard restaurant={restaurant} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
