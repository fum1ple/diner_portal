"use client";

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
  const [name, setName] = useState("");
  const [areaId, setAreaId] = useState("");
  const [genreId, setGenreId] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSuccess(false);
    try {
      const res = await authenticatedFetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          area_tag_id: Number(areaId),
          genre_tag_id: Number(genreId),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.errors ? JSON.stringify(err.errors) : "登録失敗");
      }
      setSuccess(true);
      setName("");
      setAreaId("");
      setGenreId("");
    } catch (e: any) {
      setSubmitError(e.message || "登録エラー");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <div>タグを取得中...</div>;
  if (error) return <div style={{color: 'red'}}>エラー: {error}</div>;

  return (
    <div>
      <h1>店舗登録フォーム</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>店舗名:
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="店舗名を入力"
              required
            />
          </label>
        </div>
        <div>
          <label>エリア:
            <select value={areaId} onChange={e => setAreaId(e.target.value)} required>
              <option value="">選択してください</option>
              {areaTags.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>ジャンル:
            <select value={genreId} onChange={e => setGenreId(e.target.value)} required>
              <option value="">選択してください</option>
              {genreTags.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit" disabled={!name || !areaId || !genreId || submitLoading}>登録</button>
        {submitLoading && <div>登録中...</div>}
        {submitError && <div style={{color:'red'}}>エラー: {submitError}</div>}
        {success && <div style={{color:'green'}}>登録しました！</div>}
      </form>
    </div>
  );
};

export default RestaurantNewPage;