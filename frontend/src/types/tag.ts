// Tag related types

export interface Tag {
  id: number;
  name: string;
  category: 'area' | 'genre' | 'scene';
  created_at?: string;
  updated_at?: string;
}

export interface TagsResponse {
  tags?: Tag[];
  data?: Tag[];
}

export interface CreateTagRequest {
  tag: {
    name: string;
    category: 'area' | 'genre';
  };
}