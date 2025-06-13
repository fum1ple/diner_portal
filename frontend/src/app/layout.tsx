'use client';

import './globals.css'
import Image from 'next/image'
import { AuthProvider } from './providers'
import { Noto_Sans_JP } from 'next/font/google';
import QueryProvider from '../components/auth/QueryProvider';
import HeaderContent from '../components/layout/HeaderContent'; 

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
        <QueryProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <HeaderContent />

            {/* MAIN CONTENT */}
            <main className="flex-grow">
              {children}
            </main>

            {/* FOOTER */}
            <footer className="bg-gray-800 text-white py-8">
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
      </QueryProvider>
      </body>
    </html>
  );

export default RootLayout;