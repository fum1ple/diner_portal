// ファイルパス: frontend/src/app/api/restaurants/[id]/favorite/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // authOptionsのパスは実際のプロジェクトに合わせてください

// URLのパスパラメータからidを取得するための型定義
interface RouteContext {
  params: {
    id: string; // [restaurantId]から[id]に変更
  };
}

// --- お気に入り登録 (POST) ---
export const POST = async (request: NextRequest, context: RouteContext) => {
  try {
    // ★★★ 修正点1: getServerSessionに引数を渡さない ★★★
    // APIルートでは、引数なしで呼び出すのが一般的です
    const session = await getServerSession(authOptions); 
    if (!session?.jwtToken) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // URLから店舗IDを取得 ([restaurantId]から[id]に変更)
    const { id } = context.params;

    // Railsバックエンドの「お気に入り登録」APIエンドポイント
    const backendUrl = `http://backend:3000/api/restaurants/${id}/favorite`; // パラメータ名をidに変更

    // Rails APIにリクエストを転送
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.jwtToken}`,
      },
    });

    // バックエンドからのレスポンスをそのままフロントエンドに返す
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('[BFF] お気に入り登録APIエラー:', error);
    return NextResponse.json(
      { error: 'サーバー内部でエラーが発生しました。' },
      { status: 500 }
    );
  }
};

// --- お気に入り解除 (DELETE) ---
export const DELETE = async (request: NextRequest, context: RouteContext) => {
  try {
    // ★★★ 修正点2: こちらも同様に引数を渡さない ★★★
    const session = await getServerSession(authOptions);
    if (!session?.jwtToken) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // URLから店舗IDを取得 ([restaurantId]から[id]に変更)
    const { id } = context.params;

    // Railsバックエンドの「お気に入り解除」APIエンドポイント
    const backendUrl = `http://backend:3000/api/restaurants/${id}/favorite`; // パラメータ名をidに変更

    // Rails APIにリクエストを転送
    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.jwtToken}`,
      },
    });
    
    // バックエンドのレスポンスがボディなし(204 No Content)の場合も考慮
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('[BFF] お気に入り解除APIエラー:', error);
    return NextResponse.json(
      { error: 'サーバー内部でエラーが発生しました。' },
      { status: 500 }
    );
  }
};

