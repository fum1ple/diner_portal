// 統一されたクエリキー管理
export const queryKeys = {
  // レストラン関連
  restaurants: {
    all: ['restaurants'] as const,
    lists: () => [...queryKeys.restaurants.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.restaurants.lists(), { filters }] as const,
    details: () => [...queryKeys.restaurants.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.restaurants.details(), id] as const,
  },

  // レビュー関連
  reviews: {
    all: ['reviews'] as const,
    lists: () => [...queryKeys.reviews.all, 'list'] as const,
    list: (restaurantId: string | number) => [...queryKeys.reviews.lists(), restaurantId] as const,
  },

  // タグ関連
  tags: {
    all: ['tags'] as const,
    lists: () => [...queryKeys.tags.all, 'list'] as const,
    list: (category?: string) => category 
      ? [...queryKeys.tags.lists(), category] as const
      : [...queryKeys.tags.lists()] as const,
  },

  // お気に入り関連
  favorites: {
    all: ['favorites'] as const,
    lists: () => [...queryKeys.favorites.all, 'list'] as const,
  },

  // ユーザー関連
  users: {
    all: ['users'] as const,
    profile: () => [...queryKeys.users.all, 'profile'] as const,
  },
} as const;