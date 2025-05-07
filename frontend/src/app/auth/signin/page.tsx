'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/mypage' });
    } catch (error) {
      console.error('ログインエラー:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 py-5">
      <div className="card shadow-sm border-0 rounded-4 p-4" style={{ maxWidth: '480px' }}>
        <div className="card-body text-center">
          <div className="mb-4">
            <Image 
              src="/TOKIEATS-logo.png" 
              alt="TOKIEATS ロゴ" 
              width={64} 
              height={64} 
              className="mb-3"
            />
            <h1 className="h4 fw-semibold text-dark">TOKIEATSにログイン</h1>
          </div>
          
          <div className="mb-4 text-secondary">
            <p className="mb-2">社内メールアドレスを使用してログインしてください。</p>
            <p>許可されているドメイン: <code className="bg-light px-2 py-1 rounded">tokium.jp</code></p>
          </div>

          <button 
            onClick={handleSignIn} 
            disabled={isLoading} 
            className="btn btn-light d-flex align-items-center justify-content-center gap-2 w-100 py-3 border shadow-sm"
          >
            <Image 
              src="/google-logo.svg" 
              alt="Google" 
              width={20} 
              height={20} 
            />
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ログイン中...
              </>
            ) : 'Googleでログイン'}
          </button>

          <div className="mt-4 text-muted small">
            <p>社内限定プラットフォームです。アクセスに問題がある場合は管理者にご連絡ください。</p>
            <Link href="/" className="text-primary text-decoration-none">ホームに戻る</Link>
          </div>
        </div>
      </div>
    </div>
  );
}