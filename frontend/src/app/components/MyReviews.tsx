import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMyReviews, Review } from '../hooks/useMyPageData';

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

const ReviewCard = ({ review }: { review: Review }) => {
  const date = new Date(review.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="card border-0 bg-white rounded shadow-sm h-100">
      <div className="position-relative" style={{ height: '150px' }}>
        <Image 
          src={review.restaurant.image_url || '/TOKIEATS-logo.png'} 
          alt={review.restaurant.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="card-img-top object-fit-cover"
          style={{ backgroundColor: '#f8f9fa' }}
        />
      </div>
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="fw-bold mb-0">
            <Link href={`/restaurants/${review.restaurant.id}`} className="text-decoration-none text-dark">
              {review.restaurant.name}
            </Link>
          </h5>
          <Link href={`/restaurants/${review.restaurant.id}`} className="ms-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#6c757d" className="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
              <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
            </svg>
          </Link>
        </div>
        <div className="mb-2 small text-muted">ジャンル・エリア</div>
        <div className="d-flex align-items-center mb-3">
          <StarRating rating={review.rating} />
          <span className="ms-1 text-muted">{review.rating.toFixed(1)}</span>
          <span className="ms-2 text-muted small">({date})</span>
        </div>
        <p className="text-muted small mb-0">{review.content}</p>
      </div>
    </div>
  );
};

export default function MyReviews() {
  const { reviews, isLoading, error } = useMyReviews();
  
  // サンプルデータ（APIがまだ実装されていない場合のダミーデータ）
  const sampleReviews: Review[] = [
    {
      id: 1,
      content: '接客も料理も素晴らしかったです。特に焼きたてのパンが美味しかったです。また行きたいと思います。',
      rating: 5,
      user_id: 1,
      restaurant_id: 1,
      created_at: '2025-05-01T00:00:00.000Z',
      updated_at: '2025-05-01T00:00:00.000Z',
      user: {
        id: 1,
        name: '田中太郎'
      },
      restaurant: {
        id: 1,
        name: 'レストラン東京',
        image_url: '/TOKIEATS-logo.png'
      }
    },
    {
      id: 2,
      content: '味は良かったですが、少し待ち時間が長かったです。混雑していたのでしょうがないかもしれません。',
      rating: 4,
      user_id: 1,
      restaurant_id: 2,
      created_at: '2025-04-15T00:00:00.000Z',
      updated_at: '2025-04-15T00:00:00.000Z',
      user: {
        id: 1,
        name: '田中太郎'
      },
      restaurant: {
        id: 2,
        name: 'カフェしぶや',
        image_url: '/TOKIEATS-logo.png'
      }
    },
    {
      id: 3,
      content: 'リーズナブルな価格で美味しい料理が食べられました。ランチセットがおすすめです。',
      rating: 4,
      user_id: 1,
      restaurant_id: 3,
      created_at: '2025-04-01T00:00:00.000Z',
      updated_at: '2025-04-01T00:00:00.000Z',
      user: {
        id: 1,
        name: '田中太郎'
      },
      restaurant: {
        id: 3,
        name: '和食レストラン京都',
        image_url: '/TOKIEATS-logo.png'
      }
    },
    {
      id: 4,
      content: '雰囲気が良く、デートにぴったりのレストランでした。少し値段は高めですが、それだけの価値はあります。',
      rating: 5,
      user_id: 1,
      restaurant_id: 4,
      created_at: '2025-03-10T00:00:00.000Z',
      updated_at: '2025-03-10T00:00:00.000Z',
      user: {
        id: 1,
        name: '田中太郎'
      },
      restaurant: {
        id: 4,
        name: 'イタリアンバル',
        image_url: '/TOKIEATS-logo.png'
      }
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
  const displayReviews = reviews.length > 0 ? reviews : sampleReviews;

  if (error && displayReviews.length === 0) {
    // エラーが発生し、かつサンプルデータもない場合のみエラーを表示
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
      </div>
    );
  }

  if (displayReviews.length === 0) {
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <p className="text-muted small mb-0">あなたが投稿した{displayReviews.length}件のレビュー</p>
        </div>
      </div>
      
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {displayReviews.map(review => (
          <div className="col" key={review.id}>
            <ReviewCard review={review} />
          </div>
        ))}
      </div>
    </div>
  );
}
