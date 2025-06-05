import { notFound } from 'next/navigation';
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
    fetch(`/api/restaurants/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("店舗が見つかりません");
        return res.json();
      })
      .then((data) => setRestaurant(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <main style={{ padding: 32 }}>読み込み中...</main>;
  }
  if (error) {
    return <main style={{ padding: 32, color: 'red' }}>エラー: {error}</main>;
  }
  if (!restaurant) {
    return <main style={{ padding: 32 }}>データがありません</main>;
  }

  return (
    <main style={{ padding: 32, maxWidth: 480, margin: '0 auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>店舗詳細</h1>
      <div style={{ marginBottom: 8 }}>店舗名: {restaurant.name}</div>
      <div style={{ marginBottom: 8 }}>エリア: {restaurant.area_tag.name}</div>
      <div style={{ marginBottom: 24 }}>ジャンル: {restaurant.genre_tag.name}</div>
      <div style={{ display: 'flex', gap: 12 }}>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ padding: '8px 16px', background: '#4285f4', color: '#fff', border: 'none', borderRadius: 4, textDecoration: 'none', display: 'inline-block' }}
        >
          Google Mapで調べる
        </a>
        <a
          href={`/restaurants/${restaurant.id}/reviews/new`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginLeft: '12px',
            padding: '8px 16px',
            background: '#1976d2',
            color: '#fff',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          レビューを書く
        </a>
      </div>
    </main>
  );
}
