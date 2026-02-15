"use client";

import { useState, useEffect, useCallback } from "react";

type Page = {
  pageNumber: number;
  imageUrl: string;
};

type Props = {
  pages: Page[];
};

export function ImageGrid({ pages }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {pages.map((page, index) => (
          <button
            key={page.pageNumber}
            onClick={() => setSelectedIndex(index)}
            className="text-center group cursor-pointer"
          >
            <div className="aspect-[3/4] overflow-hidden rounded border border-outline group-hover:border-outline-focus transition-colors">
              <img
                src={page.imageUrl}
                alt={`ページ ${page.pageNumber}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-0.5 text-[11px] text-secondary">
              {String(page.pageNumber).padStart(4, "0")}
            </p>
          </button>
        ))}
      </div>

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
                src={pages[selectedIndex].imageUrl}
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
