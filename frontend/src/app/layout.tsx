'use client';

import './globals.css'
import Image from 'next/image'
import SearchIcon from './icons/SearchIcon'
import { AuthProvider } from './providers'
import Link from 'next/link'
import AuthButtonWrapper from '../components/AuthButtonWrapper'
import { Noto_Sans_JP } from 'next/font/google'; 

const notoSansJP = Noto_Sans_JP({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="ja" className={`${notoSansJP.className}`}>
    <head>
        <title>TOKIEATS</title>
        <meta name="description" content="社内限定レストラン共有プラットフォーム" />
      </head>
      <body className="bg-slate-50">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            {/* HEADER */}
            <header className="sticky top-0 bg-white shadow-sm py-2 z-50">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                  {/* 左：ロゴ */}
                  <div className="flex items-center">
                    <Image
                      src="/TOKIEATS-logo.png"
                      alt="TOKIEATS ロゴ"
                      width={40}
                      height={40}
                      priority
                      className="mr-3"
                    />
                    <span className="font-bold text-xl">TOKIEATS</span>
                  </div>

                  {/* 中央：ナビゲーション */}
                  <nav className="hidden md:flex justify-center gap-6">
                    <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">ホーム</Link>
                    <Link href="/top" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">TOP</Link>
                    <Link href="/mypage" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">マイページ</Link>
                  </nav>
    
                  {/* 右：検索＆ログイン */}
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <button 
                        className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors" 
                        style={{ width: '40px', height: '40px' }}
                      >
                        <SearchIcon className="text-gray-600 w-4 h-4" />
                      </button>
                      <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border p-3 min-w-[300px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="relative">
                          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="search"
                            placeholder="レストランを検索..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                    <AuthButtonWrapper />
                  </div>
                </div>
              </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>

            {/* FOOTER */}
            <footer className="bg-gray-900 text-white py-6">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Image 
                      src="/TOKIEATS-logo.png" 
                      alt="TOKIEATS ロゴ" 
                      width={24} 
                      height={24} 
                      priority
                      className="mr-2"
                    />
                    <span className="font-bold">TOKIEATS</span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    © 2025 TOKIEATS. 社内利用限定.
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );

export default RootLayout;