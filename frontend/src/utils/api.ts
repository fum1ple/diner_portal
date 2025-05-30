// API呼び出し用ヘルパー関数
import { getSession } from "next-auth/react";

// Rails APIのベースURL取得
const getRailsApiUrl = () => {
  if (typeof window !== 'undefined') {
    // ブラウザ側からのアクセス
    if (process.env.NODE_ENV === 'production') {
      // 本番環境ではCodespacesのポートフォワーディングを使用
      return `https://${window.location.hostname.replace('-3000', '-4000')}`;
    }
    return 'http://localhost:4000';
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

  console.log('API Request:', {
    url,
    method: options.method || 'GET',
    headers: { ...headers, Authorization: 'Bearer [REDACTED]' }
  });

  return fetch(url, {
    ...options,
    headers,
  });
};

// ユーザープロフィール取得
export const getUserProfile = async () => {
  const response = await authenticatedFetch('/api/user/profile');
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`プロフィール取得に失敗しました: ${response.status} ${errorText}`);
  }
  
  return response.json();
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

// 汎用的なAPI呼び出し関数
export const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await authenticatedFetch(endpoint, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API呼び出しに失敗しました: ${response.status} ${errorText}`);
  }
  
  return response.json();
};
