import React, { useState, useEffect, useRef } from 'react';
import { 
  Button, 
  Textarea, 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  Input,
  Label 
} from '@/components/ui';
import { Star, Loader2 } from 'lucide-react';
import { useCreateReview } from '@/hooks/useCreateReview';
import { CreateReviewRequest, Tag } from '@/types/api';
import { authApi } from '@/lib/apiClient';

interface ReviewFormProps {
  restaurantId: number;
  onReviewSubmit: () => void;
  onCancel: () => void;
}

// 画像バリデーション関数
const validateImage = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (file.size > maxSize) {
    return { isValid: false, error: '画像サイズは5MB以下にしてください' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'JPEG、PNG、WebP形式の画像のみ対応しています' };
  }
  
  return { isValid: true };
};

const ReviewForm: React.FC<ReviewFormProps> = ({ restaurantId, onReviewSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [sceneTagId, setSceneTagId] = useState<string>('none');
  const [sceneTags, setSceneTags] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [errorTags, setErrorTags] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  
  // ファイル入力のref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // useCreateReviewフックを使用
  const createReviewMutation = useCreateReview(restaurantId, {
    onSuccess: () => {
      // レビュー投稿成功時の処理
      // 親コンポーネントに通知
      onReviewSubmit();
      
      // フォームをリセット
      setRating(0);
      setComment('');
      setImage(null);
      setSceneTagId('none');
      setImageError(null);
      
      // ファイル入力をリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: () => {
      // エラーハンドリング（コンソールログは useCreateReview 内で既に実行済み）
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
      }
      setIsLoadingTags(false);
    };
    fetchTags();
  }, []);

  // 画像選択のハンドラー
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const validation = validateImage(file);
      
      if (validation.isValid) {
        setImage(file);
      } else {
        setImage(null);
        setImageError(validation.error || '');
        // ファイル入力をクリア
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } else {
      setImage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // CreateReviewRequest型のデータを作成
    const reviewData: CreateReviewRequest = {
      rating,
      comment,
      image: image || undefined,
      scene_tag_id: sceneTagId !== 'none' ? parseInt(sceneTagId, 10) : undefined,
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
          ref={fileInputRef}
          id="review-image-input" 
          type="file" 
          accept="image/jpeg,image/png,image/webp" 
          onChange={handleImageChange}
          disabled={isPending}
          className="mt-1"
        />
        {image && (
          <p className="text-sm text-gray-600 mt-1">選択された画像: {image.name}</p>
        )}
        {imageError && (
          <p className="text-sm text-red-600 mt-1">{imageError}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">対応形式: JPEG、PNG、WebP（最大5MB）</p>
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