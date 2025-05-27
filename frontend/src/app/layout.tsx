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
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" async></script>
      </head>
      <body className="bg-light">
        <AuthProvider>
          <div className="d-flex flex-column min-vh-100">
            {/* HEADER */}
            <header className="sticky-top bg-white shadow-sm py-2">
              <div className="container">
                <div className="row align-items-center">
                  {/* 左：ロゴ */}
                  <div className="col-auto d-flex align-items-center">
                    <Link href="/" className="d-flex align-items-center text-decoration-none"></Link>
                      <Image
                        src="/TOKIEATS-logo.png"
                        alt="TOKIEATS ロゴ"
                        width={40}
                        height={40}
                        priority
                        className="me-3"
                      />
                      <span className="fw-bold fs-4">TOKIEATS</span>
                    </Link>
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
                    <div className="dropdown">
                      <button 
                        className="btn btn-light rounded-circle p-2" 
                        type="button" 
                        data-bs-toggle="dropdown" 
                        aria-expanded="false"
                        style={{ width: '40px', height: '40px' }}
                      >
                        <SearchIcon className="text-muted" style={{ width: '16px', height: '16px' }} />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end p-3 shadow" style={{ minWidth: '300px' }}>
                        <div className="position-relative">
                          <SearchIcon className="position-absolute text-muted" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px' }} />
                          <input
                            type="search"
                            placeholder="レストランを検索..."
                            className="form-control ps-5"
                            autoFocus
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