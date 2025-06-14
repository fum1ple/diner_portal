import React, { useState, useRef } from 'react';
import { 
  Button, 
  Textarea, 
  Input,
  Label 
} from '@/components/ui';
import { Loader2 } from 'lucide-react';
import { useCreateReview } from '@/hooks/useCreateReview';
import { CreateReviewRequest } from '@/types/review';
import SceneTagSelector from '@/components/forms/SceneTagSelector';
import StarRating from '@/components/forms/StarRating';

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
  const [image, setImage] = useState<File | null>(null);
  const [selectedSceneTagIds, setSelectedSceneTagIds] = useState<number[]>([]);
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
      setSelectedSceneTagIds([]);
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
      scene_tag_ids: selectedSceneTagIds.length > 0 ? selectedSceneTagIds : undefined,
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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">評価</label>
        <div className="flex items-center gap-4">
          <StarRating 
            value={rating} 
            onChange={setRating}
            readOnly={isPending}
            size="md"
            className="flex-shrink-0"
          />
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={rating || ''}
              onChange={e => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value) && value >= 1 && value <= 5) {
                  setRating(Math.round(value * 10) / 10); // 小数点第1位まで
                } else if (e.target.value === '') {
                  setRating(0);
                }
              }}
              min="1"
              max="5"
              step="0.1"
              placeholder="1.0-5.0"
              className="w-23 text-sm"
              disabled={isPending}
            />
            <span className="text-sm text-gray-500">/ 5.0</span>
          </div>
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
        <SceneTagSelector
          selectedTagIds={selectedSceneTagIds}
          onSelectionChange={setSelectedSceneTagIds}
          disabled={isPending}
        />
      </div>

      {/* レビュー投稿ガイド */}
      <div className="mb-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50">
        <h4 className="text-lg font-semibold text-slate-700 mb-4">
          💭 レビューって何を書けばいいの？
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 text-left">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-teal-500 mt-1">✓</span>
              <div>
                <span className="font-medium text-slate-700">味や雰囲気</span>
                <div className="text-sm text-slate-500">どんな料理？お店の感じは？</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-teal-500 mt-1">✓</span>
              <div>
                <span className="font-medium text-slate-700">おすすめポイント</span>
                <div className="text-sm text-slate-500">何が良かった？特徴は？</div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-teal-500 mt-1">✓</span>
              <div>
                <span className="font-medium text-slate-700">利用シーン</span>
                <div className="text-sm text-slate-500">ランチ？飲み会？デート？</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-teal-500 mt-1">✓</span>
              <div>
                <span className="font-medium text-slate-700">注意点</span>
                <div className="text-sm text-slate-500">混雑具合や予約の必要性など</div>
              </div>
            </div>
          </div>
        </div>
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