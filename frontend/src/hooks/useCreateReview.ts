import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { restaurantsApi } from '@/lib/api';
import { ApiError } from '@/types/api';
import { Review, CreateReviewRequest } from '@/types/review';

interface UseCreateReviewHookOptions {
  onSuccess?: (data: Review) => void;
  onError?: (error: ApiError) => void;
}

// APIから返されるエラーレスポンスの型をより具体的に定義する場合
interface ApiErrorResponse extends ApiError {
  errors?: Record<string, string[]>; // 具体的なエラーフィールド
}

export const useCreateReview = (restaurantId: number, hookOptions?: UseCreateReviewHookOptions) => {
  const queryClient = useQueryClient();

  const mutationFn = async (reviewData: CreateReviewRequest): Promise<Review> => {
    const formData = new FormData();
    formData.append('review[rating]', String(reviewData.rating));
    formData.append('review[comment]', reviewData.comment);
    if (reviewData.image) {
      formData.append('review[image]', reviewData.image);
    }
    if (reviewData.scene_tag_ids && reviewData.scene_tag_ids.length > 0) {
      reviewData.scene_tag_ids.forEach(tagId => {
        formData.append('review[scene_tag_ids][]', String(tagId));
      });
    }

    const res = await restaurantsApi.submitReview(String(restaurantId), formData);

    if (res.error || !res.data) {
      // res.errors が存在する場合、それを ApiError の errors プロパティに割り当てる
      const apiError: ApiError = {
        message: res.error || 'Failed to create review',
        status: res.status,
        errors: (res as unknown as ApiErrorResponse).errors, // 型アサーションをより安全に
      };
      throw apiError;
    }
    return res.data;
  };

  const mutationOptions: UseMutationOptions<Review, ApiError, CreateReviewRequest, unknown> = {
    mutationFn,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['restaurant', String(restaurantId)] });
      queryClient.invalidateQueries({ queryKey: ['reviews', String(restaurantId)] });
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });

      if (hookOptions?.onSuccess) {
        hookOptions.onSuccess(data);
      }
    },
    onError: error => {
      if (hookOptions?.onError) {
        hookOptions.onError(error);
      }
    },
  };

  return useMutation<Review, ApiError, CreateReviewRequest>(mutationOptions);
};
