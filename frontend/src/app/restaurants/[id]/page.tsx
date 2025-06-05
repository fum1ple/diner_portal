import { notFound } from 'next/navigation';

interface PageProps {
  params: { id: string };
}

export default function RestaurantDetailPage({ params }: PageProps) {
  // 店舗IDをURLから取得
  const { id } = params;

  // デバッグ用: 店舗IDを表示
  return (
    <main style={{ padding: 32 }}>
      <h1>店舗詳細ページ</h1>
      <p>店舗ID: {id}</p>
      {/* 今後ここにAPI連携・UI実装を追加 */}
    </main>
  );
}
