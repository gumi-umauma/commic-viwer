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
            className="text-[22px] font-semibold bg-surface border border-outline rounded px-2 py-1 flex-1 focus:border-outline-focus focus:outline-none"
            disabled={isPending}
            autoFocus
          />
          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-4 py-2 text-[14px] bg-primary text-on-primary rounded hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            保存
          </button>
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="px-4 py-2 text-[14px] bg-surface border border-outline rounded hover:bg-surface-hover transition-colors disabled:opacity-50"
          >
            キャンセル
          </button>
        </div>
        {error && <p className="text-danger text-sm mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mb-4">
      <h1 className="text-[22px] font-semibold text-heading">{title}</h1>
      <button
        onClick={() => setIsEditing(true)}
        className="px-3 py-1 text-[14px] bg-surface border border-outline rounded hover:bg-surface-hover transition-colors"
      >
        編集
      </button>
    </div>
  );
}
