// src/app/components/AuthButtonWrapper.tsx
'use client'; // クライアントコンポーネントとしてマーク

import dynamic from 'next/dynamic';

// クライアントコンポーネント内でのみdynamic importを使用
const AuthButton = dynamic(() => import('./AuthButton'), { 
  loading: () => <div>ロード中...</div> 
});

export default function AuthButtonWrapper() {
  return <AuthButton />;
}