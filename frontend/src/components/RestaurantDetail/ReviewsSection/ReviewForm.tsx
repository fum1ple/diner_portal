import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, Loader2 } from 'lucide-react';
import { useCreateReview } from '@/hooks/useCreateReview';
import { CreateReviewRequest, Tag } from '@/types/api';
import { authApi } from '@/lib/apiClient';

interface ReviewFormProps {
  restaurantId: number;
  onReviewSubmit: (review: { rating: number; comment: string }) => void;
  onCancel: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ restaurantId, onReviewSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [sceneTagId, setSceneTagId] = useState<string>('none');
  const [sceneTags, setSceneTags] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [errorTags, setErrorTags] = useState<string | null>(null);

  // useCreateReviewフックを使用
  const createReviewMutation = useCreateReview(restaurantId, {
    onSuccess: createdReview => {
      // レビュー投稿成功時の処理
      console.log('Review created successfully:', createdReview);
      
      // 親コンポーネントに通知
      onReviewSubmit({ rating, comment });
      
      // フォームをリセット
      setRating(0);
      setComment('');
      setImage(null);
      setSceneTagId('none');
      
      // ファイル入力もリセット
      const fileInput = document.getElementById('review-image-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    },
    onError: error => {
      // エラーハンドリング（コンソールログは useCreateReview 内で既に実行済み）
      console.error('Review submission failed in form:', error);
    }
  });

  // シーンタグを取得
  useEffect(() => {
    const fetchTags = async () => {
      setIsLoadingTags(true);
      setErrorTags(null);
      const response = await authApi.getSceneTags();
      if (response.data) {
        setSceneTags(response.data);
      } else {
        const errorMessage = response.error || 'シーンタグの読み込みに失敗しました。';
        setErrorTags(errorMessage);
        console.error("シーンタグ取得エラー:", errorMessage);
      }
      setIsLoadingTags(false);
    };
    fetchTags();
  }, []);

  // 画像選択のハンドラー
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // CreateReviewRequest型のデータを作成
    const reviewData: CreateReviewRequest = {
      rating,
      comment,
      image: image || undefined,
      scene_tag_id: sceneTagId !== 'none' ? Number(sceneTagId) : undefined,
    };

    // API送信を実行
    createReviewMutation.mutate(reviewData);
  };

  // ローディング状態とエラー状態を取得
  const { isPending, error } = createReviewMutation;

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-6 border rounded-lg shadow-md bg-white dark:bg-gray-800">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">レビューを投稿</h3>
      
      {/* エラーメッセージ表示 */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="text-sm">
            {error.message || 'レビューの投稿に失敗しました。もう一度お試しください。'}
          </p>
        </div>
      )}
      
      {/* 星評価 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">評価</label>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              className={`w-6 h-6 cursor-pointer transition-colors ${
                (hoverRating || rating) >= star
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300 dark:text-gray-500 fill-gray-300 dark:fill-gray-500'
              } ${isPending ? 'cursor-not-allowed opacity-50' : ''}`}
              onClick={() => !isPending && setRating(star)}
              onMouseEnter={() => !isPending && setHoverRating(star)}
              onMouseLeave={() => !isPending && setHoverRating(0)}
            />
          ))}
        </div>
      </div>

      {/* コメント入力 */}
      <div className="mb-6">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          コメント
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="レビューコメントを入力してください..."
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          required
          disabled={isPending}
        />
      </div>

      {/* 画像アップロード */}
      <div className="mb-4">
        <Label htmlFor="review-image-input">画像（任意）</Label>
        <Input 
          id="review-image-input" 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange}
          disabled={isPending}
          className="mt-1"
        />
        {image && (
          <p className="text-sm text-gray-600 mt-1">選択された画像: {image.name}</p>
        )}
      </div>

      {/* シーンタグ選択 */}
      <div className="mb-6">
        <Label htmlFor="scene_tag_id">シーンタグ（任意）</Label>
        <Select value={sceneTagId} onValueChange={setSceneTagId} disabled={isLoadingTags || isPending}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder={isLoadingTags ? "読み込み中..." : "選択してください"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">なし</SelectItem>
            {sceneTags.map(tag => (
              <SelectItem key={tag.id} value={String(tag.id)}>
                {tag.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isLoadingTags && <p className="text-sm text-gray-500 mt-1">シーンタグを読み込み中...</p>}
        {errorTags && <p className="text-sm text-red-600 mt-1">{errorTags}</p>}
      </div>

      {/* ボタン */}
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          キャンセル
        </Button>
        <Button 
          type="submit" 
          disabled={rating === 0 || comment.trim() === '' || isPending}
          className="flex items-center gap-2"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? '投稿中...' : '投稿する'}
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
