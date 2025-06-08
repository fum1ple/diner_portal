import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { publicApi, authApi } from '@/lib/api-client';
import { Tag } from '@/types/api'; // CreateReviewRequest is not used directly in this component's props/state
// Assuming shadcn/ui components are available
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
// For toast notifications (if a system like react-toastify or sonner is set up)
// import { toast } from 'sonner'; // Or similar

interface ReviewFormProps {
  restaurantId: string; // Changed from number to string to match typical ID usage in URLs/params
  onReviewSubmitted: () => void; // Callback to notify parent to refetch reviews
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
      const response = await publicApi.getSceneTags();
      if (response.data) {
        setSceneTags(response.data);
      } else {
        const errorMessage = response.error || 'Failed to load scene tags.';
        setErrorTags(errorMessage);
        // toast.error(errorMessage);
        console.error("Error fetching scene tags:", errorMessage);
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
      setSubmitError('Please select a rating.');
      // toast.error('Please select a rating.');
      alert('Please select a rating.');
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
      // toast.success('Review submitted successfully!');
      alert('Review submitted successfully!');
      setComment('');
      setRating(0);
      setImage(null);
      setSceneTagId('none');
      // Clear file input visually
      const fileInput = document.getElementById('review-image-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      onReviewSubmitted();
    } else {
      const errorMessage = response.error || 'Failed to submit review.';
      setSubmitError(errorMessage);
      // toast.error(errorMessage);
      alert(errorMessage);
      console.error("Error submitting review:", errorMessage);
    }
    setIsSubmitting(false);
  };

  const StarRating = ({ value, onChange }: { value: number, onChange: (rating: number) => void }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button // Changed span to button for accessibility
          type="button" // Prevent form submission
          key={star}
          onClick={() => onChange(star)}
          className={`cursor-pointer text-2xl ${star <= value ? 'text-yellow-400' : 'text-gray-300'}`}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 border rounded-lg shadow-sm bg-white">
      <h3 className="text-xl font-semibold text-gray-800">Write a Review</h3>

      <div>
        <Label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Rating</Label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div>
        <Label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Comment</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
          required
          rows={4}
          placeholder="Share your experience..."
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <Label htmlFor="review-image-input" className="block text-sm font-medium text-gray-700 mb-1">Image (Optional)</Label>
        <Input
          id="review-image-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
        />
      </div>

      <div>
        <Label htmlFor="scene_tag_id" className="block text-sm font-medium text-gray-700 mb-1">Scene Tag (Optional)</Label>
        <Select value={sceneTagId} onValueChange={setSceneTagId} disabled={isLoadingTags}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={isLoadingTags ? "Loading tags..." : "Select a scene tag"} />
          </SelectTrigger>
          <SelectContent>
            {errorTags && <SelectItem value="error" disabled className="text-red-500">{errorTags}</SelectItem>}
            <SelectItem value="none">None</SelectItem>
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
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
};

export default ReviewForm;
