'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';
import MyReviews from '../components/MyReviews';
import MyFavorites from '../components/MyFavorites';
import MyRestaurants from '../components/MyRestaurants';

enum TabType {
  Dashboard = 'dashboard',
  Restaurants = 'restaurants',
  Reviews = 'reviews',
  Favorites = 'favorites',
}

export default function MyPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>(TabType.Dashboard);

  return (
    <div className="container py-4">
      <div className="row">
        {/* サイドバー */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body text-center p-4">
              <div className="mb-3">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session?.user?.name || 'ユーザー'}
                    width={80}
                    height={80}
                    className="rounded-circle border"
                  />
                ) : (
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                    {session?.user?.name?.[0] || 'U'}
                  </div>
                )}
              </div>
              <h5 className="fw-bold mb-1">{session?.user?.name || 'ユーザー'}</h5>
              <p className="text-muted small mb-3">{session?.user?.email || ''}</p>
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary">プロフィール編集</button>
              </div>
            </div>
          </div>
          
          <div className="list-group mt-4 rounded-4 shadow-sm">
            <button 
              className={`list-group-item list-group-item-action ${activeTab === TabType.Dashboard ? 'active' : ''}`}
              onClick={() => setActiveTab(TabType.Dashboard)}
            >
              <i className="bi bi-house-door me-2"></i>マイページホーム
            </button>
            <button 
              className={`list-group-item list-group-item-action ${activeTab === TabType.Restaurants ? 'active' : ''}`}
              onClick={() => setActiveTab(TabType.Restaurants)}
            >
              <i className="bi bi-shop me-2"></i>登録店舗
            </button>
            <button 
              className={`list-group-item list-group-item-action ${activeTab === TabType.Reviews ? 'active' : ''}`}
              onClick={() => setActiveTab(TabType.Reviews)}
            >
              <i className="bi bi-star me-2"></i>マイレビュー
            </button>
            <button 
              className={`list-group-item list-group-item-action ${activeTab === TabType.Favorites ? 'active' : ''}`}
              onClick={() => setActiveTab(TabType.Favorites)}
            >
              <i className="bi bi-heart me-2"></i>お気に入り
            </button>
          </div>
        </div>
        
        {/* メインコンテンツ */}
        <div className="col-md-8">
          {activeTab === TabType.Dashboard && (
            <>
              <div className="card shadow-sm border-0 rounded-4 mb-4">
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-4">ようこそ、{session?.user?.name || 'ユーザー'}さん</h4>
                  <p className="text-muted">
                    TOKIEATSへようこそ。このマイページではあなたのレビュー、お気に入りしたレストラン、
                    登録した店舗などを管理することができます。
                  </p>
                  <div className="row g-3 mt-2">
                    <div className="col-sm-4">
                      <div className="card border-light bg-light">
                        <div className="card-body text-center">
                          <i className="bi bi-shop fs-2 text-primary mb-2"></i>
                          <h6 className="fw-bold">登録店舗</h6>
                          <button 
                            className="btn btn-sm btn-outline-primary mt-2"
                            onClick={() => setActiveTab(TabType.Restaurants)}
                          >
                            管理する
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="card border-light bg-light">
                        <div className="card-body text-center">
                          <i className="bi bi-star fs-2 text-warning mb-2"></i>
                          <h6 className="fw-bold">レビュー</h6>
                          <button 
                            className="btn btn-sm btn-outline-primary mt-2"
                            onClick={() => setActiveTab(TabType.Reviews)}
                          >
                            確認する
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="card border-light bg-light">
                        <div className="card-body text-center">
                          <i className="bi bi-heart fs-2 text-danger mb-2"></i>
                          <h6 className="fw-bold">お気に入り</h6>
                          <button 
                            className="btn btn-sm btn-outline-primary mt-2"
                            onClick={() => setActiveTab(TabType.Favorites)}
                          >
                            表示する
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-header bg-transparent border-0 pt-4 px-4">
                  <h5 className="fw-bold mb-0">最近のアクティビティ</h5>
                </div>
                <div className="card-body p-4">
                  <div className="text-center my-5 py-4 text-muted">
                    <i className="bi bi-clipboard-data fs-1 mb-3 d-block"></i>
                    <p className="mb-0">まだアクティビティはありません</p>
                    <p className="small">レストランのレビューを書いたりお気に入りに追加したりすると、ここに表示されます</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === TabType.Restaurants && (
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-4">
                <MyRestaurants />
              </div>
            </div>
          )}

          {activeTab === TabType.Reviews && (
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-4">
                <MyReviews />
              </div>
            </div>
          )}

          {activeTab === TabType.Favorites && (
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-4">
                <MyFavorites />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
