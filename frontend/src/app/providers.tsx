'use client';

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // NextAuthのデバッグモードを無効化
    if (typeof window !== 'undefined') {
      const win = window as any;
      if (win.__NEXTAUTH) {
        win.__NEXTAUTH.debug = false;
      }
      // localStorageからデバッグフラグを削除
      if (window.localStorage) {
        window.localStorage.removeItem('nextauth.debug');
      }
      // sessionStorageからデバッグフラグを削除
      if (window.sessionStorage) {
        window.sessionStorage.removeItem('nextauth.debug');
      }
    }
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
};