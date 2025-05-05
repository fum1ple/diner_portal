'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // ——— デモ用認証情報の判定 ———
    if (email === 'tokieatsdemo@gmail.com' && password === 'tokieatsdemo') {
      // デモ用トークンを保存
      localStorage.setItem('token', 'demo-token')
      // マイページへ遷移
      router.push('/mypage')
      return
    }

    // ——— 本番 API 呼び出し ———
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'ログインに失敗しました')

      // API から返ってきたトークンを保存
      localStorage.setItem('token', data.token)
      router.push('/mypage')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>ログイン</h1>
        <p className={styles.subtitle}>
          アカウント情報を入力してログインしてください
        </p>

        {error && <p className={styles.error}>{error}</p>}

        <label className={styles.field}>
          <span>メールアドレス</span>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </label>

        <label className={styles.field}>
          <span>パスワード</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </label>

        <button
          type="submit"
          className={styles.button}
          disabled={loading}
        >
          {loading ? 'ログイン中…' : '→ ログイン'}
        </button>

        <div className={styles.links}>
          <a href="/signup">新規登録はこちら</a>
          <a href="/forgot-password">パスワードをお忘れですか？</a>
        </div>
      </form>
    </div>
  )
}
