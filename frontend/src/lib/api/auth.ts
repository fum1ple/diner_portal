// 認証関連API
import { getSession } from "next-auth/react";

// Rails APIのベースURL取得
const getRailsApiUrl = () => {
  // 環境変数で明示的に設定されている場合はそれを使用
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL;
  }
  
  if (typeof window !== 'undefined') {
    // ブラウザ側からのアクセス
    if (process.env.NODE_ENV === 'production') {
      // プロダクション環境では環境変数を必須とする
      throw new Error('NEXT_PUBLIC_BACKEND_URL環境変数が設定されていません');
    }
    return 'http://localhost:3000';
  } else {
    // サーバーサイドからのアクセス（コンテナ内）
    return process.env.BACKEND_INTERNAL_URL || 'http://backend:3000';
  }
};

// 認証ヘッダー付きでAPIリクエストを送信
export const authenticatedFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const session = await getSession();
  
  if (!session?.jwtToken) {
    throw new Error('認証が必要です。ログインしてください。');
  }

  const url = `${getRailsApiUrl()}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.jwtToken}`,
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    return response;
  } catch (error) {
    console.error('Fetch エラー:', error);
    throw error;
  }
};

// 認証に関するAPIは基本的にNextAuthが処理するため、
// 現在は直接的なauth APIエンドポイントは定義していません