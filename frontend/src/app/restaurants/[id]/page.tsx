'use client';

import { useRestaurantDetail } from '../../../hooks/useRestaurantDetail';
import RestaurantInfo from '../../../components/RestaurantInfo';
import RestaurantActions from '../../../components/RestaurantActions'; // Keep if still relevant
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorMessage from '../../../components/ErrorMessage';
import Breadcrumb from '../../../components/Breadcrumb';
import ReviewList from '../../../components/ReviewList'; // New import
import ReviewForm from '../../../components/ReviewForm';   // New import
// import { Separator } from '@/components/ui/separator'; // Optional for visual separation

interface PageProps {
  params: { id: string };
}

export default function RestaurantDetailPage({ params }: PageProps) {
  const { id } = params;
  const { data: restaurant, isLoading, error, refetch } = useRestaurantDetail(id);

  if (isLoading) {
    return (
      <main className="container mx-auto p-4">
        <LoadingSpinner message="Loading restaurant details..." />
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto p-4">
        <ErrorMessage message={error.message || 'Failed to load restaurant details.'} onRetry={refetch} />
      </main>
    );
  }

  if (!restaurant) {
    return (
      <main className="container mx-auto p-4">
        <ErrorMessage message="Restaurant not found." />
      </main>
    );
  }

  const handleReviewSubmitted = () => {
    refetch(); // Refetch restaurant data to update review list
  };

  return (
    <main className="container mx-auto p-4">
      <Breadcrumb
        items={[
          { label: 'All Restaurants', href: '/restaurants' },
          { label: restaurant.name },
        ]}
      />
      <div className="mt-6 flex flex-col md:flex-row gap-8">
        {/* Left Column: Restaurant Info */}
        <div className="w-full md:w-1/3 lg:w-1/4"> {/* Adjusted for potentially narrower sidebar */}
          <div className="sticky top-6 space-y-6"> {/* Sticky sidebar */}
            <RestaurantInfo restaurant={restaurant} />
            <RestaurantActions restaurant={restaurant} /> {/* Keep or remove as per current UI needs */}
          </div>
        </div>

        {/* Right Column: Reviews */}
        <div className="w-full md:w-2/3 lg:w-3/4 space-y-8"> {/* Adjusted to take remaining space */}
          <ReviewForm restaurantId={id} onReviewSubmitted={handleReviewSubmitted} />
          {/* <Separator /> Optional separator */}
          <ReviewList reviews={restaurant.reviews} restaurantName={restaurant.name} />
        </div>
      </div>
    </main>
  );
}
