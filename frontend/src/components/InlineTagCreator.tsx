import React, { useState } from 'react';
import type { Tag, CreateTagRequest } from '@/types/api';

interface InlineTagCreatorProps {
  category: 'area' | 'genre';
  onTagCreated: (tag: Tag) => void;
  onClose: () => void;
  creating: boolean;
  onCreateTag: (data: CreateTagRequest) => Promise<Tag | null>;
}

const InlineTagCreator: React.FC<InlineTagCreatorProps> = ({
  category,
  onTagCreated,
  onClose,
  creating,
  onCreateTag
}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!name.trim()) {
      setError('タグ名を入力してください');
      return;
    }

    const tagData: CreateTagRequest = {
      tag: {
        name: name.trim(),
        category
      }
    };

    try {
      const result = await onCreateTag(tagData);
      if (result) {
        onTagCreated(result);
        setName('');
      } else {
        setError('タグの作成に失敗しました');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'タグの作成に失敗しました');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !creating && name.trim()) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const categoryLabel = category === 'area' ? 'エリア' : 'ジャンル';

  return (
    <div className="border rounded p-3 mb-3 bg-light">
      <h6 className="mb-3">
        <i className="bi bi-plus-circle me-2"></i>
        新しい{categoryLabel}を追加
      </h6>
      
      {error && (
        <div className="alert alert-danger alert-sm mb-2">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      <div>
        <div className="mb-3">
          <label htmlFor={`new-${category}-name`} className="form-label">
            {categoryLabel}名 <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id={`new-${category}-name`}
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`新しい${categoryLabel}名を入力`}
            disabled={creating}
            maxLength={255}
            required
          />
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleSubmit}
            disabled={creating || !name.trim()}
          >
            {creating ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                作成中...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg me-2"></i>
                作成
              </>
            )}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
            disabled={creating}
          >
            <i className="bi bi-x-lg me-2"></i>
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default InlineTagCreator;
