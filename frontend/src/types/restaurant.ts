import type { Tag } from './tag';
import type { Review } from './review';

// Restaurant core types
export interface Restaurant {
  id: number;
  name: string;
  area_tag_id: number;
  genre_tag_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  average_rating: number;
  review_count: number;
  area_tag: Tag;
  genre_tag: Tag;
  reviews?: Review[];
  is_favorited: boolean;
}

// Restaurant request/response types
export interface CreateRestaurantRequest {
  restaurant: {
    name: string;
    area_tag_id: number;
    genre_tag_id: number;
  };
}

export interface CreateRestaurantResponse {
  id: number;
  name: string;
  area_tag_id: number;
  genre_tag_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface RestaurantsResponse {
  restaurants?: Restaurant[];
  data?: Restaurant[];
}

export interface RestaurantDetailResponse {
  restaurant: Restaurant;
}

export interface RestaurantsListResponse {
  restaurants: Restaurant[];
}

// Search related types
export interface RestaurantSearchFilters {
  name: string;
  area: string;
  genre: string;
}

export interface RestaurantListItem {
  id: number;
  name: string;
  url?: string;
  area_tag?: Tag;
  genre_tag?: Tag;
  average_rating?: number;
}

export interface RestaurantSearchParams {
  name?: string;
  area?: string;
  genre?: string;
}

export interface RestaurantSearchState {
  restaurants: RestaurantListItem[];
  loading: boolean;
  error: string | null;
}