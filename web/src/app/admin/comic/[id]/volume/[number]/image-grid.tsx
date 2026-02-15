"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePages } from "./actions";

type Page = {
  pageNumber: number;
  imageUrl: string;
};

type Props = {
  pages: Page[];
  comicId: string;
  volumeNumber: number;
};

export function ImageGrid({ pages, comicId, volumeNumber }: Props) {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mode, setMode] = useState<"view" | "delete">("view");
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [cacheBuster, setCacheBuster] = useState(0);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null && prev > 0 ? prev - 1 : prev
    );
  }, []);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null && prev < pages.length - 1 ? prev + 1 : prev
    );
  }, [pages.length]);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const toggleDeleteMode = () => {
    if (mode === "delete") {
      setMode("view");
      setSelectedPages(new Set());
    } else {
      setMode("delete");
      setSelectedIndex(null);
    }
  };

  const togglePageSelection = (pageNumber: number) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(pageNumber)) {
        next.delete(pageNumber);
      } else {
        next.add(pageNumber);
      }
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedPages(new Set());
  };

  const handleDeletePages = () => {
    if (selectedPages.size === 0) return;

    const message = `${selectedPages.size}ページを削除しますか？\n残りのページは自動で連番に振り直されます。`;

    if (!window.confirm(message)) return;

    startTransition(async () => {
      const result = await deletePages(
        comicId,
        volumeNumber,
        Array.from(selectedPages)
      );
      if (result.success) {
        setMode("view");
        setSelectedPages(new Set());
        setCacheBuster((prev) => prev + 1);
        router.refresh();
      } else {
        alert(result.error ?? "削除に失敗しました");
      }
    });
  };

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handlePrev, handleNext, handleClose]);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={toggleDeleteMode}
          className={`text-[13px] px-3 py-1.5 rounded border transition-colors cursor-pointer ${
            mode === "delete"
              ? "bg-danger text-danger-fg border-danger"
              : "border-outline text-secondary hover:border-outline-hover"
          }`}
        >
          {mode === "delete" ? "削除モード解除" : "ページ削除モード"}
        </button>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {pages.map((page, index) => (
          <button
            key={page.pageNumber}
            onClick={() => {
              if (mode === "delete") {
                togglePageSelection(page.pageNumber);
              } else {
                setSelectedIndex(index);
              }
            }}
            className="text-center group cursor-pointer relative"
          >
            <div
              className={`aspect-[3/4] overflow-hidden rounded border transition-colors ${
                mode === "delete" && selectedPages.has(page.pageNumber)
                  ? "border-danger"
                  : "border-outline group-hover:border-outline-focus"
              }`}
            >
              <img
                src={`${page.imageUrl}${cacheBuster ? `?v=${cacheBuster}` : ""}`}
                alt={`ページ ${page.pageNumber}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              {mode === "delete" && selectedPages.has(page.pageNumber) && (
                <div className="absolute inset-0 bg-danger/30 rounded flex items-center justify-center">
                  <span className="text-white text-2xl font-bold drop-shadow">
                    &#x2713;
                  </span>
                </div>
              )}
            </div>
            <p className="mt-0.5 text-[11px] text-secondary">
              {String(page.pageNumber).padStart(4, "0")}
            </p>
          </button>
        ))}
      </div>

      {mode === "delete" && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-outline px-6 py-3 flex items-center justify-between">
          <span className="text-[13px] text-body">
            {selectedPages.size}件選択中
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={clearSelection}
              className="text-[13px] text-secondary hover:underline cursor-pointer"
            >
              選択解除
            </button>
            <button
              onClick={handleDeletePages}
              disabled={selectedPages.size === 0 || isPending}
              className="text-[13px] px-4 py-1.5 rounded bg-danger text-danger-fg hover:bg-danger/90 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              {isPending ? "削除中..." : "選択を削除"}
            </button>
          </div>
        </div>
      )}

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={handleClose}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300"
            >
              &times;
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={handlePrev}
                disabled={selectedIndex === 0}
                className="text-white text-4xl px-2 hover:text-gray-300 disabled:opacity-30"
              >
                &#x25C0;
              </button>

              <img
                src={`${pages[selectedIndex].imageUrl}${cacheBuster ? `?v=${cacheBuster}` : ""}`}
                alt={`ページ ${pages[selectedIndex].pageNumber}`}
                className="max-h-[80vh] max-w-[70vw] object-contain"
              />

              <button
                onClick={handleNext}
                disabled={selectedIndex === pages.length - 1}
                className="text-white text-4xl px-2 hover:text-gray-300 disabled:opacity-30"
              >
                &#x25B6;
              </button>
            </div>

            <p className="mt-4 text-white text-lg">
              {pages[selectedIndex].pageNumber} / {pages.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
