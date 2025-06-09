// Context API を使った状態管理 (標準ライブラリ)
import React, { createContext, useContext, useReducer, useMemo, ReactNode } from 'react';

// 状態の型定義
interface RestaurantDetailState {
  showReviews: boolean;
  selectedReviewId: string | null;
  isLoading: boolean;
  filter: {
    rating: number | null;
    sortBy: 'newest' | 'oldest' | 'rating_high' | 'rating_low';
  };
}

// アクションの型定義
type RestaurantDetailAction = 
  | { type: 'TOGGLE_REVIEWS' }
  | { type: 'SET_SHOW_REVIEWS'; payload: boolean }
  | { type: 'SELECT_REVIEW'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_FILTER'; payload: Partial<RestaurantDetailState['filter']> }
  | { type: 'RESET_STATE' };

// 初期状態
const initialState: RestaurantDetailState = {
  showReviews: false,
  selectedReviewId: null,
  isLoading: false,
  filter: {
    rating: null,
    sortBy: 'newest'
  }
};

// Reducer関数
const restaurantDetailReducer = (
  state: RestaurantDetailState, 
  action: RestaurantDetailAction
): RestaurantDetailState => {
  switch (action.type) {
    case 'TOGGLE_REVIEWS':
      return { ...state, showReviews: !state.showReviews };
    
    case 'SET_SHOW_REVIEWS':
      return { ...state, showReviews: action.payload };
    
    case 'SELECT_REVIEW':
      return { ...state, selectedReviewId: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_FILTER':
      return { 
        ...state, 
        filter: { ...state.filter, ...action.payload }
      };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
};

// Context作成
const RestaurantDetailContext = createContext<{
  state: RestaurantDetailState;
  dispatch: React.Dispatch<RestaurantDetailAction>;
} | null>(null);

// Provider コンポーネント
interface RestaurantDetailProviderProps {
  children: ReactNode;
  initialShowReviews?: boolean;
}

export const RestaurantDetailProvider: React.FC<RestaurantDetailProviderProps> = ({ 
  children, 
  initialShowReviews = false 
}) => {
  const [state, dispatch] = useReducer(restaurantDetailReducer, {
    ...initialState,
    showReviews: initialShowReviews
  });

  // メモ化されたコンテキスト値
  const contextValue = useMemo(() => ({
    state,
    dispatch
  }), [state]);

  return (
    <RestaurantDetailContext.Provider value={contextValue}>
      {children}
    </RestaurantDetailContext.Provider>
  );
};

// カスタムフック
export const useRestaurantDetailContext = () => {
  const context = useContext(RestaurantDetailContext);
  
  if (!context) {
    throw new Error('useRestaurantDetailContext must be used within RestaurantDetailProvider');
  }
  
  return context;
};

// セレクター関数（メモ化されたデータ取得）
export const useRestaurantDetailSelectors = () => {
  const { state } = useRestaurantDetailContext();
  
  return useMemo(() => ({
    showReviews: state.showReviews,
    selectedReviewId: state.selectedReviewId,
    isLoading: state.isLoading,
    filter: state.filter,
    
    // 派生状態
    hasFilter: state.filter.rating !== null,
    isReviewSelected: state.selectedReviewId !== null
  }), [state]);
};

// アクション作成者（メモ化されたディスパッチ関数）
export const useRestaurantDetailActions = () => {
  const { dispatch } = useRestaurantDetailContext();
  
  return useMemo(() => ({
    toggleReviews: () => dispatch({ type: 'TOGGLE_REVIEWS' }),
    setShowReviews: (show: boolean) => dispatch({ type: 'SET_SHOW_REVIEWS', payload: show }),
    selectReview: (reviewId: string | null) => dispatch({ type: 'SELECT_REVIEW', payload: reviewId }),
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setFilter: (filter: Partial<RestaurantDetailState['filter']>) => 
      dispatch({ type: 'SET_FILTER', payload: filter }),
    resetState: () => dispatch({ type: 'RESET_STATE' })
  }), [dispatch]);
};
