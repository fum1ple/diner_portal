import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const GET = async (_req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    // セッション確認
    const session = await getServerSession(authOptions);
    if (!session?.jwtToken) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }
    // Rails APIに転送
    const backendUrl = `http://backend:3000/api/restaurants/${params.id}`;
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
    console.error('店舗詳細取得APIエラー:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

// PATCH, DELETE などは必要に応じて追加してください。
