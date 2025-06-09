import { useState, useEffect } from "react";
import { authApi } from "@/lib/api-client";
import type { Tag, CreateTagRequest } from "@/types/api";

interface UseTagsReturn {
  areaTags: Tag[];
  genreTags: Tag[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createTag: (data: CreateTagRequest) => Promise<Tag | null>;
  creating: boolean;
}

export const useTags = (): UseTagsReturn => {
  const [areaTags, setAreaTags] = useState<Tag[]>([]);
  const [genreTags, setGenreTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchTags = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // シンプルに並列取得（認証API使用）
      const [areaResult, genreResult] = await Promise.all([
        authApi.getTags('area'),
        authApi.getTags('genre'),
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

  const createTag = async (data: CreateTagRequest): Promise<Tag | null> => {
    try {
      setCreating(true);
      setError(null);

      const result = await authApi.createTag(data);

      if (result.error) {
        throw new Error(result.error);
      }

      if (!result.data) {
        throw new Error('タグの作成に失敗しました');
      }

      // 新しいタグを適切なリストに追加
      if (data.tag.category === 'area') {
        setAreaTags(prev => [...prev, result.data!]);
      } else {
        setGenreTags(prev => [...prev, result.data!]);
      }

      return result.data;
    } catch (e: unknown) {
      console.error('タグ作成エラー:', e);
      setError(e instanceof Error ? e.message : "タグの作成中にエラーが発生しました");
      return null;
    } finally {
      setCreating(false);
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
    refetch: fetchTags,
    createTag,
    creating
  };
};
