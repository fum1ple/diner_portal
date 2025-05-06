'use client';

// next-auth/reactのSessionProviderを使用しない代替実装
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}