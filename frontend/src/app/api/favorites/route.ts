import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET /api/favorites: お気に入り一覧取得
export const GET = async (_req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.jwtToken) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }
    const backendBaseUrl = process.env.BACKEND_INTERNAL_URL;
    const backendUrl = `${backendBaseUrl}/api/favorites`;
    const response = await fetch(backendUrl, {
      headers: {
        'Authorization': `Bearer ${session.jwtToken}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Rails API error' },
        { status: response.status }
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('お気に入り一覧取得APIエラー:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};
