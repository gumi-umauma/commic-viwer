"use client";

import { useState, useTransition } from "react";
import { updateComicTitle } from "./actions";

type Props = {
  comicId: string;
  initialTitle: string;
};

export function ComicTitleEditor({ comicId, initialTitle }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [editValue, setEditValue] = useState(initialTitle);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (!trimmed) {
      setError("タイトルを入力してください");
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await updateComicTitle(comicId, trimmed);
      if (result.success) {
        setTitle(trimmed);
        setIsEditing(false);
      } else {
        setError(result.error ?? "保存に失敗しました");
      }
    });
  };

  const handleCancel = () => {
    setEditValue(title);
    setError(null);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="text-2xl font-bold border rounded px-2 py-1 flex-1"
            disabled={isPending}
            autoFocus
          />
          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            保存
          </button>
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            キャンセル
          </button>
        </div>
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mb-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <button
        onClick={() => setIsEditing(true)}
        className="px-3 py-1 text-sm border rounded hover:bg-gray-50 transition-colors"
      >
        編集
      </button>
    </div>
  );
}
