'use client';

import Image from 'next/image';
import Link from 'next/link';
import SearchIcon from '../app/icons/SearchIcon';
import AuthButtonWrapper from './AuthButtonWrapper';
import { useAuth } from '../hooks/useAuth';

const HeaderContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 bg-white shadow-sm py-4 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* 左：ロゴ */}
          <div className="flex items-center">
            <Image
              src="/TOKIEATS-logo.png"
              alt="TOKIEATS ロゴ"
              width={48}
              height={48}
              priority
              className="mr-3"
            />
            <span className="font-bold text-2xl">TOKIEATS</span>
          </div>

          {/* 中央：ナビゲーション */}
          <nav className="hidden md:flex justify-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium text-lg transition-colors">ホーム</Link>
            <Link href="/top" className="text-gray-600 hover:text-gray-900 font-medium text-lg transition-colors">TOP</Link>
            <Link href="/mypage" className="text-gray-600 hover:text-gray-900 font-medium text-lg transition-colors">マイページ</Link>
          </nav>

          {/* 右：検索＆ログイン */}
          <div className="flex items-center gap-3">
            {/* 検索ボタン（ログイン時のみ表示） */}
            {isAuthenticated && (
              <div className="relative group">
                <div className="absolute right-0 top-0 w-11 group-hover:w-72 h-11 bg-gray-100 group-hover:bg-white rounded-full transition-all duration-300 group-hover:shadow-lg group-hover:border group-hover:border-gray-200 overflow-hidden group-hover:-translate-x-15">
                  <div className="flex items-center h-full">
                    <div className="w-11 flex-shrink-0 flex items-center justify-center">
                      <SearchIcon className="text-gray-600 w-4 h-4" />
                    </div>
                    <input
                      type="search"
                      placeholder="レストランを検索..."
                      className="flex-1 px-3 py-2 bg-transparent border-none outline-none text-sm placeholder-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                </div>
                <div className="w-11 h-11"></div>
              </div>
            )}
            <div className="flex-shrink-0">
              <AuthButtonWrapper />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderContent;