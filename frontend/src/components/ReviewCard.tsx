import React from 'react';
import { Review } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // Removed AvatarImage as not used in example
import { Badge } from '@/components/ui/badge';
import Image from 'next/image'; // For optimized images

interface ReviewCardProps {
  review: Review;
}

// Reusable StarDisplay component
const StarDisplay = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, index) => (
      <span key={index} className={`text-xl ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ))}
  </div>
);

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  // Ensure NEXT_PUBLIC_API_URL is defined in your .env.local or environment
  // Default to typical Rails dev server URL if not set.
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  return (
    <Card className="mb-4 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{review.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <CardTitle className="text-lg font-semibold">{review.user.name}</CardTitle>
            <StarDisplay rating={review.rating} />
          </div>
          <CardDescription className="text-xs text-gray-500 pt-1 self-start">
            {new Date(review.created_at).toLocaleDateString()}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {review.comment && review.comment.trim() && (
          <p className="text-gray-700 mb-3 whitespace-pre-line">{review.comment}</p>
        )}
        {review.image_url && (
          <div className="my-3 relative w-full h-64 md:h-80 lg:h-96"> {/* Added relative positioning and example heights */}
            <Image
              src={`${apiBaseUrl}${review.image_url}`}
              alt={`Review image by ${review.user.name}`}
              fill // Changed to fill for responsive behavior within the sized parent div
              className="rounded-md object-cover" // Ensure object-cover is used with fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Example sizes for optimization
            />
          </div>
        )}
        {review.scene_tag && (
          <Badge variant="outline" className="mt-2">{review.scene_tag.name}</Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
