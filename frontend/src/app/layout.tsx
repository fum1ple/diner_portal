'use client';

import './globals.scss'
import Image from 'next/image'
import SearchIcon from './icons/SearchIcon'
import { AuthProvider } from './providers'
import Link from 'next/link'
import AuthButtonWrapper from './components/AuthButtonWrapper'
import { useEffect, useState } from 'react'

// インラインスタイルを追加
const customStyles = `
  .fw-bold, .fw-semibold, .fw-medium, 
  h1, h2, h3, h4, h5, h6, 
  .h1, .h2, .h3, .h4, .h5, .h6, 
  .display-1, .display-2, .display-3, .display-4, .display-5, .display-6 {
    color: #000 !important;
  }

  /* Bootstrap Icons の読み込み */
  @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css");
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // クライアント側でのレンダリングを追跡するステート
  const [isMounted, setIsMounted] = useState(false);

  // マウント後にステートを更新して、クライアント側のレンダリングを示す
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <html lang="ja">
      <head>
        <title>TOKIEATS</title>
        <meta name="description" content="社内限定レストラン共有プラットフォーム" />
        <style dangerouslySetInnerHTML={{ __html: customStyles }} />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
      </head>
      <body className="bg-light">
        <AuthProvider>
          <div className="d-flex flex-column min-vh-100">
            {/* HEADER */}
            <header className="sticky-top bg-white shadow-sm py-3">
              <div className="container">
                <div className="row align-items-center">
                  {/* 左：ロゴ */}
                  <div className="col-auto d-flex align-items-center">
                    <Image
                      src="/TOKIEATS-logo.png"
                      alt="TOKIEATS ロゴ"
                      width={32}
                      height={32}
                      priority
                      className="me-2"
                    />
                    <span className="fw-bold fs-5">TOKIEATS</span>
                  </div>

                  {/* 中央：ナビゲーション */}
                  <div className="col">
                    <nav className="d-flex justify-content-center gap-4">
                      <Link href="/" className="text-decoration-none text-secondary fw-medium">ホーム</Link>
                      <a href="/restaurants" className="text-decoration-none text-secondary fw-medium">レストラン一覧</a>
                      <a href="/mypage" className="text-decoration-none text-secondary fw-medium">マイレビュー</a>
                    </nav>
                  </div>
    
                  {/* 右：検索＆ログイン */}
                  <div className="col-auto d-flex align-items-center gap-3">
                    <div className="position-relative d-flex align-items-center bg-light rounded-pill px-3 py-2" style={{ width: '200px' }}>
                      <SearchIcon className="text-muted me-2" />
                      <input
                        type="search"
                        placeholder="検索"
                        className="form-control form-control-sm border-0 bg-transparent shadow-none p-0"
                      />
                    </div>
                    <AuthButtonWrapper />
                  </div>
                </div>
              </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-grow-1 container py-4">{children}</main>

            {/* FOOTER */}
            <footer className="bg-dark text-white py-4">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-auto d-flex align-items-center">
                    <Image 
                      src="/TOKIEATS-logo.png" 
                      alt="TOKIEATS ロゴ" 
                      width={24} 
                      height={24} 
                      priority
                      className="me-2"
                    />
                    <span className="fw-bold">TOKIEATS</span>
                  </div>
                  <div className="col text-end text-muted">
                    © 2025 TOKIEATS. 社内利用限定.
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}