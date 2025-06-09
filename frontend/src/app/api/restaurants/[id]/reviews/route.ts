import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const POST = async (
  request: NextRequest, 
  { params }: { params: { id: string } }
) => {
  try {
    // セッション確認
    const session = await getServerSession(authOptions);
    
    if (!session?.jwtToken) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    // FormDataを取得
    const formData = await request.formData();

    // Rails APIに転送
    const backendUrl = `http://backend:3000/api/restaurants/${params.id}/reviews`;
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.jwtToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || errorData.error || 'Rails API error' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('レビュー投稿APIエラー:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};
