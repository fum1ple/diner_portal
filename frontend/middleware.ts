// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const AUTH_DOMAIN = 'tokium.jp';

// 認証が必要なパスの一覧
const PROTECTED_PATHS = ['/mypage', '/admin', '/dashboard'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 保護対象ルート以外ならスルー
  if (!PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 認証されていない → トップにリダイレクト
  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 社員ドメインチェック
  const email = token.email || '';
  if (!email.endsWith(`@${AUTH_DOMAIN}`)) {
    return new NextResponse('Unauthorized domain', { status: 403 });
  }

  return NextResponse.next();
}

// ✅ matcher は middleware.ts 内で export
export const config = {
  matcher: ['/mypage/:path*', '/admin/:path*', '/dashboard/:path*'],
};
