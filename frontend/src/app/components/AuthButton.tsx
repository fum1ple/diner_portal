'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import styles from '../layout.module.css';
import LoginIcon from '../icons/LoginIcon';
import Image from 'next/image';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  if (loading) {
    return <div className={styles.loginBox}>ロード中...</div>;
  }

  if (session?.user) {
    return (
      <div className={styles.userMenu}>
        <div className={styles.userInfo}>
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || 'ユーザー画像'}
              width={32}
              height={32}
              className={styles.userAvatar}
            />
          )}
          <span className={styles.userName}>{session.user.name}</span>
        </div>
        <button
          className={styles.signOutButton}
          onClick={() => signOut()}
        >
          ログアウト
        </button>
      </div>
    );
  }

  return (
    <button
      className={styles.loginBox}
      onClick={() => signIn('google')}
    >
      <LoginIcon className={styles.loginIcon} />
      ログイン
    </button>
  );
}