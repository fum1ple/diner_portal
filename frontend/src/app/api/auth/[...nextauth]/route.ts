import NextAuth, { Session, User, DefaultSession, NextAuthOptions, Account } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { config as envConfig } from "@/lib/env-config";

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
    jwtToken?: string;
    refreshToken?: string;
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    railsJwtToken?: string;
    railsRefreshToken?: string;
    railsUser?: {
      id: string;
      email: string;
      name?: string;
      google_id?: string;
    };
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
    jwtToken?: string;
    refreshToken?: string;
  }
}

const getBaseUrl = () => {
  // 環境変数で明示的に設定されている場合はそれを使用
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  // CodeSpaces環境の場合
  if (process.env.CODESPACES === "true" && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN) {
    return `https://${process.env.GITHUB_CODESPACES_PORTS_HOST}-4000.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`;
  }
  
  // デフォルト（開発環境）
  return 'http://localhost:4000';
};

const getRailsApiUrl = () => {
  return envConfig.backendInternalUrl;
};

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
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        if (token.id) session.user.id = token.id as string;
        if (token.email) session.user.email = token.email as string;
        if (token.name) session.user.name = token.name as string;
        if (token.google_id) session.user.google_id = token.google_id as string;
        
        session.idToken = typeof token.idToken === 'string' ? token.idToken : undefined;
        session.accessToken = typeof token.accessToken === 'string' ? token.accessToken : undefined;
        session.jwtToken = typeof token.jwtToken === 'string' ? token.jwtToken : undefined;
        session.refreshToken = typeof token.refreshToken === 'string' ? token.refreshToken : undefined;
      }
      return session;
    },
    async jwt({ token, user, account }: { token: JWT; user?: User; account?: Account | null }) {
      if (user && account && account.provider === 'google') {
        token.id = user.id;
        token.email = user.email ?? undefined;
        token.name = user.name ?? undefined;
        if (account.id_token) token.idToken = account.id_token;
        if (account.access_token) token.accessToken = account.access_token;
        
        if (user.railsJwtToken) token.jwtToken = user.railsJwtToken;
        if (user.railsRefreshToken) token.refreshToken = user.railsRefreshToken;
        if (user.railsUser) {
          token.id = user.railsUser.id.toString();
          token.email = user.railsUser.email;
          token.name = user.railsUser.name;
          token.google_id = user.railsUser.google_id;
        }
      }
      return token;
    },
    async signIn({ user, account }: { user: User; account?: Account | null }) {
      if (account?.provider === 'google' && account.id_token) {
        try {
          const res = await fetch(`${getRailsApiUrl()}/api/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id_token: account.id_token,
              email: user.email
            }),
          });
          
          if (!res.ok) return false;

          const responseData = await res.json();

          if (responseData.success && responseData.access_token && responseData.user) {
            user.railsJwtToken = responseData.access_token;
            user.railsRefreshToken = responseData.refresh_token;
            user.railsUser = responseData.user;
            return true;
          }
          return false;
        } catch {
          return false;
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.includes('/api/auth/callback') || url.includes('mypage') || url === baseUrl || url.startsWith(baseUrl)) {
        return `${baseUrl}/top`;
      }
      
      if (url.startsWith("/") && !url.startsWith("//")) {
        return `${baseUrl}/top`;
      }
      
      if (url.startsWith("http")) {
        return url;
      }
      
      return `${baseUrl}/top`;
    },
  },
};

if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = getBaseUrl();
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
