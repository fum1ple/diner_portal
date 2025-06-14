import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagsApi } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import type { Tag, CreateTagRequest } from '@/types/tag';

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
  const queryClient = useQueryClient();

  // エリアタグの取得
  const areaTagsQuery = useQuery({
    queryKey: queryKeys.tags.list('area'),
    queryFn: async () => {
      const result = await tagsApi.getByCategory('area');
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data || [];
    },
    staleTime: 30 * 60 * 1000, // タグは変更頻度が低いので30分間キャッシュ
    gcTime: 60 * 60 * 1000, // 1時間ガベージコレクション保持
  });

  // ジャンルタグの取得
  const genreTagsQuery = useQuery({
    queryKey: queryKeys.tags.list('genre'),
    queryFn: async () => {
      const result = await tagsApi.getByCategory('genre');
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data || [];
    },
    staleTime: 30 * 60 * 1000, // タグは変更頻度が低いので30分間キャッシュ
    gcTime: 60 * 60 * 1000, // 1時間ガベージコレクション保持
  });

  // タグ作成のmutation
  const createTagMutation = useMutation({
    mutationFn: async (data: CreateTagRequest) => {
      const result = await tagsApi.create(data);
      if (result.error) {
        throw new Error(result.error);
      }
      if (!result.data) {
        throw new Error('タグの作成に失敗しました');
      }
      return result.data;
    },
    onSuccess: newTag => {
      // 新しいタグを適切なキャッシュに追加
      const category = newTag.category;
      queryClient.setQueryData(
        queryKeys.tags.list(category),
        (oldTags: Tag[] | undefined) => [...(oldTags || []), newTag]
      );
    },
    onError: error => {
      console.error('Tag creation error:', error);
    },
  });

  // リフェッチ関数
  const refetch = async () => {
    await Promise.all([
      areaTagsQuery.refetch(),
      genreTagsQuery.refetch(),
    ]);
  };

  // タグ作成関数
  const createTag = async (data: CreateTagRequest): Promise<Tag | null> => {
    try {
      const result = await createTagMutation.mutateAsync(data);
      return result;
    } catch (error) {
      console.error('Create tag error:', error);
      return null;
    }
  };

  // ローディング状態とエラー状態の統合
  const loading = areaTagsQuery.isLoading || genreTagsQuery.isLoading;
  const error = areaTagsQuery.error?.message || 
                genreTagsQuery.error?.message || 
                null;

  return {
    areaTags: areaTagsQuery.data || [],
    genreTags: genreTagsQuery.data || [],
    loading,
    error,
    refetch,
    createTag,
    creating: createTagMutation.isPending,
  };
};
