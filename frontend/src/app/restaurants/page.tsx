// 店舗一覧ページ: 検索フォームUIコンポーネント設置用
'use client';
import { useState, useEffect } from 'react';

interface Tag {
  id: number;
  name: string;
  category: string;
}

export default function RestaurantListPage() {
  // 検索フォーム用state
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [genre, setGenre] = useState('');
  const [areaTags, setAreaTags] = useState<Tag[]>([]);
  const [genreTags, setGenreTags] = useState<Tag[]>([]);

  // 検索結果用state
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // タグ一覧APIからエリア・ジャンル取得
  useEffect(() => {
    fetch('/api/tags?category=area')
      .then(res => res.json())
      .then(data => setAreaTags(data));
    fetch('/api/tags?category=genre')
      .then(res => res.json())
      .then(data => setGenreTags(data));
  }, []);

  // 検索実行
  const fetchRestaurants = async (params?: { name?: string; area?: string; genre?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (params?.name) query.append('name', params.name);
      if (params?.area) query.append('area', params.area);
      if (params?.genre) query.append('genre', params.genre);
      const res = await fetch(`/api/restaurants${query.toString() ? '?' + query.toString() : ''}`);
      if (!res.ok) throw new Error('検索APIエラー');
      const data = await res.json();
      setRestaurants(data);
    } catch (e: any) {
      setError(e.message || '検索に失敗しました');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  // 初回全件取得
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // 検索フォームsubmit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRestaurants({ name, area, genre });
  };

  // クリア
  const handleClear = () => {
    setName(''); setArea(''); setGenre('');
    fetchRestaurants();
  };

  // 検索フォームUI
  return (
    <main className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">店舗検索</h1>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-center bg-slate-50 p-4 rounded-lg shadow mb-8">
          <input
            type="text"
            placeholder="店舗名で検索"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full md:w-1/3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <select
            value={area}
            onChange={e => setArea(e.target.value)}
            className="w-full md:w-1/4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="">エリア選択</option>
            {areaTags.map(tag => (
              <option key={tag.id} value={tag.name}>{tag.name}</option>
            ))}
          </select>
          <select
            value={genre}
            onChange={e => setGenre(e.target.value)}
            className="w-full md:w-1/4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="">ジャンル選択</option>
            {genreTags.map(tag => (
              <option key={tag.id} value={tag.name}>{tag.name}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-6 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition"
            disabled={loading}
          >
            検索
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            onClick={handleClear}
            disabled={loading}
          >
            クリア
          </button>
        </form>
        {/* 検索結果表示 */}
        {loading ? (
          <div className="text-center text-teal-500 py-8">検索中...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : restaurants.length === 0 ? (
          <div className="text-gray-400 text-center">該当する店舗がありません</div>
        ) : (
          <ul className="space-y-4">
            {restaurants.map((r) => (
              <li key={r.id} className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center gap-2 border border-slate-100">
                <div className="font-bold text-lg">{r.name}</div>
                <div className="text-sm text-slate-500">{r.area_tag?.name}</div>
                <div className="text-sm text-slate-500">{r.genre_tag?.name}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
