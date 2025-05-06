// src/app/components/AuthButtonWrapper.tsx
'use client'; // クライアントコンポーネントとしてマーク

import dynamic from 'next/dynamic';

// クライアントコンポーネント内ではdynamic importとssr: falseが使用可能
const AuthButton = dynamic(() => import('./AuthButton'), { ssr: false });

export default function AuthButtonWrapper() {
  return <AuthButton />;
}