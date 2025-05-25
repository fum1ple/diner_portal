'use client';

import { useSession } from 'next-auth/react';
import LogoutButton from './LogoutButton';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const { data: session } = useSession();

  if (!session) {
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
          {/* ユーザー情報 */}
          <div className="d-flex align-items-center gap-2">
            {session.user?.image && (
              <Image 
                src={session.user.image} 
                alt="プロフィール画像" 
                width={32} 
                height={32} 
                className="rounded-circle"
              />
            )}
            <div className="d-none d-sm-block">
              <div className="small text-muted">ログイン中</div>
              <div className="fw-semibold">{session.user?.email}</div>
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
