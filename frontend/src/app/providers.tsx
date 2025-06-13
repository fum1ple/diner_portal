'use client';

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // NextAuthのデバッグモードを無効化
    if (typeof window !== 'undefined') {
      interface WindowWithNextAuth extends Window {
        __NEXTAUTH?: {
          debug?: boolean;
          [key: string]: unknown;
        };
      }
      const windowWithNextAuth = window as WindowWithNextAuth;
      if (windowWithNextAuth.__NEXTAUTH) {
        windowWithNextAuth.__NEXTAUTH.debug = false;
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