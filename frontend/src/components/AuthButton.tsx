'use client';

import { signOut, useSession } from 'next-auth/react';
import LoginIcon from '../app/icons/LoginIcon';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const AuthButton = () => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const router = useRouter();

  if (loading) {
    return (
      <button className="bg-blue-600 text-white rounded-full px-4 py-2 flex items-center" disabled>
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
        ロード中...
      </button>
    );
  }

  if (session?.user) {
    return (
      <div className="relative group">
        <button 
          className="bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-2 flex items-center transition-colors" 
          type="button"
        >
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || 'ユーザー画像'}
              width={32}
              height={32}
              className="rounded-full mr-2"
            />
          ) : (
            <div className="bg-blue-600 text-white rounded-full mr-2 flex items-center justify-center w-8 h-8">
              {session.user.name?.[0] || 'U'}
            </div>
          )}
          <span className="truncate max-w-[120px] text-sm font-medium">
            {session.user.name}
          </span>
        </button>
        <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="py-1">
            <a 
              href="/mypage"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              マイページ
            </a>
            <hr className="border-gray-200 my-1" />
            <button
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
              onClick={() => signOut()}
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 flex items-center transition-colors"
      onClick={() => router.push('/auth/signin')}
    >
      <LoginIcon className="mr-2" />
      ログイン
    </button>
  );
};

export default AuthButton;