import NextAuth, { Session, User, DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import type { Account } from "next-auth";

// NextAuth の型拡張
declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id?: string;
      email?: string;
      name?: string;
      google_id?: string;
    } & DefaultSession["user"];
    idToken?: string;
    accessToken?: string;
    jwtToken?: string; // Rails APIからのJWTトークン
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    railsJwtToken?: string; // Rails APIから受信したJWTトークン（一時保存用）
    railsUser?: any; // Rails APIから受信したユーザー情報（一時保存用）
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    name?: string;
    google_id?: string;
    idToken?: string;
    accessToken?: string;
    jwtToken?: string; // Rails APIからのJWTトークン
  }
}

// 環境に基づいて動的にURLを決定
const getBaseUrl = () => {
  if (process.env.CODESPACES === "true" && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN) {
    return `https://${process.env.GITHUB_CODESPACES_PORTS_HOST}-4000.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`;
  }
  return 'http://localhost:4000'
}

// Rails APIのURLを取得
const getRailsApiUrl = () => {
  // コンテナ内からはbackend:3000でアクセス
  return 'http://backend:3000'
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: true, // デバッグログを有効化
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        // Rails APIから取得したユーザー情報をセッションに設定
        if (token.id) {
          session.user.id = token.id as string;
        }
        if (token.email) {
          session.user.email = token.email as string;
        }
        if (token.name) {
          session.user.name = token.name as string;
        }
        if (token.google_id) {
          session.user.google_id = token.google_id as string;
        }
        
        // Googleのトークン情報
        session.idToken = typeof token.idToken === 'string' ? token.idToken : undefined;
        session.accessToken = typeof token.accessToken === 'string' ? token.accessToken : undefined;
        
        // Rails APIからのJWTトークン
        session.jwtToken = typeof token.jwtToken === 'string' ? token.jwtToken : undefined;
      }
      return session;
    },
    async jwt({ token, user, account }: { token: JWT; user?: User; account?: Account | null }) {
      // 初回サインイン時のGoogleアカウント情報を保存
      if (user && account && account.provider === 'google') {
        token.id = user.id;
        token.email = user.email ?? undefined;
        token.name = user.name ?? undefined;
        if (account.id_token) {
          token.idToken = account.id_token;
        }
        if (account.access_token) {
          token.accessToken = account.access_token;
        }
        
        // Rails APIから受信したJWTトークンとユーザー情報を保存
        if (user.railsJwtToken) {
          token.jwtToken = user.railsJwtToken;
          console.log('JWT token saved to token:', user.railsJwtToken);
        }
        if (user.railsUser) {
          // Rails APIから受信したユーザー情報でトークンを更新
          token.id = user.railsUser.id.toString();
          token.email = user.railsUser.email;
          token.name = user.railsUser.name;
          token.google_id = user.railsUser.google_id;
          console.log('Rails user info saved to token:', user.railsUser);
        }
      }
      return token;
    },
    // Rails API連携用: サインイン時にAPIへトークン送信してJWTを受信
    async signIn({ user, account }: { user: User; account?: Account | null }) {
      if (account?.provider === 'google' && account.id_token) {
        // Rails APIへid_tokenを送信してJWTを受信
        try {
          const requestBody = {
            id_token: account.id_token,
            email: user.email
          };

          console.log('Sending request to Rails API:', requestBody);

          const res = await fetch(`${getRailsApiUrl()}/api/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          });
          
          if (!res.ok) {
            const errorText = await res.text();
            console.error('API Response error:', res.status, errorText);
            return false;
          }

          const responseData = await res.json();
          console.log('Rails API response:', responseData);

          if (responseData.success && responseData.token && responseData.user) {
            // Rails APIから受信したユーザー情報とJWTトークンをuserオブジェクトに一時保存
            // これはjwtコールバックで使用される
            user.railsJwtToken = responseData.token;
            user.railsUser = responseData.user;
            
            console.log('Successfully received JWT from Rails API');
            return true;
          } else {
            console.error('Invalid response from Rails API:', responseData);
            return false;
          }
        } catch (error) {
          console.error('API Request failed:', error);
          return false;
        }
      }
      return true;
    },
    // リダイレクト処理を追加
    async redirect({ url, baseUrl }) {
      // 認証完了後、常にTOPページにリダイレクト
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/top`;
      }
      // 許可されたURLへのリダイレクトを許可
      else if (url.startsWith("http") || url.startsWith("/")) {
        return url;
      }
      return baseUrl;
    },
  },
};

if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = getBaseUrl();
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
