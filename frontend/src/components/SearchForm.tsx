import React, { useState, useEffect, ChangeEvent } from 'react';

// 型定義
interface Tag {
  id: number;
  name: string;
  category: string;
}

interface Restaurant {
  id: number;
  name: string;
  area_tag_id: number;
  genre_tag_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  average_rating?: number;
  review_count?: number;
  area_tag?: Tag;
  genre_tag?: Tag;
  url?: string;
}

const SearchForm: React.FC = () => {
  const [searchName, setSearchName] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [areaTags, setAreaTags] = useState<Tag[]>([]);
  const [genreTags, setGenreTags] = useState<Tag[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // タグ一覧取得
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const [areaRes, genreRes] = await Promise.all([
          fetch('/api/tags?category=area'),
          fetch('/api/tags?category=genre'),
        ]);
        if (!areaRes.ok || !genreRes.ok) throw new Error('タグの取得に失敗しました');
        const areaData = await areaRes.json();
        const genreData = await genreRes.json();
        setAreaTags(areaData);
        setGenreTags(genreData);
      } catch (e: any) {
        setError(e.message || 'タグ取得エラー');
      }
    };
    fetchTags();
  }, []);

  // 検索実行
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchName.trim() !== '') params.append('name', searchName.trim());
      if (selectedArea) params.append('area', selectedArea);
      if (selectedGenre) params.append('genre', selectedGenre);
      const res = await fetch(`/api/restaurants?${params.toString()}`);
      if (!res.ok) throw new Error('店舗検索に失敗しました');
      const data = await res.json();
      setRestaurants(data);
    } catch (e: any) {
      setError(e.message || '検索エラー');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <form className="flex flex-col md:flex-row gap-4 items-end" onSubmit={handleSearch}>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">店舗名</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            placeholder="例: カフェ"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">エリア</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={selectedArea}
            onChange={e => setSelectedArea(e.target.value)}
          >
            <option value="">すべて</option>
            {areaTags.map(tag => (
              <option key={tag.id} value={tag.name}>{tag.name}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">ジャンル</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={selectedGenre}
            onChange={e => setSelectedGenre(e.target.value)}
          >
            <option value="">すべて</option>
            {genreTags.map(tag => (
              <option key={tag.id} value={tag.name}>{tag.name}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded font-semibold hover:bg-primary/90 transition"
          disabled={loading}
        >
          {loading ? '検索中...' : '検索'}
        </button>
      </form>
      {error && <div className="mt-4 text-red-500">{error}</div>}
      <div className="mt-8">
        {restaurants.length === 0 && !loading && <div className="text-gray-500">該当する店舗がありません</div>}
        <ul className="space-y-4">
          {restaurants.map(r => (
            <li key={r.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-bold text-lg">
                  {r.url ? (
                    <a href={r.url} className="text-primary hover:underline">{r.name}</a>
                  ) : (
                    r.name
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {r.area_tag?.name} / {r.genre_tag?.name}
                </div>
              </div>
              {typeof r.average_rating === 'number' && (
                <div className="mt-2 md:mt-0 text-yellow-500 font-semibold">★ {r.average_rating.toFixed(1)}</div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchForm;
