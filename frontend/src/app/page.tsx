import Image from 'next/image'
import styles from './page.module.css'
import LoginIcon from './icons/LoginIcon'

export default function Home() {
  return (
    <div className={styles.container}>
      {/* — HERO — */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.badge}>社内限定サービス</span>
          <h1 className={styles.heroTitle}>
            社内の<span className={styles.highlight}>おすすめレストラン</span> を共有しよう
          </h1>
          <p className={styles.heroDesc}>
            TOKIEATSは、社員同士でおすすめのレストランを共有し、評価できる社内専用のプラットフォームです。新しいランチスポットを探したり、特別な会食の場所を見つけたりするのに役立ちます。
          </p>
          <a href="/restaurants" className={styles.heroCta}>レストランを探す</a>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.imagePlaceholder}>[画像エリア]</div>
        </div>
      </section>

      {/* — みんなのおすすめ（人気のレストラン） — */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <span className={styles.sectionBadge}>人気のレストラン</span>
          <h2 className={styles.sectionTitle}>みんなのおすすめ</h2>
          <p className={styles.sectionDesc}>
            社員からの評価が高いおすすめのレストランをチェックしましょう
          </p>

          <div className={styles.cardGrid}>
            {[
              { name: '寿司匠', badge: '寿司', rating: 4.8, reviews: 24, loc: '東京都中央区' },
              { name: 'イタリアーノ', badge: 'イタリアン', rating: 4.6, reviews: 18, loc: '東京都渋谷区' },
              { name: '焼肉 和牛', badge: '焼肉', rating: 4.7, reviews: 32, loc: '東京都新宿区' },
            ].map((r, i) => (
              <div key={i} className={styles.cardDetail}>
                <div className={styles.cardImage} />
                <span className={styles.detailBadge}>{r.badge}</span>
                <div className={styles.detailBody}>
                  <h3 className={styles.cardName}>{r.name}</h3>
                  <div className={styles.rating}>
                    <span className={styles.stars}>
                      {'★'.repeat(Math.floor(r.rating)) + '☆'}
                    </span>
                    <span className={styles.ratingText}>
                      {r.rating}（{r.reviews}件のレビュー）
                    </span>
                  </div>
                  <p className={styles.location}>📍 {r.loc}</p>
                </div>
                <a href={`/restaurants/${i+1}`} className={styles.detailCta}>
                  詳細を見る
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* — 最近追加されたレストラン（新着情報） — */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <span className={styles.sectionBadge}>新着情報</span>
          <h2 className={styles.sectionTitle}>最近追加されたレストラン</h2>
          <p className={styles.sectionDesc}>
            同僚が最近発見した新しいレストランをチェックしましょう
          </p>

          <div className={styles.cardGrid}>
            {['ラーメン一番', 'カフェ モーニング', 'タイ料理 バンコク', 'フレンチ ビストロ'].map((name, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.cardImage} />
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardName}>{name}</h3>
                  <p className={styles.cardCategory}>{name.split(' ')[0]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* — ログインCTA — */}
      <section className={styles.loginSection}>
        <div className={styles.inner}>
          <span className={styles.sectionBadge}>もっと活用するには</span>
          <h2 className={styles.sectionTitle}>
            ログインして、おすすめのレストランを共有しましょう
          </h2>
          <p className={styles.sectionDesc}>
            ログインすると、新しいレストランの追加やレビューの投稿ができるようになります。<br />
            あなたの発見や感想を同僚と共有して、より豊かなランチタイムを実現しましょう。
          </p>
          {/* ヘッダーと同じスタイルのシンプルなリンクに変更 */}
          <a href="/login" className={styles.sectionLogin}>
            <LoginIcon className={styles.sectionLoginIcon} />
            ログイン
          </a>
        </div>
      </section>
    </div>
  )
}
