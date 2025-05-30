'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';

interface LogoutButtonProps {
  className?: string;
  variant?: 'primary' | 'outline' | 'danger';
}

export default function LogoutButton({ 
  className = '', 
  variant = 'outline' 
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut({ 
        callbackUrl: '/',
        redirect: true 
      });
    } catch (error) {
      console.error('ログアウトエラー:', error);
      setIsLoading(false);
    }
  };

  const getButtonClass = () => {
    const baseClass = 'btn d-flex align-items-center gap-2';
    switch (variant) {
      case 'primary':
        return `${baseClass} btn-primary`;
      case 'danger':
        return `${baseClass} btn-danger`;
      case 'outline':
      default:
        return `${baseClass} btn-outline-secondary`;
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      disabled={isLoading}
      className={`${getButtonClass()} ${className}`}
    >
      {isLoading ? (
        <>
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ログアウト中...
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          ログアウト
        </>
      )}
    </button>
  );
}
