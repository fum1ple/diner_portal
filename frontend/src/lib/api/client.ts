// 共通fetch wrapper
import { signOut } from 'next-auth/react';
import type { ApiResponse, ApiCallOptions } from '@/types/api';

// 基本的なfetch wrapper
export const apiCall = async <T = unknown>(
  endpoint: string,
  options: ApiCallOptions = {}
): Promise<ApiResponse<T>> => {
  const { timeout = 10000, retries = 1, ...fetchOptions } = options;
  
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const headers: HeadersInit = { 
        ...((fetchOptions.headers as Record<string, string>) || {}),
      };
      
      if (!(fetchOptions.body instanceof FormData)) {
        (headers as Record<string, string>)['Content-Type'] = 'application/json';
      }

      const response = await fetch(`/api${url}`, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      const responseBody = await response.text();
      const data = responseBody ? JSON.parse(responseBody) : null;

      if (!response.ok) {
        // 401エラー（認証切れ）の場合、自動的にログアウトしてログイン画面にリダイレクト
        if (response.status === 401) {
          await signOut({ callbackUrl: '/' });
          return {
            status: response.status,
            error: 'セッションが期限切れです。再度ログインしてください。',
          };
        }
        
        return {
          status: response.status,
          error: data?.error || data?.message || `HTTP ${response.status}`,
        };
      }

      return {
        status: response.status,
        data,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      // 全ての再試行後にのみエラーを返す
      if (attempt === retries - 1) {
        return {
          status: 0,
          error: lastError.message,
        };
      }
      
      // リトライ前に少し待機
      await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  
  return {
    status: 0,
    error: lastError?.message || '不明なエラー',
  };
};

export default apiCall;