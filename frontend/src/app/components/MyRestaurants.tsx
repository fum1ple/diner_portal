import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMyRestaurants, Restaurant } from '../hooks/useMyPageData';

const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {

  return (
    <div className="card border-0 rounded-3 mb-3">
      <div className="row g-0">
        <div className="col-md-6">
          <div className="position-relative" style={{ height: '220px' }}>
            <Image 
              src={restaurant.image_url || '/TOKIEATS-logo.png'} 
              alt={restaurant.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-fit-cover rounded-start"
            />
          </div>
        </div>
        <div className="col-md-6 d-flex flex-column">
          <div className="card-body h-100 d-flex flex-column">
            <div className="d-flex justify-content-between mb-2">
              <h5 className="card-title fw-bold">{restaurant.name}</h5>
              <Link href={`/restaurants/${restaurant.id}`} className="text-decoration-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-up-right-square" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707l-4.096 4.096z"/>
                </svg>
              </Link>
            </div>
            
            <p className="text-muted small mb-3">
              <span className="d-block">ジャンル・エリア</span>
              <div className="d-flex align-items-center mt-1">
                {Array(5).fill(0).map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={i < Math.round(restaurant.average_rating) ? "gold" : "lightgray"} className="bi bi-star-fill" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                  </svg>
                ))}
                <span className="ms-1">{restaurant.average_rating.toFixed(1)}</span>
                <span className="ms-2 text-muted">({restaurant.review_count}件)</span>
              </div>
            </p>
            
            <p className="card-text small mb-3 flex-grow-1">
              あなたが2024年3月15日に追加したレストランです。美味しい料理と素晴らしいサービスが魅力です。
            </p>
            
            <Link href={`/restaurants/${restaurant.id}/edit`} className="align-self-start btn btn-outline-primary btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil me-1" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
              </svg>
              編集
            </Link>
          </div>
        </div>
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

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
      </div>
    );
  }

  // 実際のデータがある場合はそれを使用し、なければサンプルデータを使用
  const displayRestaurants = restaurants.length > 0 ? restaurants : sampleRestaurants;

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
        <div className="row row-cols-1 g-4">
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
