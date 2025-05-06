'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function AuthError() {
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
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.errorIcon}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FF5252" strokeWidth="2" />
            <path d="M12 8V12" stroke="#FF5252" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="16" r="1" fill="#FF5252" />
          </svg>
        </div>
        
        <h1 className={styles.title}>認証エラー</h1>
        
        <div className={styles.message}>
          <p>{errorMessage}</p>
        </div>
        
        <div className={styles.actions}>
          <Link href="/auth/signin" className={styles.primaryButton}>
            ログインページに戻る
          </Link>
          
          <Link href="/" className={styles.secondaryButton}>
            ホームに戻る
          </Link>
        </div>

        <div className={styles.help}>
          <p>問題が解決しない場合は、管理者にお問い合わせください。</p>
          <p>許可されているドメイン: <code>tokyoelectron.com</code></p>
        </div>
      </div>
    </div>
  );
}