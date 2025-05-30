'use client';

import { useAuth, useJwtToken } from '@/hooks/useAuth';
import LogoutButton from './LogoutButton';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { hasToken, isValid } = useJwtToken();

  // ローディング中は表示しない
  if (isLoading) {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div className="container">
          <div className="navbar-brand d-flex align-items-center gap-2">
            <Image 
              src="/TOKIEATS-logo.png" 
              alt="TOKIEATS" 
              width={32} 
              height={32} 
            />
            <span className="fw-bold">TOKIEATS</span>
          </div>
          <div className="d-flex align-items-center">
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // 認証されていない場合は表示しない
  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container">
        <Link href="/top" className="navbar-brand d-flex align-items-center gap-2">
          <Image 
            src="/TOKIEATS-logo.png" 
            alt="TOKIEATS" 
            width={32} 
            height={32} 
          />
          <span className="fw-bold">TOKIEATS</span>
        </Link>

        <div className="d-flex align-items-center gap-3">
          {/* 認証状態インジケーター */}
          <div className="d-none d-lg-flex align-items-center gap-2">
            <div className={`badge ${hasToken && isValid ? 'bg-success' : 'bg-warning'}`}>
              {hasToken && isValid ? '認証済み' : 'JWT未取得'}
            </div>
          </div>

          {/* ユーザー情報 */}
          <div className="d-flex align-items-center gap-2">
            {user?.image && (
              <Image 
                src={user.image} 
                alt="プロフィール画像" 
                width={32} 
                height={32} 
                className="rounded-circle"
              />
            )}
            <div className="d-none d-sm-block">
              <div className="small text-muted">ログイン中</div>
              <div className="fw-semibold">{user?.email}</div>
            </div>
          </div>

          {/* ナビゲーションメニュー */}
          <div className="d-flex gap-2">
            <Link href="/top" className="btn btn-outline-primary btn-sm">
              TOP
            </Link>
            <Link href="/mypage" className="btn btn-outline-primary btn-sm">
              マイページ
            </Link>
            <LogoutButton className="btn-sm" variant="outline" />
          </div>
        </div>
      </div>
    </nav>
  );
}
