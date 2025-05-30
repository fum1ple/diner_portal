// 認証状態管理用カスタムフック
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// 認証状態の型定義
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id?: string;
    email?: string;
    name?: string;
    google_id?: string;
  } | null;
  jwtToken?: string;
}

// 認証フック
export const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    jwtToken: undefined,
  });

  useEffect(() => {
    const isLoading = status === "loading";
    const isAuthenticated = status === "authenticated" && !!session?.jwtToken;
    
    setAuthState({
      isAuthenticated,
      isLoading,
      user: session?.user || null,
      jwtToken: session?.jwtToken,
    });
  }, [session, status]);

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
      if (!authState.isLoading && !authState.isAuthenticated) {
        router.push(redirectTo);
      }
    }, [authState.isLoading, authState.isAuthenticated, redirectTo]);
  };

  return {
    ...authState,
    login,
    logout,
    requireAuth,
    session: session,
  };
};

// JWT トークンの有効性チェック用フック
export const useJwtToken = () => {
  const { data: session } = useSession();
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (session?.jwtToken) {
      // JWTトークンの有効性を簡易チェック
      try {
        const payload = JSON.parse(atob(session.jwtToken.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        setIsValid(payload.exp > currentTime);
      } catch (error) {
        console.error('JWT token validation error:', error);
        setIsValid(false);
      }
    } else {
      setIsValid(false);
    }
  }, [session?.jwtToken]);

  return {
    token: session?.jwtToken,
    isValid,
    hasToken: !!session?.jwtToken,
  };
};
