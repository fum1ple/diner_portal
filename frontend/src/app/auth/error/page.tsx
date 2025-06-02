'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const AuthErrorContent = () => {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('認証エラーが発生しました');

  useEffect(() => {
    const error = searchParams.get('error');
    
    if (error === 'AccessDenied') {
      setErrorMessage('アクセスが拒否されました。許可されたドメインのメールアドレスでログインしてください。');
    } else if (error === 'Configuration') {
      setErrorMessage('認証システムの設定に問題があります。管理者にお問い合わせください。');
    } else if (error === 'OAuthSignin' || error === 'OAuthCallback') {
      setErrorMessage('OAuth認証プロセスに問題が発生しました。しばらくしてからもう一度お試しください。');
    } else if (error) {
      setErrorMessage(`認証エラー: ${error}`);
    }
  }, [searchParams]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 py-5">
      <div className="card shadow-sm border-0 rounded-4 p-4 text-center" style={{ maxWidth: '480px' }}>
        <div className="card-body">
          <div className="text-danger mb-3">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
          </div>
          
          <h1 className="h4 fw-semibold mb-3">認証エラー</h1>
          
          <div className="alert alert-danger mb-4">
            <p className="mb-0">{errorMessage}</p>
          </div>
          
          <div className="d-grid gap-3 mb-4">
            <Link href="/auth/signin" className="btn btn-primary">
              ログインページに戻る
            </Link>
            
            <Link href="/" className="btn btn-outline-secondary">
              ホームに戻る
            </Link>
          </div>

          <div className="text-muted small">
            <p className="mb-1">問題が解決しない場合は、管理者にお問い合わせください。</p>
            <p className="mb-0">許可されているドメイン: <code className="bg-light px-2 py-1 rounded">tokium.jp</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthError = () => (
  <Suspense fallback={
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">読み込み中...</span>
      </div>
    </div>
  }>
    <AuthErrorContent />
  </Suspense>
);

export default AuthError;