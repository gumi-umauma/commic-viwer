"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type ViewerPage = {
  pageNumber: number;
  imageUrl: string;
};

type Props = {
  comicId: string;
  comicTitle: string;
  volumeNumber: number;
  pages: ViewerPage[];
  nextVolumeNumber: number | null;
};

export function ComicViewer({
  comicId,
  comicTitle,
  volumeNumber,
  pages,
  nextVolumeNumber,
}: Props) {
  const [uiVisible, setUiVisible] = useState(false);
  const [showNextDialog, setShowNextDialog] = useState(false);
  const autoHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const lastImgRef = useRef<HTMLImageElement | null>(null);
  const scrollThumbRef = useRef<HTMLDivElement | null>(null);

  const clearAutoHide = useCallback(() => {
    if (autoHideTimer.current) {
      clearTimeout(autoHideTimer.current);
      autoHideTimer.current = null;
    }
  }, []);

  const hideUi = useCallback(() => {
    setUiVisible(false);
    clearAutoHide();
  }, [clearAutoHide]);

  const showUi = useCallback(() => {
    setUiVisible(true);
    clearAutoHide();
    autoHideTimer.current = setTimeout(hideUi, 3000);
  }, [clearAutoHide, hideUi]);

  const toggleUi = useCallback(() => {
    if (uiVisible) {
      hideUi();
    } else {
      showUi();
    }
  }, [uiVisible, hideUi, showUi]);

  // タップ判定: pointerDown/Up間の移動距離が小さければタップとみなす
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      pointerStart.current = { x: e.clientX, y: e.clientY };
    },
    []
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!pointerStart.current) return;
      const dx = e.clientX - pointerStart.current.x;
      const dy = e.clientY - pointerStart.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      pointerStart.current = null;

      if (distance < 10) {
        toggleUi();
      }
    },
    [toggleUi]
  );

  // スクロールバーのスクロール位置追跡
  useEffect(() => {
    if (!uiVisible) return;

    const TRACK_TOP = 60;
    const TRACK_BOTTOM = 20;
    const THUMB_HEIGHT = 48;

    const updateScrollThumb = () => {
      if (!scrollThumbRef.current) return;
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const ratio = scrollTop / docHeight;
      const trackHeight = window.innerHeight - TRACK_TOP - TRACK_BOTTOM;
      const top = TRACK_TOP + ratio * (trackHeight - THUMB_HEIGHT);
      scrollThumbRef.current.style.top = `${top}px`;
    };

    updateScrollThumb();
    window.addEventListener("scroll", updateScrollThumb, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollThumb);
  }, [uiVisible]);

  // 最終ページのIntersectionObserver
  useEffect(() => {
    if (!nextVolumeNumber || pages.length === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowNextDialog(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    const lastImg = lastImgRef.current;
    if (lastImg) {
      observer.observe(lastImg);
    }

    return () => {
      if (lastImg) observer.unobserve(lastImg);
    };
  }, [nextVolumeNumber, pages.length]);

  // クリーンアップ
  useEffect(() => {
    return () => clearAutoHide();
  }, [clearAutoHide]);

  return (
    <main
      className="min-h-screen relative"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* ヘッダー */}
      <header
        className={`fixed top-0 left-0 right-0 z-20 bg-black/80 text-white p-4 flex items-center gap-4 transition-transform duration-300 ${
          uiVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Link
          href={`/comic/${comicId}`}
          className="text-on-primary hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          &larr; 巻一覧
        </Link>
        <h1 className="text-lg font-bold">
          {comicTitle} - 第{volumeNumber}巻
        </h1>
      </header>

      {/* ページ画像 */}
      {pages.length === 0 ? (
        <div className="p-8 text-center text-muted">
          ページが見つかりません
        </div>
      ) : (
        <div className="flex flex-col items-center bg-placeholder">
          {pages.map((page, index) => (
            <img
              key={page.pageNumber}
              ref={index === pages.length - 1 ? lastImgRef : undefined}
              src={page.imageUrl}
              alt={`第${volumeNumber}巻 ページ${page.pageNumber}`}
              className="w-full max-w-3xl"
              style={{ aspectRatio: "2/3" }}
              loading="lazy"
            />
          ))}
        </div>
      )}

      {/* カスタムスクロールバー */}
      <div
        className={`fixed right-2 top-0 bottom-0 w-3 z-20 pointer-events-none transition-opacity duration-300 ${
          uiVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute right-0 top-[60px] bottom-[20px] w-3 bg-black/30 rounded-full" />
        <div
          ref={scrollThumbRef}
          className="absolute right-0 w-3 h-12 bg-black/70 rounded-full"
          style={{ top: "60px" }}
        />
      </div>

      {/* 次の巻ダイアログ */}
      {showNextDialog && nextVolumeNumber !== null && (
        <div className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="bg-black/80 text-white rounded-xl p-6 shadow-2xl pointer-events-auto text-center relative">
            <button
              className="absolute top-2 right-2 text-white/60 hover:text-white text-xl leading-none p-1"
              onClick={(e) => {
                e.stopPropagation();
                setShowNextDialog(false);
              }}
            >
              &times;
            </button>
            <Link
              href={`/comic/${comicId}/volume/${nextVolumeNumber}`}
              className="inline-block px-6 py-3 bg-primary hover:bg-primary-hover text-on-primary rounded-lg font-bold transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              第{nextVolumeNumber}巻へ進む
            </Link>
          </div>
        </div>
      )}

      {/* ブラウザデフォルトスクロールバー非表示用スタイル */}
      <style jsx global>{`
        body::-webkit-scrollbar {
          display: none;
        }
        body {
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
