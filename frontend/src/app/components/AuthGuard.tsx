'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

type AuthGuardProps = {
  children: ReactNode;
  redirectTo?: string;
};

/**
 * 認証が必要なページを保護するためのコンポーネント
 * 未ログインの場合は指定されたページ（デフォルトは/auth/signin）にリダイレクト
 */
export default function AuthGuard({ 
  children,
  redirectTo = '/auth/signin'
}: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ログインしていない場合はログインページにリダイレクト
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(redirectTo);
    }
  }, [status, router, redirectTo]);

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

  // ログイン済みの場合は子コンポーネントを表示
  return <>{children}</>;
}
