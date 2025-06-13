import React, { useState } from 'react';
import type { Tag, CreateTagRequest } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PlusCircle, Check, X, AlertTriangle } from 'lucide-react';
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

  // フォームフィールドコンポーネント
  const InlineTagFormField = () => (
    <div className="space-y-2">
      <Label htmlFor={`new-${category}-name`}>
        {categoryLabel}名 <span className="text-destructive">*</span>
      </Label>
      <Input
        type="text"
        id={`new-${category}-name`}
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`新しい${categoryLabel}名を入力`}
        disabled={creating}
        maxLength={255}
        required
        className="w-full"
      />
    </div>
  );

  return (
    <Card className="mb-3">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          新しい{categoryLabel}を追加
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-3 p-3 rounded-md bg-destructive/10 text-destructive flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <InlineTagFormField />

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={creating || !name.trim()}
              size="sm"
              className="flex items-center gap-2"
            >
              {creating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  作成中...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  作成
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={creating}
              size="sm"
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              キャンセル
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InlineTagCreator;
