"use client";

import { useTransition } from "react";
import { deleteVolume } from "./actions";

type Props = {
  comicId: string;
  volumeNumber: number;
};

export function DeleteVolumeButton({ comicId, volumeNumber }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm(`第${volumeNumber}巻を削除しますか？（画像ファイルは削除されません）`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteVolume(comicId, volumeNumber);
      if (result && !result.success) {
        alert(result.error ?? "削除に失敗しました");
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="px-4 py-2 text-[14px] border border-danger text-danger rounded hover:bg-danger hover:text-danger-fg transition-colors disabled:opacity-50"
    >
      {isPending ? "削除中..." : "巻を削除"}
    </button>
  );
}
