import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const GET = async (request: NextRequest) => {
  try {
    // セッション確認（認証必須に変更）
    const session = await getServerSession(authOptions);
    
    if (!session?.jwtToken) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    if (!category) {
      return NextResponse.json({ error: 'category parameter is required' }, { status: 400 });
    }

    // サーバーサイドからbackendコンテナにアクセス（認証ヘッダー付き）
    const backendUrl = `http://backend:3000/api/tags?category=${category}`;
    
    const response = await fetch(backendUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.jwtToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Next.js API Route エラー:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    // セッション確認
    const session = await getServerSession(authOptions);
    
    if (!session?.jwtToken) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }
    
    // リクエストボディを取得
    const body = await request.json();

    // バックエンドにリクエストを転送
    const backendUrl = `http://backend:3000/api/tags`;
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.jwtToken}`
      },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('Next.js API Route エラー:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
};
