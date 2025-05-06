'use client';

import styles from '../layout.module.css';
import LoginIcon from '../icons/LoginIcon';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  if (isLoading) {
    return (
      <div className={styles.loginBox}>
        <span className={styles.loadingDots}>...</span>
      </div>
    );
  }

  if (session) {
    return (
      <div className={styles.userMenu}>
        <div className={styles.userInfo}>
          {session.user?.image ? (
            <Image 
              src={session.user.image} 
              alt="プロフィール画像" 
              width={32} 
              height={32} 
              className={styles.userImage}
            />
          ) : (
            <div className={styles.userInitial}>
              {session.user?.name?.charAt(0) || 'U'}
            </div>
          )}
          <span className={styles.userName}>{session.user?.name}</span>
        </div>
        <button onClick={() => signOut()} className={styles.signOutButton}>
          ログアウト
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn('google')} className={styles.loginBox}>
      <LoginIcon className={styles.loginIcon} />
      ログイン
    </button>
  );
}