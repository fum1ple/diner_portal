// API呼び出し用ヘルパー関数
import { getSession } from "next-auth/react";

// Rails APIのベースURL取得
const getRailsApiUrl = () => {
  if (typeof window !== 'undefined') {
    // ブラウザ側からのアクセス
    return process.env.NODE_ENV === 'production' 
      ? `https://${window.location.hostname.replace('-3000', '-4000')}`
      : 'http://localhost:3000';
  } else {
    // サーバーサイドからのアクセス（コンテナ内）
    return 'http://backend:3000';
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

  return fetch(url, { ...options, headers });
};

// ユーザープロフィール更新
export const updateUserProfile = async (userData: {
  name?: string;
  email?: string;
}) => {
  const response = await authenticatedFetch('/api/user/update', {
    method: 'PUT',
    body: JSON.stringify({ user: userData }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`プロフィール更新に失敗しました: ${response.status} ${errorText}`);
  }
  
  return response.json();
};
