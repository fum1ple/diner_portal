"use client";

import React, { useState } from "react";
import ProtectedPage from "@/components/ProtectedPage";
import InlineTagCreator from "@/components/InlineTagCreator";
import { useTags } from "@/hooks/useTags";
import { authApi } from "@/lib/api-client";
import type { CreateRestaurantRequest, Tag } from "@/types/api";

const RestaurantNewPage = () => {
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
  const handleTagCreated = (tag: Tag) => {
    if (tag.category === 'area') {
      setAreaId(tag.id.toString());
      setShowNewAreaForm(false);
    } else {
      setGenreId(tag.id.toString());
      setShowNewGenreForm(false);
    }
  };

  // エリア選択のハンドラー
  const handleAreaChange = (value: string) => {
    if (value === 'NEW_AREA') {
      setShowNewAreaForm(true);
      setAreaId('');
    } else {
      setAreaId(value);
      setShowNewAreaForm(false);
    }
  };

  // ジャンル選択のハンドラー
  const handleGenreChange = (value: string) => {
    if (value === 'NEW_GENRE') {
      setShowNewGenreForm(true);
      setGenreId('');
    } else {
      setGenreId(value);
      setShowNewGenreForm(false);
    }
  };

  const isFormValid = name && areaId && genreId && !showNewAreaForm && !showNewGenreForm;

  const handleSubmit = async (e: React.FormEvent) => {
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

      setSuccess(true);
      setName("");
      setAreaId("");
      setGenreId("");
      
    } catch (e: unknown) {
      console.error('店舗登録エラー:', e);
      setSubmitError(e instanceof Error ? e.message : "登録中にエラーが発生しました");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>タグを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4>エラーが発生しました</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedPage>
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h2 className="mb-0">新規店舗登録</h2>
              </div>
              <div className="card-body">
                {success && (
                  <div className="alert alert-success">
                    <i className="bi bi-check-circle me-2"></i>
                    店舗が正常に登録されました！
                  </div>
                )}

                {submitError && (
                  <div className="alert alert-danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      店舗名 <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      disabled={submitLoading}
                      placeholder="店舗名を入力してください"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="areaId" className="form-label">
                      エリア <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="areaId"
                      value={areaId}
                      onChange={e => handleAreaChange(e.target.value)}
                      required
                      disabled={submitLoading}
                    >
                      <option value="">エリアを選択してください</option>
                      {areaTags.map(tag => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))}
                      <option value="NEW_AREA">新しいエリアを追加</option>
                    </select>

                    {showNewAreaForm && (
                      <InlineTagCreator
                        category="area"
                        onTagCreated={handleTagCreated}
                        onClose={() => setShowNewAreaForm(false)}
                        creating={creating}
                        onCreateTag={createTag}
                      />
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="genreId" className="form-label">
                      ジャンル <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="genreId"
                      value={genreId}
                      onChange={e => handleGenreChange(e.target.value)}
                      required
                      disabled={submitLoading}
                    >
                      <option value="">ジャンルを選択してください</option>
                      {genreTags.map(tag => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))}
                      <option value="NEW_GENRE">新しいジャンルを追加</option>
                    </select>

                    {showNewGenreForm && (
                      <InlineTagCreator
                        category="genre"
                        onTagCreated={handleTagCreated}
                        onClose={() => setShowNewGenreForm(false)}
                        creating={creating}
                        onCreateTag={createTag}
                      />
                    )}
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary"
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
                        <>
                          <i className="bi bi-plus-circle me-2"></i>
                          店舗を登録
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
};

export default RestaurantNewPage;