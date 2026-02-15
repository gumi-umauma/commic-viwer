"use client";

import Link from "next/link";
import { useCallback, useRef, useState, useTransition } from "react";
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

const LONG_PRESS_MS = 500;

export function VolumeCardList({ comicId, volumes }: Props) {
  const [readState, setReadState] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    for (const v of volumes) {
      map[v.id] = v.isRead;
    }
    return map;
  });
  const [isPending, startTransition] = useTransition();
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);

  const handlePressStart = useCallback(
    (volumeId: string) => {
      isLongPress.current = false;
      longPressTimer.current = setTimeout(() => {
        isLongPress.current = true;
        startTransition(async () => {
          const result = await toggleReadStatus(comicId, volumeId);
          if (result.success) {
            setReadState((prev) => ({ ...prev, [volumeId]: result.isRead }));
          }
        });
      }, LONG_PRESS_MS);
    },
    [comicId]
  );

  const handlePressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isLongPress.current) {
        e.preventDefault();
      }
    },
    []
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {volumes.map((volume) => (
        <Link
          key={volume.id}
          href={`/comic/${comicId}/volume/${volume.volumeNumber}`}
          className="bg-surface border border-outline rounded overflow-hidden hover:bg-surface-hover transition-colors relative select-none"
          onPointerDown={() => handlePressStart(volume.id)}
          onPointerUp={handlePressEnd}
          onPointerLeave={handlePressEnd}
          onContextMenu={(e) => e.preventDefault()}
          onClick={handleClick}
        >
          <div className="relative">
            <img
              src={`/api/comic/${comicId}/volume/${volume.volumeNumber}/page/1`}
              alt={`第${volume.volumeNumber}巻`}
              className="w-full aspect-[2/3] object-cover bg-placeholder"
              draggable={false}
            />
            {readState[volume.id] && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-lg font-bold">既読</span>
              </div>
            )}
          </div>
          <p className="p-2 text-body text-sm font-medium">
            第{volume.volumeNumber}巻
          </p>
        </Link>
      ))}
    </div>
  );
}
