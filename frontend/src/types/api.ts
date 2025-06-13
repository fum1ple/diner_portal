// API関連の型定義

// 基本的なAPIレスポンス型
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
}

// エラーレスポンス型
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}






// API呼び出し時のオプション型
export interface ApiCallOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}
