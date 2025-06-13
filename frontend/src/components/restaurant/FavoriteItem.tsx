import Link from 'next/link';
import { Restaurant } from '@/types';

// FavoriteItemコンポーネントが受け取るPropsの型を定義
interface FavoriteItemProps {
  restaurant: Restaurant;
}

// restaurantオブジェクトをPropsとして受け取る
export default function FavoriteItem({ restaurant }: FavoriteItemProps) {
  // FavoritesPageのmapの中にあった<li>要素のJSXをそのままここに移動!
  return (
    <li className="bg-gradient-to-br from-[#e0f2f1] to-white border border-[#4db6ac] rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center justify-between transition hover:shadow-lg">
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
  );
}