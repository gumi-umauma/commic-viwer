"use client";

import { useTransition } from "react";
import { deleteComic } from "./actions";

type Props = {
  comicId: string;
};

export function DeleteComicButton({ comicId }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm("この漫画を削除しますか？（画像フォルダは削除されません）")) {
      return;
    }

    startTransition(async () => {
      const result = await deleteComic(comicId);
      if (result && !result.success) {
        alert(result.error ?? "削除に失敗しました");
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
    >
      {isPending ? "削除中..." : "漫画を削除"}
    </button>
  );
}
