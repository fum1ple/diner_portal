'use client';

import { useAuth } from '@/hooks/useAuth';
import { updateUserProfile } from '@/utils/api';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import ProtectedPage from '@/components/ProtectedPage';

const MyPageContent = () => {
  const { user, isLoading, isJwtValid, hasJwtToken } = useAuth();
  const [updateData, setUpdateData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // フォームデータの初期化
  useEffect(() => {
    if (user) {
      setUpdateData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  // プロフィール更新
  const handleUpdateProfile = async () => {
    if (!hasJwtToken || !isJwtValid) {
      setMessage('エラー: 有効なJWTトークンがありません');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      await updateUserProfile(updateData);
      setMessage('プロフィール更新成功');
    } catch (error) {
      setMessage(`エラー: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">読み込み中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
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
                <div className={`badge ${hasJwtToken && isJwtValid ? 'bg-success' : 'bg-warning'} mb-2`}>
                  {hasJwtToken && isJwtValid ? 'JWT認証済み' : 'JWT未取得'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-4">プロフィール設定</h4>
              
              <form onSubmit={e => {e.preventDefault(); handleUpdateProfile();}}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">名前</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={updateData.name}
                      onChange={e => setUpdateData({...updateData, name: e.target.value})}
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
                      onChange={e => setUpdateData({...updateData, email: e.target.value})}
                      placeholder="yamada@tokium.jp"
                    />
                  </div>
                </div>
                
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !hasJwtToken || !isJwtValid}
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
            </div>
          </div>
        </div>
      </div>      </div>
    );
  };

const MyPage = () => (
  <ProtectedPage redirectTo="/auth/error?error=AccessDenied">
    <MyPageContent />
  </ProtectedPage>
);

export default MyPage;