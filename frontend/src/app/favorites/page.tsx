import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Restaurant } from '@/types';
import FavoriteItem from '@/components/FavoriteItem';

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);
  
  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL || 'http://backend:3000'}/api/favorites`, {
      headers: {
        'Authorization': `Bearer ${session?.jwtToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('API Error:', res.status, await res.text());
      throw new Error('お気に入り一覧の取得に失敗しました');
    }

    const favorites: Restaurant[] = await res.json();

    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6 text-teal-700">保存したお店</h1>
        {favorites.length === 0 ? (
          <div className="text-gray-500">お気に入りはありません</div>
        ) : (
          <ul className="space-y-4">
            {favorites.map(restaurant => (
              <FavoriteItem
                key={restaurant.id}
                restaurant={restaurant}
              />
            ))}
          </ul>
        )}
      </div>
    );

  } catch (error) {
    console.error('予期せぬエラーが発生しました:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-red-600">データの取得に失敗しました。</p>
          <p>時間をおいて再度お試しください。</p>
        </div>
      </div>
    );
  }
}