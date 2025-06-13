'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import InlineTagCreator from './forms/InlineTagCreator';
import HeadlessDropdown from './common/HeadlessDropdown';
import Alert from './ui/feedback/Alert';
import FormField from './forms/FormField';
import LoadingSpinner from './ui/feedback/LoadingSpinner';
import { StyledWrapper } from './restaurant/AddRestaurantForm/styles';
import { useTags } from '@/hooks/useTags';
import { authApi } from '@/lib/apiClient';
import type { CreateRestaurantRequest } from '@/types/restaurant';
import type { Tag } from '@/types/tag';

const AddRestaurantForm = () => {
  const router = useRouter();
  const { areaTags, genreTags, loading, error, createTag, creating } = useTags();
  const searchParams = useSearchParams();
  
  const [name, setName] = useState("");
  const [areaId, setAreaId] = useState("");
  const [genreId, setGenreId] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // インライン新規タグ作成の状態管理
  const [showNewAreaForm, setShowNewAreaForm] = useState(false);
  const [showNewGenreForm, setShowNewGenreForm] = useState(false);

  // URLパラメータから初期値を設定
  useEffect(() => {
    const initialName = searchParams.get('name');
    const initialArea = searchParams.get('area');
    const initialGenre = searchParams.get('genre');

    if (initialName) {
      setName(initialName);
    }

    // エリアとジャンルの設定はタグデータが読み込まれた後に行う
    if (areaTags.length > 0 && initialArea) {
      const areaTag = areaTags.find(tag => tag.name === initialArea);
      if (areaTag) {
        setAreaId(areaTag.id.toString());
      }
    }

    if (genreTags.length > 0 && initialGenre) {
      const genreTag = genreTags.find(tag => tag.name === initialGenre);
      if (genreTag) {
        setGenreId(genreTag.id.toString());
      }
    }
  }, [searchParams, areaTags, genreTags]);

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

      // 登録成功後は詳細画面に遷移（新規登録フラグ付き）
      if (result.data) {
        setSuccess(true);
        // 祝福メッセージを表示してから遷移
        setTimeout(() => {
          router.push(`/restaurants/${result.data.id}?newly_registered=true`);
        }, 1500);
      } else {
        setSuccess(true);
        setName("");
        setAreaId("");
        setGenreId("");
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
          <LoadingSpinner text="タグを読み込み中..." />
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
          <div className="mb-6 animate-fade-in-up">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 text-center shadow-xl">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                店舗登録完了！
              </h3>
              <p className="text-green-600 text-lg">
                店舗詳細ページへ移動しています...
              </p>
              <div className="mt-4">
                <div className="w-12 h-12 mx-auto">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200"></div>
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent absolute"></div>
                </div>
              </div>
            </div>
          </div>
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
              key="area-tag-creator"
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
              key="genre-tag-creator"
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
