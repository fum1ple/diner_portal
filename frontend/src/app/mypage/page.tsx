'use client';

import { useAuth, useJwtToken } from '@/hooks/useAuth';
import { getUserProfile, updateUserProfile } from '@/utils/api';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import ProtectedPage from '@/components/ProtectedPage';

function MyPageContent() {
  const { user, isLoading } = useAuth();
  const { token, hasToken, isValid } = useJwtToken();
  const [profile, setProfile] = useState<any>(null);
  const [updateData, setUpdateData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showApiTest, setShowApiTest] = useState(false);

  // フォームデータの初期化
  useEffect(() => {
    if (user) {
      setUpdateData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  // プロフィール取得
  const handleGetProfile = async () => {
    if (!hasToken || !isValid) {
      setMessage('エラー: 有効なJWTトークンがありません');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const data = await getUserProfile();
      setProfile(data);
      setMessage('プロフィール取得成功');
    } catch (error) {
      setMessage(`エラー: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // プロフィール更新
  const handleUpdateProfile = async () => {
    if (!hasToken || !isValid) {
      setMessage('エラー: 有効なJWTトークンがありません');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const data = await updateUserProfile(updateData);
      setProfile(data);
      setMessage('プロフィール更新成功');
    } catch (error) {
      setMessage(`エラー: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container py-5">
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="row">
          {/* サイドバー */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt="プロフィール画像"
                      width={80}
                      height={80}
                      className="rounded-circle"
                    />
                  ) : (
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto" 
                         style={{ width: '80px', height: '80px' }}>
                      <span className="text-white fw-bold fs-2">
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                </div>
                <h5 className="fw-bold mb-1">{user?.name || 'ユーザー名未設定'}</h5>
                <p className="text-muted small mb-3">{user?.email}</p>
                
                {/* 認証状態 */}
                <div className="mb-3">
                  <div className={`badge ${hasToken && isValid ? 'bg-success' : 'bg-warning'} mb-2`}>
                    {hasToken && isValid ? 'JWT認証済み' : 'JWT未取得'}
                  </div>
                  {hasToken && (
                    <div className="small text-muted">
                      トークン: {token?.substring(0, 20)}...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* API連携テスト */}
            <div className="card shadow-sm border-0 rounded-4 mt-3">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">Rails API連携テスト</h6>
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setShowApiTest(!showApiTest)}
                  >
                    {showApiTest ? 'テスト非表示' : 'テスト表示'}
                  </button>
                  {showApiTest && (
                    <>
                      <button
                        onClick={handleGetProfile}
                        disabled={loading || !hasToken || !isValid}
                        className="btn btn-success btn-sm"
                      >
                        {loading ? '取得中...' : 'プロフィール取得'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="col-md-8">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">プロフィール設定</h4>
                
                <form onSubmit={(e) => {e.preventDefault(); handleUpdateProfile();}}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label">名前</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={updateData.name}
                        onChange={(e) => setUpdateData({...updateData, name: e.target.value})}
                        placeholder="山田太郎"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">メールアドレス</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={updateData.email}
                        onChange={(e) => setUpdateData({...updateData, email: e.target.value})}
                        placeholder="yamada@tokium.jp"
                      />
                    </div>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading || !hasToken || !isValid}
                    >
                      {loading ? '更新中...' : 'プロフィール更新'}
                    </button>
                  </div>
                </form>

                {/* メッセージ表示 */}
                {message && (
                  <div className={`mt-3 alert ${message.includes('エラー') ? 'alert-danger' : 'alert-success'}`}>
                    {message}
                  </div>
                )}

                {/* API取得結果表示 */}
                {profile && showApiTest && (
                  <div className="mt-4">
                    <h6 className="fw-bold">Rails API取得結果:</h6>
                    <pre className="bg-light p-3 rounded small">
                      {JSON.stringify(profile, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function MyPage() {
  return (
    <ProtectedPage redirectTo="/auth/error?error=AccessDenied">
      <MyPageContent />
    </ProtectedPage>
  );
}

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
    <>
      <div className="py-4">
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
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-clipboard-data fs-1 mb-3 d-block"></i>
                  <p className="mb-0">まだアクティビティはありません</p>
                  <p className="small">レストランのレビューを書いたりお気に入りに追加したりすると、ここに表示されます</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}