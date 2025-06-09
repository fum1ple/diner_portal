import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { authApi } from '@/lib/apiClient';
import { Tag } from '@/types/api'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StarRating from '@/components/StarRating';

interface ReviewFormProps {
  restaurantId: string;
  onReviewSubmitted: () => void;
  className?: string;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>レビューを投稿</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 評価 */}
          <div>
            <Label htmlFor="rating">評価</Label>
            <StarRating value={rating} onChange={setRating} />
          </div>
          {/* コメント */}
          <div>
            <Label htmlFor="comment">コメント</Label>
            <Textarea id="comment" value={comment} onChange={e => setComment(e.target.value)} required />
          </div>
          {/* 画像 */}
          <div>
            <Label htmlFor="review-image-input">画像（任意）</Label>
            <Input id="review-image-input" type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          {/* シーンタグ */}
          <div>
            <Label htmlFor="scene_tag_id">シーンタグ（任意）</Label>
            <Select value={sceneTagId} onValueChange={setSceneTagId} disabled={isLoadingTags}>
              <SelectTrigger><SelectValue placeholder={isLoadingTags ? "読み込み中..." : "選択してください"} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">なし</SelectItem>
                {sceneTags.map(tag => <SelectItem key={tag.id} value={String(tag.id)}>{tag.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {isLoadingTags && <p className="text-sm text-muted-foreground mt-1">シーンタグを読み込み中...</p>}
            {errorTags && <p className="text-sm text-red-600 mt-1">{errorTags}</p>}
          </div>
          {/* エラー */}
          {submitError && <p className="text-red-600">{submitError}</p>}
          <Button type="submit" disabled={isSubmitting}>投稿</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
