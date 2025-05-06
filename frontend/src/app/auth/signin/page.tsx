'use client';

import { useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      // 直接GoogleOAuthのURLにリダイレクト
      window.location.href = '/api/auth/signin/google';
    } catch (error) {
      console.error('ログインエラー:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoContainer}>
          <Image 
            src="/TOKIEATS-logo.png" 
            alt="TOKIEATS ロゴ" 
            width={64} 
            height={64} 
            className={styles.logo}
          />
          <h1 className={styles.title}>TOKIEATSにログイン</h1>
        </div>
        
        <div className={styles.description}>
          <p>社内メールアドレスを使用してログインしてください。</p>
          <p>許可されているドメイン: <code>tokium.jp</code></p>
        </div>

        <button 
          onClick={handleSignIn} 
          disabled={isLoading} 
          className={styles.googleButton}
        >
          <Image 
            src="/google-logo.svg" 
            alt="Google" 
            width={20} 
            height={20} 
          />
          {isLoading ? 'ログイン中...' : 'Googleでログイン'}
        </button>

        <div className={styles.footer}>
          <p>社内限定プラットフォームです。アクセスに問題がある場合は管理者にご連絡ください。</p>
          <Link href="/">ホームに戻る</Link>
        </div>
      </div>
    </div>
  );
}