import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';

// お気に入り一覧ページ
export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.jwtToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <p>お気に入り一覧を表示するにはログインが必要です。</p>
          <Link href="/auth/signin" className="text-blue-600 underline">ログイン</Link>
        </div>
      </div>
    );
  }

  // Rails APIからお気に入り一覧を取得
  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL || 'http://backend:3000'}/api/favorites`, {
    headers: {
      'Authorization': `Bearer ${session.jwtToken}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    return <div className="p-8">お気に入り一覧の取得に失敗しました</div>;
  }
  const favorites = await res.json();

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">保存したお店</h1>
      {favorites.length === 0 ? (
        <div className="text-gray-500">お気に入りはありません</div>
      ) : (
        <ul className="space-y-4">
          {favorites.map((restaurant: any) => (
            <li key={restaurant.id} className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <div className="font-semibold text-lg">{restaurant.name}</div>
                <div className="text-sm text-gray-500">{restaurant.area_tag?.name} / {restaurant.genre_tag?.name}</div>
              </div>
              <Link href={`/restaurants/${restaurant.id}`} className="text-blue-600 underline mt-2 md:mt-0">詳細を見る</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
