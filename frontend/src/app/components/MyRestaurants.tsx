import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMyRestaurants, Restaurant } from '../hooks/useMyPageData';

const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
  const date = new Date(restaurant.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

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
                <div className="d-flex align-items-center text-muted small mb-2">
                  <div className="me-3">
                    <i className="bi bi-star-fill text-warning me-1"></i>
                    {restaurant.average_rating} ({restaurant.review_count}件)
                  </div>
                  <div className="me-3">
                    <i className="bi bi-heart-fill text-danger me-1"></i>
                    {restaurant.favorite_count}
                  </div>
                  <div>
                    <i className="bi bi-calendar3 me-1"></i>
                    {date}
                  </div>
                </div>
              </div>
              <div>
                <Link href={`/restaurants/${restaurant.id}/edit`} className="btn btn-sm btn-outline-primary me-2">
                  <i className="bi bi-pencil me-1"></i>
                  編集
                </Link>
              </div>
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

export default function MyRestaurants() {
  const { restaurants, isLoading, error } = useMyRestaurants();

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

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">登録店舗</h4>
        <Link href="/restaurants/new" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1"></i>
          新規登録
        </Link>
      </div>

      {restaurants.length === 0 ? (
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
        <div>
          <p className="text-muted mb-4">あなたが登録した{restaurants.length}件の店舗一覧です。</p>
          {restaurants.map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
}
