// frontend/src/app/restaurants/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // 店舗名をクリックして詳細ページに遷移するためにLinkをインポート

// --- 型定義 ---
// コンポーネント内で使用するデータの方を明確に定義します。

interface Tag {
  id: number;
  name: string;
  category: string;
}

interface Restaurant {
  id: number;
  name: string;
  url?: string; // バックエンドから渡される詳細ページのURL
  area_tag?: Tag;
  genre_tag?: Tag;
  average_rating?: number;
}

// --- メインコンポーネント ---

export default function RestaurantListPage() {
  // --- State管理 ---
  // 画面の状態を管理するための変数を定義します。

  // 検索フォームの入力値を管理
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [genre, setGenre] = useState('');

  // プルダウンメニューの選択肢となるタグ情報を管理
  const [areaTags, setAreaTags] = useState<Tag[]>([]);
  const [genreTags, setGenreTags] = useState<Tag[]>([]);

  // APIから取得した店舗の検索結果を管理
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  
  // データの読み込み状態やエラー状態を管理
  const [loading, setLoading] = useState(true); // 初期表示でデータを読み込むため、最初はtrue
  const [error, setError] = useState<string | null>(null);

  // --- データ取得ロジック (副作用) ---

  // エリアとジャンルのタグ一覧をAPIから取得する
  useEffect(() => {
    const fetchTags = async () => {
      try {
        // Promise.allで2つのAPIを並行して呼び出し、効率化
        const [areaRes, genreRes] = await Promise.all([
          fetch('/api/tags?category=area'),
          fetch('/api/tags?category=genre'),
        ]);

        if (!areaRes.ok || !genreRes.ok) {
          throw new Error('タグ情報の取得に失敗しました。');
        }

        const areaData = await areaRes.json();
        const genreData = await genreRes.json();

        setAreaTags(areaData);
        setGenreTags(genreData);
      } catch (e: any) {
        setError(e.message || '予期せぬエラーが発生しました。');
      }
    };
    fetchTags();
  }, []); // 空の依存配列[]は、このuseEffectがコンポーネントの初回マウント時に一度だけ実行されることを意味します。

  // 店舗一覧を取得・検索する関数
  const fetchRestaurants = async (searchParams?: { name?: string; area?: string; genre?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (searchParams?.name) query.append('name', searchParams.name);
      if (searchParams?.area) query.append('area', searchParams.area);
      if (searchParams?.genre) query.append('genre', searchParams.genre);
      
      const res = await fetch(`/api/restaurants?${query.toString()}`);
      if (!res.ok) throw new Error('店舗情報の取得に失敗しました。');
      
      const data = await res.json();
      setRestaurants(data);
    } catch (e: any) {
      setError(e.message || '予期せぬエラーが発生しました。');
      setRestaurants([]); // エラー時はリストを空にする
    } finally {
      setLoading(false);
    }
  };

  // 初回表示時に全店舗の一覧を取得する
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // --- イベントハンドラ ---
  // ユーザーの操作（クリックなど）に対応する関数を定義します。

  // 検索フォームが送信されたときの処理
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // フォーム送信によるページの再読み込みを防ぐ
    fetchRestaurants({ name, area, genre });
  };

  // 検索条件をクリアする処理
  const handleClear = () => {
    setName('');
    setArea('');
    setGenre('');
    fetchRestaurants(); // 条件なしで再度APIを呼び出し、全件表示に戻す
  };

  // --- UIの描画 (JSX) ---

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">店舗検索</h1>
        
        {/* 検索フォーム */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-lg shadow-md mb-8">
          <input
            type="text"
            placeholder="店舗名で検索"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full md:w-auto flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <select
            value={area}
            onChange={e => setArea(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="">すべてのエリア</option>
            {areaTags.map(tag => (
              <option key={tag.id} value={tag.name}>{tag.name}</option>
            ))}
          </select>
          <select
            value={genre}
            onChange={e => setGenre(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="">すべてのジャンル</option>
            {genreTags.map(tag => (
              <option key={tag.id} value={tag.name}>{tag.name}</option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600 transition whitespace-nowrap disabled:bg-gray-400"
            disabled={loading}
          >
            検索
          </button>
          <button
            type="button"
            className="w-full md:w-auto px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition whitespace-nowrap disabled:bg-gray-400"
            onClick={handleClear}
            disabled={loading}
          >
            クリア
          </button>
        </form>

        {/* 検索結果表示 */}
        <div className="bg-white rounded-lg shadow-md p-4">
          {loading ? (
            <div className="text-center text-gray-500 py-8">検索中...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">エラー: {error}</div>
          ) : restaurants.length === 0 ? (
            <div className="text-center text-gray-400 py-8">該当する店舗がありません。</div>
          ) : (
            <ul className="space-y-4">
              {restaurants.map((r) => (
                <li key={r.id} className="border-b last:border-b-0 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <Link href={r.url || `/restaurants/${r.id}`} className="font-bold text-lg text-teal-600 hover:underline">
                        {r.name}
                    </Link>
                    <div className="text-sm text-gray-500 mt-1">
                      <span>{r.area_tag?.name}</span>
                      <span className="mx-2">/</span>
                      <span>{r.genre_tag?.name}</span>
                    </div>
                  </div>
                  {typeof r.average_rating === 'number' && (
                    <div className="text-yellow-500 font-bold text-lg whitespace-nowrap">
                      ★ {r.average_rating.toFixed(1)}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}

