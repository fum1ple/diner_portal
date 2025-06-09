import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { authApi } from '@/lib/api-client';
import { Tag } from '@/types/api'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ReviewFormProps {
  restaurantId: string;
  onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ restaurantId, onReviewSubmitted }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);
  const [sceneTagId, setSceneTagId] = useState<string>('none');
  const [sceneTags, setSceneTags] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [errorTags, setErrorTags] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);


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

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    } else {
      setImage(null);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    if (rating === 0) {
      setSubmitError('評価を選択してください。');
      alert('評価を選択してください。');
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('review[comment]', comment);
    formData.append('review[rating]', String(rating));
    if (image) {
      formData.append('review[image]', image);
    }
    if (sceneTagId && sceneTagId !== 'none') {
      formData.append('review[scene_tag_id]', sceneTagId);
    }

    const response = await authApi.submitReview(restaurantId, formData);

    if (response.data) {
      alert('レビューを正常に投稿しました！');
      setComment('');
      setRating(0);
      setImage(null);
      setSceneTagId('none');
      const fileInput = document.getElementById('review-image-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      onReviewSubmitted();
    } else {
      const errorMessage = response.error || 'レビューの投稿に失敗しました。';
      setSubmitError(errorMessage);
      alert(errorMessage);
      console.error("レビュー投稿エラー:", errorMessage);
    }
    setIsSubmitting(false);
  };

  const StarRating = ({ value, onChange }: { value: number, onChange: (rating: number) => void }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          type="button"
          key={star}
          onClick={() => onChange(star)}
          className={`cursor-pointer text-2xl ${star <= value ? 'text-yellow-400' : 'text-gray-300'}`}
          aria-label={`${star}段階評価`}
        >
          ★
        </button>
      ))}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 border rounded-lg shadow-sm bg-white">
      <h3 className="text-xl font-semibold text-gray-800">レビューを投稿</h3>

      <div>
        <Label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">評価</Label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div>
        <Label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">コメント</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
          required
          rows={4}
          placeholder="体験について教えてください..."
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <Label htmlFor="review-image-input" className="block text-sm font-medium text-gray-700 mb-1">画像（任意）</Label>
        <Input
          id="review-image-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
        />
      </div>

      <div>
        <Label htmlFor="scene_tag_id" className="block text-sm font-medium text-gray-700 mb-1">シーンタグ（任意）</Label>
        <Select value={sceneTagId} onValueChange={setSceneTagId} disabled={isLoadingTags}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={isLoadingTags ? "タグ読み込み中..." : "シーンタグを選択"} />
          </SelectTrigger>
          <SelectContent>
            {errorTags && <SelectItem value="error" disabled className="text-red-500">{errorTags}</SelectItem>}
            <SelectItem value="none">なし</SelectItem>
            {sceneTags.map(tag => (
              <SelectItem key={tag.id} value={String(tag.id)}>
                {tag.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {submitError && <p className="text-sm text-red-600">{submitError}</p>}

      <Button type="submit" disabled={isSubmitting || rating === 0} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm disabled:opacity-50">
        {isSubmitting ? '投稿中...' : 'レビューを投稿'}
      </Button>
    </form>
  );
};

export default ReviewForm;
