import NextAuth, { Session, User, DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";

// NextAuth の型拡張
declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id?: string;
      email?: string;
    } & DefaultSession["user"];
  }
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
    strategy: "jwt",
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
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
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    // リダイレクト処理を追加
    async redirect({ url, baseUrl }) {
      // 認証完了後、常にマイページにリダイレクト
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/mypage`;
      }
      // 許可されたURLへのリダイレクトを許可
      else if (url.startsWith("http") || url.startsWith("/")) {
        return url;
      }
      return baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };