'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5分間データをフレッシュとして扱う
            gcTime: 10 * 60 * 1000, // 10分間キャッシュを保持
            retry: (failureCount, error) => {
              // 404エラーの場合はリトライしない
              if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
                return false;
              }
              // 401エラー（認証エラー）の場合もリトライしない
              if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
                return false;
              }
              return failureCount < 3;
            },
            refetchOnWindowFocus: false, // ウィンドウフォーカス時の自動リフェッチを無効化
          },
          mutations: {
            retry: (failureCount, error) => {
              // ミューテーションでは認証エラーやバリデーションエラーはリトライしない
              if (error && typeof error === 'object' && 'status' in error) {
                const status = error.status as number;
                if (status >= 400 && status < 500) {
                  return false;
                }
              }
              return failureCount < 2;
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
