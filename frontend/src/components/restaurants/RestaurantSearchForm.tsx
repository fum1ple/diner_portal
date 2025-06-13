'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTags } from '@/hooks/useTags';
import SearchableDropdown from '@/components/ui/SearchableDropdown';


export default function RestaurantSearchForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { areaTags, genreTags, loading: tagsLoading } = useTags();

  // ローカル状態で入力値を管理
  const [formData, setFormData] = useState({
    name: searchParams.get('name') ?? '',
    area: searchParams.get('area') ?? '',
    genre: searchParams.get('genre') ?? ''
  });

  // URLパラメータが変更された時にフォームデータを同期
  useEffect(() => {
    setFormData({
      name: searchParams.get('name') ?? '',
      area: searchParams.get('area') ?? '',
      genre: searchParams.get('genre') ?? ''
    });
  }, [searchParams]);

  // URLパラメータを更新する関数
  const updateParams = useCallback(
    (params: { name: string; area: string; genre: string }) => {
      const current = new URLSearchParams();
      
      // パラメータを更新
      Object.entries(params).forEach(([key, value]) => {
        if (value && value.trim()) {
          current.set(key, value.trim());
        }
      });

      // URLを更新
      const search = current.toString();
      const query = search ? `?${search}` : '';
      router.push(`${window.location.pathname}${query}`);
    },
    [router]
  );

  // フォームデータ更新（検索は手動で実行）
  const updateFormData = (updates: Partial<typeof formData>) => {
    const newFormData = { ...formData, ...updates };
    setFormData(newFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams(formData);
  };

  const handleReset = () => {
    router.push(window.location.pathname);
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border border-white/20 lg:bg-transparent lg:shadow-none lg:border-none lg:p-0 lg:mb-0">
      <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-4">
        <div className="space-y-4 lg:space-y-3">
          {/* 店舗名 */}
          <div className="space-y-2 lg:space-y-1">
            <label htmlFor="name" className="block text-md font-semibold text-teal-700">
              店舗名
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={e => updateFormData({ name: e.target.value })}
              placeholder="例: 焼肉店"
              className="w-full px-4 py-3 border-2 border-teal-500 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 placeholder-teal-800 lg:py-2.5 lg:text-sm"
            />
          </div>

          {/* エリアとジャンルを横並び */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-3">
            {/* エリア */}
            <div className="space-y-2 lg:space-y-1">
              <label className="block text-md font-semibold text-teal-700">
                エリア
              </label>
              <SearchableDropdown
                options={areaTags}
                value={formData.area}
                onChange={value => updateFormData({ area: value })}
                placeholder="エリアを検索..."
                disabled={tagsLoading}
                emptyMessage="該当するエリアがありません"
              />
            </div>

            {/* ジャンル */}
            <div className="space-y-2 lg:space-y-1">
              <label className="block text-md font-semibold text-teal-700">
                ジャンル
              </label>
              <SearchableDropdown
                options={genreTags}
                value={formData.genre}
                onChange={value => updateFormData({ genre: value })}
                placeholder="ジャンルを検索..."
                disabled={tagsLoading}
                emptyMessage="該当するジャンルがありません"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-2 lg:pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl lg:px-4 lg:py-2 lg:text-sm"
          >
            検索
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2.5 text-teal-600 font-semibold border-2 border-teal-500 rounded-xl hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 lg:px-4 lg:py-2 lg:text-sm"
          >
            リセット
          </button>
        </div>
      </form>
    </div>
  );
}