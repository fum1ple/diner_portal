'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

type Restaurant = { id: number; name: string; category: string }

export default function MyPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetch('/api/my_restaurants', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => (r.ok ? r.json() : []))
        .then(data => setRestaurants(data))
        .catch(() => setRestaurants([]))
    } else {
      setRestaurants([])
    }
  }, [])

  if (restaurants === null) {
    return <p className={styles.loading}>読み込み中…</p>
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* ← ここから他セクションと同じ */}
        <span className={styles.sectionBadge}>マイレビュー</span>
        <h2 className={styles.sectionTitle}>あなたが追加したレストラン一覧</h2>
        <p className={styles.sectionDesc}>
          あなたが追加したレストランを一覧で確認できます
        </p>
        {/* → ここまで */}

        {restaurants.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🍴</div>
            <p className={styles.emptyText}>まだレストランを追加していません</p>
            <p className={styles.emptySubtext}>
              あなたのおすすめのレストランを追加して、社内で共有しましょう
            </p>
            <Link href="/restaurants/new" className={styles.addButton}>
              ＋ レストランを追加する
            </Link>
          </div>
        ) : (
          <ul className={styles.list}>
            {restaurants.map(r => (
              <li key={r.id} className={styles.item}>
                {r.name}（{r.category}）
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
