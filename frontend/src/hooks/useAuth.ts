// 認証状態管理用カスタムフック
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";

// JWT トークンリフレッシュ用ユーティリティ
const refreshJwtToken = async (refreshToken: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        refresh_token: refreshToken
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.access_token;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
};

// JWTトークンの有効性をチェック
const validateJwtToken = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Base64URLデコード
    const base64UrlDecode = (str: string) => {
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      return atob(base64);
    };
    
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    return payload.exp > currentTime;
  } catch {
    return false;
  }
};

// 認証状態の型定義
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id?: string;
    email?: string;
    name?: string;
    google_id?: string;
    image?: string | null;
  } | null;
  jwtToken?: string;
  isJwtValid: boolean;
  hasJwtToken: boolean;
  isRefreshing: boolean;
}

// 統合された認証フック
export const useAuth = () => {
  const { data: session, status, update } = useSession();
  const [isJwtValid, setIsJwtValid] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(0);

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const jwtToken = session?.jwtToken;
  const hasJwtToken = !!jwtToken;

  // トークンリフレッシュ処理
  const handleTokenRefresh = useCallback(async () => {
    const now = Date.now();
    // 既にリフレッシュ中、リフレッシュトークンがない、または最近リフレッシュした場合はスキップ
    if (isRefreshing || !session?.refreshToken || (now - lastRefreshTime < 5000)) {
      return;
    }
    
    setIsRefreshing(true);
    setLastRefreshTime(now);
    try {
      const newToken = await refreshJwtToken(session.refreshToken);
      if (newToken) {
        await update({ ...session, jwtToken: newToken });
        setIsJwtValid(true);
      } else {
        setIsJwtValid(false);
        // リフレッシュトークンが無効な場合はログアウト
        signOut({ callbackUrl: '/' });
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      setIsJwtValid(false);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, session, update, lastRefreshTime]);

  // JWT トークンの有効性チェック
  useEffect(() => {
    if (jwtToken && !isRefreshing) {
      const isValid = validateJwtToken(jwtToken);
      setIsJwtValid(isValid);
      
      // トークンが無効で、リフレッシュトークンがあり、まだリフレッシュ中でない場合のみリフレッシュ
      if (!isValid && session?.refreshToken && !isRefreshing) {
        handleTokenRefresh();
      }
    } else {
      setIsJwtValid(false);
    }
  }, [jwtToken, session?.refreshToken, isRefreshing, handleTokenRefresh]); // handleTokenRefreshを依存配列から除去

  // ログイン関数
  const login = async (callbackUrl?: string) => {
    await signIn('google', { callbackUrl: callbackUrl || '/top' });
  };

  // ログアウト関数
  const logout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return {
    // 基本認証状態
    isAuthenticated,
    isLoading,
    user: session?.user ? {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      google_id: session.user.google_id,
      image: session.user.image,
    } : null,
    session,
    
    // JWT関連
    jwtToken,
    hasJwtToken,
    isJwtValid,
    isRefreshing,
    refreshToken: handleTokenRefresh,
    
    // アクション
    login,
    logout,
  };
};

// 後方互換性のため、useJwtTokenフックも提供（useAuthのエイリアス）
export const useJwtToken = () => {
  const auth = useAuth();
  return {
    token: auth.jwtToken,
    isValid: auth.isJwtValid,
    hasToken: auth.hasJwtToken,
    isRefreshing: auth.isRefreshing,
    refreshToken: auth.refreshToken,
  };
};


