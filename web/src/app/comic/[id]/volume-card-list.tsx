"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { toggleReadStatus } from "./actions";

type Volume = {
  id: string;
  volumeNumber: number;
  isRead: boolean;
};

type Props = {
  comicId: string;
  volumes: Volume[];
};

export function VolumeCardList({ comicId, volumes }: Props) {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [readState, setReadState] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    for (const v of volumes) {
      map[v.id] = v.isRead;
    }
    return map;
  });
  const [isPending, startTransition] = useTransition();

  const handleToggle = useCallback(
    (volumeId: string) => {
      startTransition(async () => {
        const result = await toggleReadStatus(comicId, volumeId);
        if (result.success) {
          setReadState((prev) => ({ ...prev, [volumeId]: result.isRead }));
        }
      });
    },
    [comicId]
  );

  const handleCardClick = useCallback(
    (volume: Volume) => {
      if (editMode) {
        handleToggle(volume.id);
      } else {
        router.push(`/comic/${comicId}/volume/${volume.volumeNumber}`);
      }
    },
    [editMode, comicId, router, handleToggle]
  );

  return (
    <>
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setEditMode((prev) => !prev)}
          className={`px-3 py-1.5 text-sm rounded border transition-colors ${
            editMode
              ? "bg-primary text-on-primary border-primary"
              : "bg-surface text-body border-outline hover:bg-surface-hover"
          }`}
        >
          {editMode ? "既読管理を終了" : "既読管理"}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {volumes.map((volume) => {
          const isRead = readState[volume.id];
          return (
            <div
              key={volume.id}
              role="button"
              className={`rounded overflow-hidden transition-colors select-none cursor-pointer ${
                isRead
                  ? "bg-gray-400 border border-gray-400"
                  : "bg-surface border border-outline hover:bg-surface-hover"
              } ${editMode ? "ring-2 ring-primary/30" : ""}`}
              onClick={() => handleCardClick(volume)}
            >
              <img
                src={`/api/comic/${comicId}/volume/${volume.volumeNumber}/page/1`}
                alt={`第${volume.volumeNumber}巻`}
                className="w-full aspect-[2/3] object-cover pointer-events-none bg-placeholder"
                draggable={false}
              />
              <p
                className={`p-2 text-sm font-medium ${
                  isRead ? "bg-gray-300 text-gray-500" : "text-body"
                }`}
              >
                第{volume.volumeNumber}巻
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}
