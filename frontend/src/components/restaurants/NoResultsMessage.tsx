'use client';

import { useRouter } from 'next/navigation';
import { RestaurantSearchParams } from '@/types/restaurant';

interface NoResultsMessageProps {
  searchParams: RestaurantSearchParams | null;
}

export default function NoResultsMessage({ 
  searchParams
}: NoResultsMessageProps) {
  const router = useRouter();

  const handleAddRestaurant = () => {
    const params = new URLSearchParams();
    if (searchParams?.name) params.set('name', searchParams.name);
    if (searchParams?.area) params.set('area', searchParams.area);
    if (searchParams?.genre) params.set('genre', searchParams.genre);
    
    router.push(`/restaurants/new?${params.toString()}`);
  };
  const getSearchDescription = () => {
    if (!searchParams) return '';
    
    const parts = [];
    if (searchParams.name) parts.push(`「${searchParams.name}」`);
    if (searchParams.area) parts.push(`${searchParams.area}エリア`);
    if (searchParams.genre) parts.push(`${searchParams.genre}ジャンル`);
    
    return parts.length > 0 ? `${parts.join('・')}の条件で` : '';
  };

  return (
    <div className="text-center py-12">
      <div className="mb-6">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {getSearchDescription()}該当する店舗がありません
        </h3>
      </div>

      <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-lg p-6 max-w-xl mx-auto border border-teal-100">
        <div className="text-teal-800 font-medium mb-3 text-lg">
          TOKIEATSは皆で作るレストランデータベースです。
        </div>
        <div className="text-sm text-teal-700 mb-4">
          新しい店舗を追加して、チームに情報を共有しませんか？
        </div>
        
        <div className="text-sm text-gray-600 mb-4 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-teal-500">💡</span>
            <span className="font-medium">追加方法のガイド：</span>
          </div>
          <ul className="ml-6 space-y-1">
            <li>• 基本情報（店名・場所・ジャンル）を入力</li>
            <li>• 詳細情報は後から追加・編集可能</li>
            <li>• チームメンバーがすぐに参考にできます</li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleAddRestaurant}
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>📝</span>
            この店舗を追加する
          </button>
          <button
            onClick={() => window.history.back()}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>🔄</span>
            検索条件を変更する
          </button>
        </div>
      </div>
    </div>
  );
}