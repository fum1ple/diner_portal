import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

// 許可するドメインのリスト（例：会社のドメイン）
const ALLOWED_DOMAINS = ["tokyoelectron.com", "example.com"]; // 実際の会社ドメインに変更してください

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    // 必要に応じて他のプロバイダを追加
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // ユーザーのメールアドレスからドメインを抽出
      const emailDomain = user.email?.split('@')[1];
      
      // 許可されたドメインかどうかを確認
      if (emailDomain && ALLOWED_DOMAINS.includes(emailDomain)) {
        return true;  // 許可されたドメインからのアクセスを許可
      } else {
        // 許可されていないドメインからのアクセスを拒否
        return false;
      }
    },
    // セッション情報のカスタマイズ
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error', // カスタムエラーページ
  },
  // セッション設定
  session: {
    strategy: "jwt",
  },
  // シークレットキー
  secret: process.env.NEXTAUTH_SECRET,
};

// NextAuth.jsのハンドラ関数をエクスポート
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };