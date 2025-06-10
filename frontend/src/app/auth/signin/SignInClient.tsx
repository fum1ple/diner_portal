'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

const SignInClient = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/top' });
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
            width={80} 
            height={80} 
            className={styles.logo}
            priority
            unoptimized
            onError={(e) => {
              console.error('Logo image failed to load:', e);
            }}
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
          {!isLoading && (
            <Image 
              src="/google-logo.svg" 
              alt="Google" 
              width={20} 
              height={20} 
              unoptimized
              onError={(e) => {
                console.error('Google logo failed to load:', e);
              }}
            />
          )}
          {isLoading ? (
            <>
              <div className={styles.spinner}></div>
              ログイン中...
            </>
          ) : 'Googleでログイン'}
        </button>

        <div className={styles.footer}>
          <p>社内限定プラットフォームです。アクセスに問題がある場合は管理者にご連絡ください。</p>
          <Link href="/">ホームに戻る</Link>
        </div>
      </div>
    </div>
  );
};

export default SignInClient;
