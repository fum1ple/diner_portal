'use client';

import Image from 'next/image';
import Link from 'next/link';
import AuthButtonWrapper from './AuthButtonWrapper';
import { useAuth } from '../hooks/useAuth';
import AddRestaurantButton from './ui/AddRestaurantButton';

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

          {/* 右：ログイン＋店舗追加ボタン */}
          <div className="flex items-center gap-3">
            {/* 検索ボタン削除済み */}
            {/* 店舗追加ボタン（常時表示 or 認証時のみ表示にしたい場合は条件分岐可） */}
            <AddRestaurantButton />
            <div className="flex-shrink-0">
              <AuthButtonWrapper />
            </div>
          </div>
        </div>
      </div>
    </header>
);

export default HeaderContent;