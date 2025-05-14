'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';
import { createRestaurant } from '../../api/restaurants';

type RestaurantFormData = {
  name: string;
  category: string;
  address: string;
  phone: string;
  website: string;
};

export default function AddRestaurant() {
  const router = useRouter();
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: '',
    category: '',
    address: '',
    phone: '',
    website: '',
  });
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const { name, category, address, phone, website } = formData;
      await createRestaurant({
        name,
        category,
        address,
        phone,
        website,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      router.push('/restaurants'); // 一覧ページへリダイレクト
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>新しいレストランを追加</h1>
      <p className={styles.description}>
        あなたのおすすめのレストラン情報を入力してください。同僚と共有されます。
      </p>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">店舗名 *</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="例: 寿司 匠"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">カテゴリ *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">カテゴリを選択</option>
            <option value="japanese">和食</option>
            <option value="chinese">中華</option>
            <option value="western">洋食</option>
            <option value="other">その他</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="address">住所 *</label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="例: 東京都中央区銀座4-1-1"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone">電話番号</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="例: 03-1234-5678"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="website">ウェブサイト</label>
          <input
            type="url"
            id="website"
            name="website"
            placeholder="例: https://example.com"
            value={formData.website}
            onChange={handleChange}
          />
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? '送信中...' : '次へ'}
        </button>
      </form>
    </div>
  );
}
