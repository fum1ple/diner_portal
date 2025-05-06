'use client';

import styles from '../layout.module.css';
import LoginIcon from '../icons/LoginIcon';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// next-auth/reactのインポートエラーを回避する代替実装
export default function AuthButton() {
  const [session, setSession] = useState<{user?: {name?: string, image?: string}} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // セッション情報を取得
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        setSession(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('セッション取得エラー:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className={styles.loginBox}>ロード中...</div>;
  }

  if (session?.user) {
    return (
      <div className={styles.userMenu}>
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || 'ユーザー画像'}
            width={32}
            height={32}
            className={styles.userAvatar}
          />
        )}
        <span>{session.user.name || 'ユーザー'}</span>
        <Link href="/api/auth/signout" className={styles.logoutButton}>
          ログアウト
        </Link>
      </div>
    );
  }

  return (
    <Link href="/auth/signin" className={styles.loginBox}>
      <LoginIcon className={styles.loginIcon} />
      ログイン
    </Link>
  );
}