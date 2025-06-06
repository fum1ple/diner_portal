import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    if (!category) {
      return NextResponse.json({ error: 'category parameter is required' }, { status: 400 });
    }

    // サーバーサイドからbackendコンテナにアクセス
    const backendUrl = `http://backend:3000/api/tags?category=${category}`;
    
    const response = await fetch(backendUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
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
    console.log('タグ作成API開始');
    
    // セッション確認
    const session = await getServerSession(authOptions);
    console.log('セッション:', session ? 'あり' : 'なし');
    
    if (!session?.jwtToken) {
      console.log('認証が必要です');
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }
    
    // リクエストボディを取得
    const body = await request.json();
    console.log('リクエストボディ:', body);

    // バックエンドにリクエストを転送
    const backendUrl = `http://backend:3000/api/tags`;
    console.log('バックエンドURL:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.jwtToken}`
      },
      body: JSON.stringify(body)
    });
    
    console.log('バックエンドレスポンス:', response.status, response.statusText);
    const data = await response.json();
    console.log('バックエンドデータ:', data);
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('Next.js API Route エラー:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
};
