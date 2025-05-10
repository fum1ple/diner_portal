import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMyReviews, Review } from '../hooks/useMyPageData';

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="text-warning">
      {[...Array(5)].map((_, i) => (
        <i 
          key={i} 
          className={`bi ${i < rating ? 'bi-star-fill' : 'bi-star'}`}
          style={{ fontSize: '0.9rem' }}
        ></i>
      ))}
    </div>
  );
};

const ReviewCard = ({ review }: { review: Review }) => {
  const date = new Date(review.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="card shadow-sm border-0 rounded-4 mb-3">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center">
            <div className="flex-shrink-0" style={{ width: '60px', height: '60px' }}>
              <Image 
                src={review.restaurant.image_url || '/TOKIEATS-logo.png'} 
                alt={review.restaurant.name}
                width={60}
                height={60}
                className="rounded object-fit-cover"
                style={{ backgroundColor: '#f8f9fa' }}
              />
            </div>
            <div className="ms-3">
              <h5 className="fw-bold mb-1">
                <Link href={`/restaurants/${review.restaurant.id}`} className="text-decoration-none">
                  {review.restaurant.name}
                </Link>
              </h5>
              <div className="d-flex">
                <StarRating rating={review.rating} />
                <span className="ms-2 text-muted small">{date}</span>
              </div>
            </div>
          </div>
          <div className="dropdown">
            <button className="btn btn-sm btn-light rounded-circle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-three-dots-vertical"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><button className="dropdown-item" type="button">編集</button></li>
              <li><button className="dropdown-item text-danger" type="button">削除</button></li>
            </ul>
          </div>
        </div>
        <p className="mb-0">{review.content}</p>
      </div>
    </div>
  );
};

export default function MyReviews() {
  const { reviews, isLoading, error } = useMyReviews();

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

  if (reviews.length === 0) {
    return (
      <div className="text-center my-5 py-4 text-muted">
        <i className="bi bi-chat-square-text fs-1 mb-3 d-block"></i>
        <p className="mb-0">まだレビューはありません</p>
        <p className="small">レストランを訪問して、最初のレビューを書いてみましょう</p>
        <Link href="/restaurants" className="btn btn-primary mt-3">
          レストランを探す
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h4 className="fw-bold mb-4">マイレビュー</h4>
      <p className="text-muted mb-4">あなたが投稿したレビュー一覧です。</p>
      
      <div>
        {reviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
