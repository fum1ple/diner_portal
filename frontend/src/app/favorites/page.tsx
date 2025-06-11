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
      <h1 className="text-2xl font-bold mb-6 text-teal-700">保存したお店</h1>
      {favorites.length === 0 ? (
        <div className="text-gray-500">お気に入りはありません</div>
      ) : (
        <ul className="space-y-4">
          {favorites.map((restaurant: any) => (
            <li key={restaurant.id} className="bg-gradient-to-br from-[#e0f2f1] to-white border border-[#4db6ac] rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center justify-between transition hover:shadow-lg">
              <div>
                <Link href={`/restaurants/${restaurant.id}`} className="font-semibold text-lg text-[#26a69a] underline hover:text-[#66bb6a] transition-colors">
                  {restaurant.name}
                </Link>
                <div className="flex gap-2 mt-1">
                  {restaurant.area_tag?.name && (
                    <span className="inline-block bg-[#4db6ac]/20 text-[#26a69a] text-xs px-2 py-0.5 rounded font-medium border border-[#4db6ac]/30">
                      {restaurant.area_tag.name}
                    </span>
                  )}
                  {restaurant.genre_tag?.name && (
                    <span className="inline-block bg-[#66bb6a]/20 text-[#388e3c] text-xs px-2 py-0.5 rounded font-medium border border-[#66bb6a]/30">
                      {restaurant.genre_tag.name}
                    </span>
                  )}
                </div>
              </div>
              <Link href={`/restaurants/${restaurant.id}`} className="text-[#26a69a] underline mt-2 md:mt-0 hover:text-[#66bb6a] transition-colors font-semibold">
                詳細を見る
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
