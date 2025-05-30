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
    } & DefaultSession["user"];
    idToken?: string;
    accessToken?: string;
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

const authOptions: NextAuthOptions = {
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
        // ID情報を設定
        if (token.id) {
          session.user.id = token.id as string;
        }
        // メール情報を設定
        if (token.email) {
          session.user.email = token.email as string;
        }
        // GoogleのidToken, accessTokenをセッションに追加（string型のみ）
        session.idToken = typeof token.idToken === 'string' ? token.idToken : undefined;
        session.accessToken = typeof token.accessToken === 'string' ? token.accessToken : undefined;
      }
      return session;
    },
    async jwt({ token, user, account }: { token: JWT; user?: User; account?: Account | null }) {
      if (user && account && account.provider === 'google') {
        token.id = user.id;
        token.email = user.email;
        if (typeof account.id_token === 'string') {
          token.idToken = account.id_token;
        }
        if (typeof account.access_token === 'string') {
          token.accessToken = account.access_token;
        }
      }
      return token;
    },
    // Rails API連携用: サインイン時にAPIへトークン送信
    async signIn({ user, account }: { user: User; account?: Account | null }) {
      if (account?.provider === 'google' && typeof account.id_token === 'string') {
        // Rails APIへid_tokenを送信
        try {
          const requestBody = {
            id_token: account.id_token,
            email: user.email
          };

          const res = await fetch(`${getRailsApiUrl()}/api/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          });
          
          if (!res.ok) {
            const errorText = await res.text();
            console.error('API Response error:', errorText);
            return false;
          }
        
          return true;
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
