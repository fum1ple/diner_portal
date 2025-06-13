'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import InlineTagCreator from './InlineTagCreator';
import HeadlessDropdown from './HeadlessDropdown';
import Alert from './Alert';
import FormField from './FormField';
import LoadingSpinner from './LoadingSpinner';
import { StyledWrapper } from './AddRestaurantForm/styles';
import { useTags } from '@/hooks/useTags';
import { authApi } from '@/lib/apiClient';
import type { CreateRestaurantRequest, Tag } from '@/types/api';

const AddRestaurantForm = () => {
  const router = useRouter();
  const { areaTags, genreTags, loading, error, createTag, creating } = useTags();
  const [name, setName] = useState("");
  const [areaId, setAreaId] = useState("");
  const [genreId, setGenreId] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // インライン新規タグ作成の状態管理
  const [showNewAreaForm, setShowNewAreaForm] = useState(false);
  const [showNewGenreForm, setShowNewGenreForm] = useState(false);

  // 新しいタグが作成された時のハンドラー
  const handleTagCreated = useCallback((tag: Tag) => {
    if (tag.category === 'area') {
      setAreaId(tag.id.toString());
      setShowNewAreaForm(false);
    } else {
      setGenreId(tag.id.toString());
      setShowNewGenreForm(false);
    }
  }, []);

  // エリア選択のハンドラー
  const handleAreaChange = useCallback((value: string) => {
    if (value === 'NEW_AREA') {
      setShowNewAreaForm(true);
      setAreaId('');
    } else {
      setAreaId(value);
      setShowNewAreaForm(false);
    }
  }, []);

  // ジャンル選択のハンドラー
  const handleGenreChange = useCallback((value: string) => {
    if (value === 'NEW_GENRE') {
      setShowNewGenreForm(true);
      setGenreId('');
    } else {
      setGenreId(value);
      setShowNewGenreForm(false);
    }
  }, []);

  // エリアオプションのメモ化
  const areaOptions = useMemo(() => [
    ...areaTags.map(tag => ({ value: tag.id.toString(), label: tag.name })),
    { value: 'NEW_AREA', label: '新しいエリアを追加' }
  ], [areaTags]);

  // ジャンルオプションのメモ化
  const genreOptions = useMemo(() => [
    ...genreTags.map(tag => ({ value: tag.id.toString(), label: tag.name })),
    { value: 'NEW_GENRE', label: '新しいジャンルを追加' }
  ], [genreTags]);

  // フォームの有効性チェックをメモ化
  const isFormValid = useMemo(() => 
    name && areaId && genreId && !showNewAreaForm && !showNewGenreForm,
    [name, areaId, genreId, showNewAreaForm, showNewGenreForm]
  );

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSuccess(false);
    
    try {
      const requestData: CreateRestaurantRequest = {
        restaurant: {
          name: name.trim(),
          area_tag_id: Number(areaId),
          genre_tag_id: Number(genreId),
        }
      };

      const result = await authApi.createRestaurant(requestData);

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.data && result.data.id) {
        setSuccess(true);
        // フォームをリセット
        setName("");
        setAreaId("");
        setGenreId("");
        // 成功メッセージを表示してからリダイレクト
        setTimeout(() => {
          router.push(`/restaurants/${result.data?.id}`);
        }, 500);
      } else {
        throw new Error("レストランIDが取得できませんでした");
      }
      
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : "登録中にエラーが発生しました");
    } finally {
      setSubmitLoading(false);
    }
  }, [name, areaId, genreId, router]);

  if (loading) {
    return (
      <StyledWrapper>
        <div className="container">
          <LoadingSpinner message="タグを読み込み中..." />
        </div>
      </StyledWrapper>
    );
  }

  if (error) {
    return (
      <StyledWrapper>
        <div className="container">
          <Alert type="danger">
            <h4>エラーが発生しました</h4>
            <p>{error}</p>
          </Alert>
        </div>
      </StyledWrapper>
    );
  }

  return (
    <StyledWrapper>
      <div className="container">
        <div className="heading">新規店舗登録</div>
        
        {success && (
          <Alert type="success">
            <i className="bi bi-check-circle me-2"></i>
            店舗が正常に登録されました！詳細ページへリダイレクトしています...
          </Alert>
        )}

        {submitError && (
          <Alert type="danger">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {submitError}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="form">
          <FormField label="店舗名" required>
            <input
              type="text"
              className="input"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              disabled={submitLoading}
              placeholder="店舗名を入力してください"
            />
          </FormField>

          <FormField label="エリア" required>
            <HeadlessDropdown
              options={areaOptions}
              value={areaId}
              onChange={handleAreaChange}
              placeholder="エリアを選択してください"
              disabled={submitLoading}
            />
          </FormField>

          {showNewAreaForm && (
            <InlineTagCreator
              category="area"
              onTagCreated={handleTagCreated}
              onClose={() => setShowNewAreaForm(false)}
              creating={creating}
              onCreateTag={createTag}
            />
          )}

          <FormField label="ジャンル" required>
            <HeadlessDropdown
              options={genreOptions}
              value={genreId}
              onChange={handleGenreChange}
              placeholder="ジャンルを選択してください"
              disabled={submitLoading}
            />
          </FormField>

          {showNewGenreForm && (
            <InlineTagCreator
              category="genre"
              onTagCreated={handleTagCreated}
              onClose={() => setShowNewGenreForm(false)}
              creating={creating}
              onCreateTag={createTag}
            />
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={submitLoading || !isFormValid}
          >
            {submitLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                登録中...
              </>
            ) : (
              '店舗を登録'
            )}
          </button>
        </form>
      </div>
    </StyledWrapper>
  );
};

export default AddRestaurantForm;
