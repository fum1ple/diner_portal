import { notFound } from 'next/navigation';

interface PageProps {
  params: { id: string };
}

export default function RestaurantDetailPage({ params }: PageProps) {
  // 店舗IDをURLから取得
  const { id } = params;

  // --- ダミーデータ（API連携前提） ---
  const restaurant = {
    name: "トキエイツ渋谷店",
    area_tag: { name: "渋谷" },
    genre_tag: { name: "イタリアン" },
  };

  return (
    <main style={{ padding: 32, maxWidth: 480, margin: '0 auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>店舗詳細</h1>
      <div style={{ marginBottom: 8 }}>店舗名: {restaurant.name}</div>
      <div style={{ marginBottom: 8 }}>エリア: {restaurant.area_tag.name}</div>
      <div style={{ marginBottom: 24 }}>ジャンル: {restaurant.genre_tag.name}</div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button style={{ padding: '8px 16px', background: '#4285f4', color: '#fff', border: 'none', borderRadius: 4 }}>Google Mapで調べる</button>
        <button style={{ padding: '8px 16px', background: '#f4b942', color: '#fff', border: 'none', borderRadius: 4 }}>レビューを書く</button>
      </div>
    </main>
  );
}
