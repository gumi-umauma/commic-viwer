"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { registerVolume } from "./actions";

type Props = {
  comicId: string;
  defaultVolumeNumber: number;
  folders: string[];
};

export function VolumeRegisterForm({
  comicId,
  defaultVolumeNumber,
  folders,
}: Props) {
  const [volumeNumber, setVolumeNumber] = useState(defaultVolumeNumber);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = () => {
    if (!Number.isInteger(volumeNumber) || volumeNumber < 1) {
      setError("巻番号は1以上の整数で入力してください");
      return;
    }
    if (!selectedFolder) {
      setError("ソースフォルダを選択してください");
      return;
    }
    setError(null);

    startTransition(async () => {
      const result = await registerVolume(
        comicId,
        volumeNumber,
        selectedFolder
      );
      if (result.success) {
        router.push(`/admin/comic/${comicId}`);
      } else {
        setError(result.error ?? "登録に失敗しました");
      }
    });
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">巻番号</label>
        <input
          type="number"
          min={1}
          value={volumeNumber}
          onChange={(e) => setVolumeNumber(parseInt(e.target.value, 10))}
          className="bg-surface border border-outline rounded px-3 py-2 w-32 focus:border-outline-focus focus:outline-none"
          disabled={isPending}
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">ソースフォルダ</label>
        {folders.length === 0 ? (
          <p className="text-muted">利用可能なフォルダがありません</p>
        ) : (
          <ul className="space-y-1 max-h-60 overflow-y-auto border border-outline rounded p-2">
            {folders.map((folder) => (
              <li key={folder}>
                <button
                  onClick={() => setSelectedFolder(folder)}
                  className={`w-full text-left px-3 py-2 rounded ${
                    selectedFolder === folder
                      ? "bg-surface-hover border border-primary"
                      : "hover:bg-surface-hover"
                  }`}
                  disabled={isPending}
                >
                  {folder}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isPending || folders.length === 0}
        className="px-4 py-2 text-[14px] bg-primary text-on-primary rounded hover:bg-primary-hover transition-colors disabled:opacity-50"
      >
        {isPending ? "登録中..." : "登録"}
      </button>

      {error && <p className="text-danger text-sm mt-2">{error}</p>}
    </div>
  );
}
