import './globals.css'
import Image from 'next/image'
import styles from './layout.module.css'
import SearchIcon from './icons/SearchIcon'
import LoginIcon from './icons/LoginIcon'

export const metadata = {
  title: 'TOKIEATS',
  description: '社内限定レストラン共有プラットフォーム',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={styles.body}>
        <div className={styles.wrapper}>

          {/* HEADER */}
          <header className={styles.header}>
            {/* 左：ロゴ */}
            <div className={styles.logoArea}>
              <Image
                src="/TOKIEATS-logo.png"
                alt="TOKIEATS ロゴ"
                width={32}
                height={32}
                priority
              />
              <span className={styles.logoText}>TOKIEATS</span>
            </div>

            {/* 中央：ナビゲーション */}
            <nav className={styles.nav}>
              <a href="/" className={styles.navItem}>ホーム</a>
              <a href="/restaurants" className={styles.navItem}>レストラン一覧</a>
              <a href="/mypage" className={styles.navItem}>マイレビュー</a>
            </nav>

            {/* 右：検索＆ログイン */}
            <div className={styles.actions}>
              <div className={styles.searchBox}>
                <SearchIcon className={styles.searchIcon} />
                <input
                  type="search"
                  placeholder="検索"
                  className={styles.searchInput}
                />
              </div>
              <a href="/login" className={styles.loginBox}>
                <LoginIcon className={styles.loginIcon} />
                ログイン
              </a>
            </div>
          </header>

          {/* MAIN CONTENT */}
          <main className={styles.main}>{children}</main>

          {/* FOOTER */}
          <footer className={styles.footer}>
            <div className={styles.footerLeft}>
              <Image src="/TOKIEATS-logo.png" alt="TOKIEATS ロゴ" width={24} height={24} priority/>
              <span className={styles.footerLogoText}>TOKIEATS</span>
            </div>
            <div className={styles.footerRight}>
              © 2025 TOKIEATS. 社内利用限定.
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
