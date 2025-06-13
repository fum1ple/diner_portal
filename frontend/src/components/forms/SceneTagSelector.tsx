import React, { useState, useEffect } from 'react';
import { Button, Badge, Card, CardContent, CardHeader, CardTitle, Label } from '@/components/ui';
import { Plus, X } from 'lucide-react';
import { Tag, CreateTagRequest } from '@/types/tag';
import { tagsApi } from '@/lib/api';
import InlineTagCreator from './InlineTagCreator';

interface SceneTagSelectorProps {
  selectedTagIds: number[];
  onSelectionChange: (tagIds: number[]) => void;
  disabled?: boolean;
}

const SceneTagSelector: React.FC<SceneTagSelectorProps> = ({
  selectedTagIds,
  onSelectionChange,
  disabled = false
}) => {
  const [sceneTags, setSceneTags] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [errorTags, setErrorTags] = useState<string | null>(null);
  const [showTagCreator, setShowTagCreator] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  // シーンタグを取得
  useEffect(() => {
    const fetchTags = async () => {
      setIsLoadingTags(true);
      setErrorTags(null);
      const response = await tagsApi.getSceneTags();
      if (response.data) {
        setSceneTags(response.data);
      } else {
        const errorMessage = response.error || 'シーンタグの読み込みに失敗しました。';
        setErrorTags(errorMessage);
      }
      setIsLoadingTags(false);
    };
    fetchTags();
  }, []);

  // タグの選択/選択解除
  const toggleTag = (tagId: number) => {
    if (disabled) return;
    
    if (selectedTagIds.includes(tagId)) {
      onSelectionChange(selectedTagIds.filter(id => id !== tagId));
    } else {
      onSelectionChange([...selectedTagIds, tagId]);
    }
  };

  // 新しいタグを作成
  const handleCreateTag = async (data: CreateTagRequest): Promise<Tag | null> => {
    setIsCreatingTag(true);
    try {
      const response = await tagsApi.create(data);
      if (response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'タグの作成に失敗しました');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsCreatingTag(false);
    }
  };

  // タグ作成成功時の処理
  const handleTagCreated = (newTag: Tag) => {
    setSceneTags(prev => [...prev, newTag]);
    setShowTagCreator(false);
    // 新しく作成したタグを自動選択
    onSelectionChange([...selectedTagIds, newTag.id]);
  };

  // 選択されたタグの情報を取得
  const selectedTags = sceneTags.filter(tag => selectedTagIds.includes(tag.id));

  if (isLoadingTags) {
    return (
      <div className="space-y-2">
        <Label>シーンタグ（任意）</Label>
        <p className="text-sm text-gray-500">シーンタグを読み込み中...</p>
      </div>
    );
  }

  if (errorTags) {
    return (
      <div className="space-y-2">
        <Label>シーンタグ（任意）</Label>
        <p className="text-sm text-red-600">{errorTags}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>シーンタグ（任意）</Label>
        <p className="text-sm text-gray-500">複数選択可能です</p>
      </div>

      {/* 選択されたタグを表示 */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map(tag => (
            <Badge 
              key={tag.id} 
              variant="default" 
              className="flex items-center gap-1"
            >
              {tag.name}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => toggleTag(tag.id)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* タグ選択エリア */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">利用可能なシーンタグ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-3">
            {sceneTags
              .filter(tag => !selectedTagIds.includes(tag.id))
              .map(tag => (
                <Button
                  key={tag.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toggleTag(tag.id)}
                  disabled={disabled}
                  className="h-8"
                >
                  {tag.name}
                </Button>
              ))}
          </div>

          {/* 新しいタグを追加ボタン */}
          <div className="border-t pt-3">
            {!showTagCreator ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowTagCreator(true)}
                disabled={disabled}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                新しいシーンタグを追加
              </Button>
            ) : (
              <InlineTagCreator
                category="scene"
                onTagCreated={handleTagCreated}
                onClose={() => setShowTagCreator(false)}
                creating={isCreatingTag}
                onCreateTag={handleCreateTag}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SceneTagSelector;