// =======================================
// サーバーサイド認証ユーティリティ
// =======================================

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * サーバーサイドで認証状態をチェックし、未認証の場合はリダイレクトする
 * @param redirectTo リダイレクト先のパス（デフォルト: '/'）
 * @returns セッション情報
 */
export const requireServerAuth = async (redirectTo: string = '/') => {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect(redirectTo);
  }
  
  return session;
};

/**
 * サーバーサイドで認証状態をチェックし、セッション情報を返す（リダイレクトなし）
 * @returns セッション情報（未認証の場合はnull）
 */
export const getAuthServerSession = async () => await getServerSession(authOptions);