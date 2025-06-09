'use client';

import { useAuth } from '@/hooks/useAuth';
import ProtectedPage from '@/components/ProtectedPage';

const TopPageContent = () => {
  const { user, isLoading } = useAuth();

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
    <div className="py-5">
      <h1 className="display-4 mb-4">社内限定TOPページ</h1>
      <p>ようこそ、{user?.email} さん！</p>
      <p>このページはログインした社員のみが閲覧できます。</p>
        
      {user && (
        <div className="mt-4">
          <div className="alert alert-success">
            <h5 className="alert-heading">認証完了</h5>
            <p className="mb-0">Rails APIとの連携が正常に完了しています。</p>
          </div>
        </div>
      )}
    </div>
  );
};

const TopPage = () => (
  <ProtectedPage redirectTo="/auth/error?error=AccessDenied">
    <TopPageContent />
  </ProtectedPage>
);

export default TopPage;
