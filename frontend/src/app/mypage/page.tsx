'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ログインしていない場合はログインページにリダイレクト
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // ローディング中
  if (status === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">読み込み中...</span>
        </div>
      </div>
    );
  }

  // 未ログイン（リダイレクト中）
  if (!session) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">認証中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        {/* サイドバー */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body text-center p-4">
              <div className="mb-3">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user?.name || 'ユーザー'}
                    width={80}
                    height={80}
                    className="rounded-circle border"
                  />
                ) : (
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                    {session.user?.name?.[0] || 'U'}
                  </div>
                )}
              </div>
              <h5 className="fw-bold mb-1">{session.user?.name || 'ユーザー'}</h5>
              <p className="text-muted small mb-3">{session.user?.email || ''}</p>
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary">プロフィール編集</button>
              </div>
            </div>
          </div>
          
          <div className="list-group mt-4 rounded-4 shadow-sm">
            <a href="/mypage" className="list-group-item list-group-item-action active">
              <i className="bi bi-house-door me-2"></i>マイページホーム
            </a>
            <a href="/mypage/reviews" className="list-group-item list-group-item-action">
              <i className="bi bi-star me-2"></i>マイレビュー
            </a>
            <a href="/mypage/favorites" className="list-group-item list-group-item-action">
              <i className="bi bi-heart me-2"></i>お気に入り
            </a>
            <a href="/mypage/settings" className="list-group-item list-group-item-action">
              <i className="bi bi-gear me-2"></i>設定
            </a>
          </div>
        </div>
        
        {/* メインコンテンツ */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0 rounded-4 mb-4">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-4">ようこそ、{session.user?.name || 'ユーザー'}さん</h4>
              <p className="text-muted">
                TOKIEATSへようこそ。このマイページではあなたのレビュー、お気に入りしたレストラン、
                アカウント設定などを管理することができます。
              </p>
              <p>
                まだレビューがありません。レストランの訪問後、あなたの体験を共有しましょう！
              </p>
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
        </div>
      </div>
    </div>
  );
}