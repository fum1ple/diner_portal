'use client';

import { signOut, useSession } from 'next-auth/react';
import LoginIcon from '../icons/LoginIcon';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const router = useRouter();

  if (loading) {
    return (
      <button className="btn btn-primary rounded-pill d-flex align-items-center" disabled>
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        ロード中...
      </button>
    );
  }

  if (session?.user) {
    return (
      <div className="dropdown">
        <button 
          className="btn btn-light rounded-pill d-flex align-items-center" 
          type="button" 
          data-bs-toggle="dropdown" 
          aria-expanded="false"
        >
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || 'ユーザー画像'}
              width={32}
              height={32}
              className="rounded-circle me-2"
            />
          ) : (
            <div className="bg-primary text-white rounded-circle me-2 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
              {session.user.name?.[0] || 'U'}
            </div>
          )}
          <span className="text-truncate" style={{ maxWidth: '120px' }}>
            {session.user.name}
          </span>
        </button>
        <ul className="dropdown-menu dropdown-menu-end shadow-sm">
          <li>
            <a className="dropdown-item" href="/profile">プロフィール</a>
          </li>
          <li>
            <a className="dropdown-item" href="/myreviews">マイレビュー</a>
          </li>
          <li><hr className="dropdown-divider" /></li>
          <li>
            <button
              className="dropdown-item text-danger"
              onClick={() => signOut()}
            >
              ログアウト
            </button>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <button
      className="btn btn-primary rounded-pill d-flex align-items-center"
      onClick={() => router.push('/auth/signin')}
    >
      <LoginIcon className="me-2" />
      ログイン
    </button>
  );
}