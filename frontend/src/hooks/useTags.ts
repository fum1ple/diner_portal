import { useState, useEffect } from "react";
import { publicApi } from "@/lib/api-client";
import type { Tag } from "@/types/api";

interface UseTagsReturn {
  areaTags: Tag[];
  genreTags: Tag[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTags = (): UseTagsReturn => {
  const [areaTags, setAreaTags] = useState<Tag[]>([]);
  const [genreTags, setGenreTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // シンプルに並列取得
      const [areaResult, genreResult] = await Promise.all([
        publicApi.getTags('area'),
        publicApi.getTags('genre'),
      ]);
      
      // エラーチェック
      if (areaResult.error || genreResult.error) {
        throw new Error(areaResult.error || genreResult.error || 'タグ取得エラー');
      }
      
      // データ設定
      setAreaTags(areaResult.data || []);
      setGenreTags(genreResult.data || []);
      
    } catch (e: unknown) {
      console.error('タグ取得エラー:', e);
      setError(e instanceof Error ? e.message : "タグの取得中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return {
    areaTags,
    genreTags,
    loading,
    error,
    refetch: fetchTags
  };
};
