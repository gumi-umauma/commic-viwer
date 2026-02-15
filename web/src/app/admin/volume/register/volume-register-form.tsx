"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getDefaultVolumeNumber, registerVolume } from "./actions";

type Comic = {
  id: string;
  title: string;
};

type Props = {
  comics: Comic[];
  folders: string[];
};

export function VolumeRegisterForm({ comics, folders }: Props) {
  const [selectedComicId, setSelectedComicId] = useState<string>("");
  const [volumeNumber, setVolumeNumber] = useState<number>(1);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleComicChange = (comicId: string) => {
    setSelectedComicId(comicId);
    setError(null);
    if (!comicId) {
      setVolumeNumber(1);
      return;
    }
    startTransition(async () => {
      const result = await getDefaultVolumeNumber(comicId);
      if (result.success && result.defaultVolumeNumber !== undefined) {
        setVolumeNumber(result.defaultVolumeNumber);
      }
    });
  };

  const handleSubmit = () => {
    if (!selectedComicId) {
      setError("漫画を選択してください");
      return;
    }
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
        selectedComicId,
        volumeNumber,
        selectedFolder
      );
      if (result.success) {
        router.push(`/admin/comic/${selectedComicId}/volume/${volumeNumber}`);
      } else {
        setError(result.error ?? "登録に失敗しました");
      }
    });
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">漫画</label>
        <select
          value={selectedComicId}
          onChange={(e) => handleComicChange(e.target.value)}
          className="bg-surface border border-outline rounded px-3 py-2 w-64 focus:border-outline-focus focus:outline-none"
          disabled={isPending}
        >
          <option value="">選択してください</option>
          {comics.map((comic) => (
            <option key={comic.id} value={comic.id}>
              {comic.title}
            </option>
          ))}
        </select>
      </div>

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
