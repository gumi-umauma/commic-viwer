"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  registerComic,
  registerComicFromExistingFolder,
  getDetectedVolumes,
} from "./actions";

type Mode = "new" | "existing";

type Props = {
  folders: string[];
};

export function RegisterForm({ folders }: Props) {
  const [mode, setMode] = useState<Mode>("new");

  const [title, setTitle] = useState("");

  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [detectedVolumes, setDetectedVolumes] = useState<number[]>([]);
  const [isLoadingVolumes, setIsLoadingVolumes] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (!selectedFolder) {
      setDetectedVolumes([]);
      return;
    }
    setIsLoadingVolumes(true);
    setError(null);
    getDetectedVolumes(selectedFolder).then((result) => {
      if (result.success && result.volumes) {
        setDetectedVolumes(result.volumes);
      } else {
        setError(result.error ?? "巻の検出に失敗しました");
      }
      setIsLoadingVolumes(false);
    });
  }, [selectedFolder]);

  const handleSubmitNew = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setError("タイトルを入力してください");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await registerComic(trimmed);
      if (result.success && result.id) {
        router.push(`/admin/comic/${result.id}`);
      } else {
        setError(result.error ?? "登録に失敗しました");
      }
    });
  };

  const handleSubmitExisting = () => {
    if (!selectedFolder) {
      setError("フォルダを選択してください");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await registerComicFromExistingFolder(selectedFolder);
      if (result.success && result.id) {
        router.push(`/admin/comic/${result.id}`);
      } else {
        setError(result.error ?? "登録に失敗しました");
      }
    });
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setError(null);
    setSelectedFolder(null);
    setDetectedVolumes([]);
    setTitle("");
  };

  return (
    <div>
      <div className="flex border-b mb-4">
        <button
          onClick={() => handleModeChange("new")}
          className={`px-4 py-2 -mb-px ${
            mode === "new"
              ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          新規作成
        </button>
        <button
          onClick={() => handleModeChange("existing")}
          className={`px-4 py-2 -mb-px ${
            mode === "existing"
              ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          既存フォルダ
        </button>
      </div>

      {mode === "new" && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="漫画タイトル"
            className="text-lg border rounded px-3 py-2 flex-1"
            disabled={isPending}
            autoFocus
          />
          <button
            onClick={handleSubmitNew}
            disabled={isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            登録
          </button>
        </div>
      )}

      {mode === "existing" && (
        <div>
          {folders.length === 0 ? (
            <p className="text-gray-500">登録可能なフォルダがありません</p>
          ) : (
            <>
              <ul className="space-y-1 mb-4 max-h-60 overflow-y-auto border rounded p-2">
                {folders.map((folder) => (
                  <li key={folder}>
                    <button
                      onClick={() => setSelectedFolder(folder)}
                      className={`w-full text-left px-3 py-2 rounded ${
                        selectedFolder === folder
                          ? "bg-blue-100 border border-blue-400"
                          : "hover:bg-gray-100"
                      }`}
                      disabled={isPending}
                    >
                      {folder}
                    </button>
                  </li>
                ))}
              </ul>

              {selectedFolder && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">
                    検出された巻（{selectedFolder}）
                  </h3>
                  {isLoadingVolumes ? (
                    <p className="text-gray-500">検出中...</p>
                  ) : detectedVolumes.length > 0 ? (
                    <ul className="space-y-1">
                      {detectedVolumes.map((num) => (
                        <li key={num} className="text-sm">
                          第{num}巻
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">
                      巻フォルダが見つかりません
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={handleSubmitExisting}
                disabled={isPending || !selectedFolder}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                登録
              </button>
            </>
          )}
        </div>
      )}

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}
