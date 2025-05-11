'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';
import MyReviews from '../components/MyReviews';
import MyFavorites from '../components/MyFavorites';
import MyRestaurants from '../components/MyRestaurants';

enum TabType {
  AddedRestaurants = 'added-restaurants',
  ReviewedRestaurants = 'reviewed-restaurants',
  Favorites = 'favorites',
}

export default function MyPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>(TabType.AddedRestaurants);

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* サイドバー - プロフィール情報 */}
        <div className="col-lg-3">
          <div className="bg-white rounded shadow-sm p-4 text-center">
            <div className="mb-4">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session?.user?.name || 'ユーザー'}
                  width={120}
                  height={120}
                  className="rounded-circle border"
                />
              ) : (
                <div 
                  className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto" 
                  style={{ width: '120px', height: '120px', fontSize: '3rem' }}
                >
                  {session?.user?.name?.[0] || 'U'}
                </div>
              )}
            </div>
            
            <h5 className="mb-1 fw-bold">{session?.user?.name || '田中 太郎'}</h5>
            <p className="text-muted small mb-3">{session?.user?.email || 'tokieatsdemo@gmail.com'}</p>
            
            <button className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
              </svg>
              プロフィール編集
            </button>
            
            <div className="mt-4 pt-3 border-top">
              <div className="d-flex align-items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt" viewBox="0 0 16 16">
                  <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
                  <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                </svg>
                <span className="ms-2 text-muted small">東京都渋谷区</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
                  <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                </svg>
                <span className="ms-2 text-muted small">最終ログイン: 今日</span>
              </div>
              <div className="d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar3" viewBox="0 0 16 16">
                  <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z"/>
                  <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                </svg>
                <span className="ms-2 text-muted small">登録日: 2023年10月15日</span>
              </div>
            </div>
          </div>
          
          {/* アクティビティ情報 */}
          <div className="bg-white rounded shadow-sm p-4 mt-4">
            <h6 className="fw-bold mb-3">アクティビティ</h6>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted small">追加した店舗</span>
              <span className="fw-medium">5</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted small">評価した店舗</span>
              <span className="fw-medium">12</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted small">お気に入り</span>
              <span className="fw-medium">8</span>
            </div>
          </div>
        </div>
        
        {/* メインコンテンツ */}
        <div className="col-lg-9">
          {/* タブナビゲーション */}
          <div className="bg-white rounded shadow-sm p-3 mb-4">
            <ul className="nav nav-tabs border-0">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === TabType.AddedRestaurants ? 'active fw-medium' : 'text-muted'}`}
                  onClick={() => setActiveTab(TabType.AddedRestaurants)}
                >
                  追加した店舗
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === TabType.ReviewedRestaurants ? 'active fw-medium' : 'text-muted'}`}
                  onClick={() => setActiveTab(TabType.ReviewedRestaurants)}
                >
                  評価した店舗
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === TabType.Favorites ? 'active fw-medium' : 'text-muted'}`}
                  onClick={() => setActiveTab(TabType.Favorites)}
                >
                  お気に入り
                </button>
              </li>
            </ul>
          </div>
          
          {/* タブコンテンツ */}
          <div className="bg-white rounded shadow-sm p-4">
            {activeTab === TabType.AddedRestaurants && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0">追加した店舗</h5>
                  <button className="btn btn-primary d-flex align-items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                    </svg>
                    新しい店を追加
                  </button>
                </div>
                <MyRestaurants />
              </div>
            )}
            
            {activeTab === TabType.ReviewedRestaurants && (
              <div>
                <h5 className="fw-bold mb-4">評価した店舗</h5>
                <MyReviews />
              </div>
            )}
            
            {activeTab === TabType.Favorites && (
              <div>
                <h5 className="fw-bold mb-4">お気に入り</h5>
                <MyFavorites />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
