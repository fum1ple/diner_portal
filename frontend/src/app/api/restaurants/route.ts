// frontend/app/api/restaurants/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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

    // リクエストボディ取得
    const body = await request.json();

    // Rails APIに転送
    const backendUrl = 'http://backend:3000/api/restaurants';
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.jwtToken}`,
      },
      body: JSON.stringify(body),
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
    console.error('店舗作成APIエラー:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

// --- 店舗一覧取得・検索 (GET) ---
// ★★★ このGET関数を修正します ★★★
export const GET = async (request: NextRequest) => { // requestを受け取れるように引数を追加
  try {
    // セッション確認
    const session = await getServerSession(authOptions);
    
    if (!session?.jwtToken) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    // Next.jsが受け取ったリクエストのURLから、クエリパラメータ部分 (?name=...など) を取得します。
    const { search } = new URL(request.url);

    // Railsバックエンドに投げるURLに、受け取ったクエリパラメータをそのまま付け加えます。
    const backendUrl = `http://backend:3000/api/restaurants${search}`;
    
    // デバッグ用に、実際にリクエストするURLをログに出力します。
    console.log(`Forwarding request to: ${backendUrl}`);
    
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
    console.error('店舗一覧取得APIエラー:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};
