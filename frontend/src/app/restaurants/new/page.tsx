import React, { useEffect, useState } from "react";
import { authenticatedFetch } from "@/utils/api";

interface Tag {
  id: number;
  name: string;
  category: string;
}

const RestaurantNewPage = () => {
  const [areaTags, setAreaTags] = useState<Tag[]>([]);
  const [genreTags, setGenreTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const [areaRes, genreRes] = await Promise.all([
          authenticatedFetch("/api/tags?category=area"),
          authenticatedFetch("/api/tags?category=genre"),
        ]);
        if (!areaRes.ok || !genreRes.ok) throw new Error("タグ取得に失敗しました");
        setAreaTags(await areaRes.json());
        setGenreTags(await genreRes.json());
      } catch (e: any) {
        setError(e.message || "タグ取得エラー");
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  if (loading) return <div>タグを取得中...</div>;
  if (error) return <div style={{color: 'red'}}>エラー: {error}</div>;

  return (
    <div>
      <h1>店舗登録フォーム</h1>
      <div>
        <label>エリア:
          <select>
            <option value="">選択してください</option>
            {areaTags.map(tag => (
              <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>ジャンル:
          <select>
            <option value="">選択してください</option>
            {genreTags.map(tag => (
              <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
          </select>
        </label>
      </div>
      {/* ここに店舗名入力や送信ボタンなど追加予定 */}
    </div>
  );
};

export default RestaurantNewPage;