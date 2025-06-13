// Review related types

export interface Review {
  id: number;
  comment: string;
  rating: number;
  image_url?: string;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
  scene_tags?: {
    id: number;
    name: string;
  }[];
}

export interface CreateReviewRequest {
  comment: string;
  rating: number;
  image?: File;
  scene_tag_ids?: number[];
}