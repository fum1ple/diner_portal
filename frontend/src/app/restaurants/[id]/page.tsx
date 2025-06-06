'use client';

import { useEffect, useState } from "react";

interface PageProps {
  params: { id: string };
}

interface Tag {
  id: number;
  name: string;
  category: string;
}

interface Restaurant {
  id: number;
  name: string;
  area_tag: Tag;
  genre_tag: Tag;
}

export default function RestaurantDetailPage({ params }: PageProps) {
  const { id } = params;
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await fetch(`/api/restaurants/${id}`);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: "エラーが発生しました" }));
          throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setRestaurant(data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return <main className="p-8">読み込み中...</main>;
  }
  if (error) {
    return <main className="p-8 text-red-600">エラー: {error}</main>;
  }
  if (!restaurant) {
    return <main className="p-8">データがありません</main>;
  }

  return (
    <main className="p-8 max-w-md mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl mb-4">店舗詳細</h1>
      <div className="mb-2">店舗名: {restaurant.name}</div>
      <div className="mb-2">エリア: {restaurant.area_tag.name}</div>
      <div className="mb-6">ジャンル: {restaurant.genre_tag.name}</div>
      <div className="flex gap-3">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-500 text-white rounded font-bold inline-block"
        >
          Google Mapで調べる
        </a>
        <a
          href={`/restaurants/${restaurant.id}/reviews/new`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-700 text-white rounded font-bold inline-block ml-3"
        >
          レビューを書く
        </a>
      </div>
    </main>
  );
}
