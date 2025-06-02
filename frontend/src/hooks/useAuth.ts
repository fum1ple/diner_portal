// 認証状態管理用カスタムフック
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// JWT トークンリフレッシュ用ユーティリティ
const refreshJwtToken = async (refreshToken: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
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
  const router = useRouter();
  const [isJwtValid, setIsJwtValid] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const jwtToken = session?.jwtToken;
  const hasJwtToken = !!jwtToken;

  // JWT トークンの有効性チェック
  useEffect(() => {
    if (jwtToken && !isRefreshing) {
      const isValid = validateJwtToken(jwtToken);
      setIsJwtValid(isValid);
      
      if (!isValid && session?.refreshToken) {
        handleTokenRefresh();
      }
    } else {
      setIsJwtValid(false);
    }
  }, [jwtToken, isRefreshing]);

  // トークンリフレッシュ処理
  const handleTokenRefresh = async () => {
    if (isRefreshing || !session?.refreshToken) return;
    
    setIsRefreshing(true);
    try {
      const newToken = await refreshJwtToken(session.refreshToken);
      if (newToken) {
        await update({ ...session, jwtToken: newToken });
        setIsJwtValid(true);
      } else {
        setIsJwtValid(false);
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      setIsJwtValid(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  // ログイン関数
  const login = async (callbackUrl?: string) => {
    await signIn('google', { callbackUrl: callbackUrl || '/top' });
  };

  // ログアウト関数
  const logout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // 認証が必要なページへのリダイレクト保護
  const requireAuth = (redirectTo: string = '/auth/signin') => {
    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push(redirectTo);
      }
    }, [isLoading, isAuthenticated, redirectTo]);
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
    requireAuth,
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
