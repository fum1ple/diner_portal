// 保護されたページ用のHOCコンポーネント
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ProtectedPageProps {
  children: ReactNode;
  redirectTo?: string;
  loadingComponent?: ReactNode;
  fallbackComponent?: ReactNode;
}

// ローディング画面コンポーネント
const DefaultLoadingComponent = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
      <h2 className="mt-4 text-xl font-semibold text-gray-900">認証状態を確認中...</h2>
      <p className="mt-2 text-gray-600">しばらくお待ちください</p>
    </div>
  </div>
);

// 認証エラー時のフォールバックコンポーネント
const DefaultFallbackComponent = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="mx-auto h-16 w-16 text-red-500 flex items-center justify-center">
        <svg
          className="h-16 w-16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
      <h2 className="mt-4 text-xl font-semibold text-gray-900">認証が必要です</h2>
      <p className="mt-2 text-gray-600">このページにアクセスするには認証が必要です。</p>
    </div>
  </div>
);

// 保護されたページのHOC
export const ProtectedPage: React.FC<ProtectedPageProps> = ({
  children,
  redirectTo = '/access-denied',
  loadingComponent = <DefaultLoadingComponent />,
  fallbackComponent = <DefaultFallbackComponent />
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ローディング中は何もしない
    if (isLoading) return;

    // 認証されていない場合はリダイレクト
    if (!isAuthenticated) {
      // 一度だけリダイレクトを実行するために、タイムアウトを設定
      const redirectTimeout = setTimeout(() => {
        router.push(redirectTo);
      }, 100);
      
      return () => clearTimeout(redirectTimeout);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  // ローディング中
  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  // 認証されていない場合
  if (!isAuthenticated) {
    return <>{fallbackComponent}</>;
  }

  // 認証済みの場合、子コンポーネントを表示
  return <>{children}</>;
};

// より簡単に使用できるラッパー関数
export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: {
    redirectTo?: string;
    loadingComponent?: ReactNode;
    fallbackComponent?: ReactNode;
  }
) => {
  const WithAuthComponent: React.FC<P> = props => (
    <ProtectedPage {...options}>
      <WrappedComponent {...props} />
    </ProtectedPage>
  );

  WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithAuthComponent;
};

export default ProtectedPage;
