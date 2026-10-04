"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import wrappedData from "@/data/wrapped.json";
import { Sticker } from "@/components/ui/Sticker";
import { playSfx } from "@/lib/sound";
import {
  ArrowLeft,
  Pause,
  Play,
  Share2,
  Download,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";

const SLIDE_DURATION = 6000; // 6 detik per slide

type SlideMedia = {
  type: "video" | "image";
  url: string;
  placement?: "background" | "frame";
  caption?: string;
};

type WrappedSlide = {
  id: string;
  title: string;
  subtitle: string;
  metric: string;
  metricLabel: string;
  description: string;
  bgColor: string;
  accentColor: string;
  stickerId?: string;
  extraList?: string[];
  media?: SlideMedia;
};

export default function WrappedStoryPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [sharedToast, setSharedToast] = useState<string | null>(null);

  const slideRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const slides = wrappedData.slides as WrappedSlide[];
  const currentSlide = slides[currentIdx];

  // Pause/resume video with story pause state
  useEffect(() => {
    if (!videoRef.current) return;
    if (isPaused) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
  }, [isPaused]);

  // Reset video when slide changes
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    if (!isPaused) {
      videoRef.current.play().catch(() => {});
    }
  }, [currentIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-advance progress
  useEffect(() => {
    if (isPaused) return;

    const interval = 50; // update every 50ms
    const step = (interval / SLIDE_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Go next
          if (currentIdx < slides.length - 1) {
            setCurrentIdx((c) => c + 1);
            return 0;
          } else {
            // End of story
            setIsPaused(true);
            return 100;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, currentIdx, slides.length]);

  const goToSlide = useCallback((idx: number) => {
    playSfx("click");
    setCurrentIdx(idx);
    setProgress(0);
  }, []);

  const handlePrev = useCallback(() => {
    if (currentIdx > 0) {
      goToSlide(currentIdx - 1);
    }
  }, [currentIdx, goToSlide]);

  const handleNext = useCallback(() => {
    if (currentIdx < slides.length - 1) {
      goToSlide(currentIdx + 1);
    }
  }, [currentIdx, slides.length, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === " ") {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handlePrev, handleNext]);

  // Trigger achievement on last slide
  useEffect(() => {
    if (currentIdx === slides.length - 1) {
      try {
        const stored = localStorage.getItem("tulalit_unlocked_achievements");
        const parsed = stored ? JSON.parse(stored) : {};
        if (!parsed["wrapped_watcher"]) {
          parsed["wrapped_watcher"] = new Date().toISOString();
          localStorage.setItem("tulalit_unlocked_achievements", JSON.stringify(parsed));
        }
      } catch {}
    }
  }, [currentIdx, slides.length]);

  const handleShareOrDownload = async () => {
    if (!slideRef.current || isDownloading) return;
    try {
      setIsDownloading(true);
      playSfx("click");
      const { toPng } = await import("html-to-image");
      const url = await toPng(slideRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });

      if (navigator.share) {
        try {
          const blob = await (await fetch(url)).blob();
          const file = new File([blob], `wrapped-slide-${currentIdx + 1}.png`, {
            type: "image/png",
          });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: `Kelas Wrapped: ${currentSlide.title}`,
              text: `${currentSlide.metric} ${currentSlide.metricLabel} — XII PPLG 3 Wrapped`,
            });
            setIsDownloading(false);
            return;
          }
        } catch {}
      }

      // Fallback: direct download
      const a = document.createElement("a");
      a.download = `wrapped-${currentSlide.id}-xiipplg3.png`;
      a.href = url;
      a.click();

      setSharedToast("Slide berhasil diunduh!");
      setTimeout(() => setSharedToast(null), 3000);
    } catch (err) {
      console.error("Gagal export slide:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const media = currentSlide.media;
  const isBackground = !media?.placement || media.placement === "background";
  const isFrame = media?.placement === "frame";

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-center select-none overflow-hidden touch-manipulation">
      {/* Top Controls & Progress Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 max-w-lg mx-auto flex flex-col gap-3">
        {/* Progress Bars */}
        <div className="flex items-center gap-1.5 w-full">
          {slides.map((s, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const barWidth = isCompleted ? 100 : isCurrent ? progress : 0;

            return (
              <div
                key={s.id}
                onClick={() => goToSlide(idx)}
                className="h-1.5 flex-1 bg-white/25 rounded-full overflow-hidden cursor-pointer"
              >
                <div
                  style={{ width: `${barWidth}%` }}
                  className="h-full bg-white transition-all duration-75"
                />
              </div>
            );
          })}
        </div>

        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            onClick={() => playSfx("click")}
            className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:bg-black/60 transition-colors"
            title="Keluar dari Wrapped"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
            {wrappedData.className} Wrapped • {currentIdx + 1}/{slides.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:bg-black/60 transition-colors"
              title={isPaused ? "Lanjutkan" : "Jeda"}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handleShareOrDownload}
              disabled={isDownloading}
              className="p-2 rounded-full bg-amber-400 text-ink-navy font-bold hover:bg-amber-300 transition-colors"
              title="Unduh / Bagikan Slide Ini"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Slide Story Frame */}
      <div
        ref={slideRef}
        style={{ backgroundColor: currentSlide.bgColor }}
        className="w-full max-w-md h-full max-h-[860px] flex flex-col justify-between p-8 sm:p-10 pt-24 pb-20 relative transition-colors duration-500 shadow-2xl overflow-hidden"
      >
        {/* Background Media */}
        {media && isBackground && (
          <>
            {media.type === "video" ? (
              <video
                ref={videoRef}
                src={media.url}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <img
                src={media.url}
                alt={currentSlide.title}
                className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            {/* Gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
          </>
        )}

        {/* Decorative Ring Background */}
        <div
          aria-hidden="true"
          style={{ borderColor: currentSlide.accentColor }}
          className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full border-8 opacity-10 pointer-events-none"
        />

        {/* Top: Category/Subtitle */}
        <div>
          <span
            style={{ color: currentSlide.accentColor }}
            className="font-mono text-xs md:text-sm font-bold uppercase tracking-widest block mb-2"
          >
            ★ {currentSlide.subtitle} ★
          </span>
          <h2 className="font-hand text-4xl sm:text-5xl font-bold leading-tight text-white">
            {currentSlide.title}
          </h2>
        </div>

        {/* Center: Large Metric Display */}
        <div className="my-auto py-6 text-center">
          {currentSlide.stickerId && (
            <div className="mb-6 flex justify-center transform hover:scale-110 transition-transform">
              <Sticker id={currentSlide.stickerId} size={84} decorative />
            </div>
          )}

          <div
            style={{ color: currentSlide.accentColor }}
            className="font-mono font-black text-6xl sm:text-7xl tracking-tighter"
          >
            {currentSlide.metric}
          </div>

          <div className="mt-2 font-mono text-xs sm:text-sm uppercase tracking-widest text-gray-300 font-bold">
            {currentSlide.metricLabel}
          </div>

          {currentSlide.extraList && (
            <div className="mt-6 space-y-2 text-left bg-black/30 p-4 rounded-xl border border-white/10 font-mono text-xs">
              {currentSlide.extraList.map((item, i) => (
                <div key={i} className="text-gray-200">
                  {item}
                </div>
              ))}
            </div>
          )}

          {/* Frame Media */}
          {media && isFrame && (
            <div className="mt-6 flex flex-col items-center">
              <div className="relative bg-white p-2 pb-8 shadow-xl rotate-1 hover:rotate-0 transition-transform duration-300"
                   style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}>
                {/* Washi tape top */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-amber-300/70 rounded-sm opacity-80" />
                {media.type === "video" ? (
                  <video
                    src={media.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-48 h-36 object-cover block"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <img
                    src={media.url}
                    alt={media.caption ?? currentSlide.title}
                    className="w-48 h-36 object-cover block"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
                {media.caption && (
                  <p className="mt-1 text-center text-[11px] font-mono text-gray-700 leading-tight">
                    {media.caption}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom: Description & Story Footer */}
        <div>
          <p className="font-sans text-sm md:text-base text-gray-200 leading-relaxed bg-black/20 backdrop-blur-xs p-4 rounded-xl border border-white/10">
            {currentSlide.description}
          </p>

          <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span>XII PPLG 3 • 2025-2027</span>
            <span style={{ color: currentSlide.accentColor }}>#KelasWrapped</span>
          </div>
        </div>
      </div>

      {/* Screen Tap Navigation Hotspots (Left: Prev, Right: Next) */}
      <div
        className="absolute top-24 bottom-20 left-0 w-1/3 cursor-pointer z-20"
        onClick={handlePrev}
        title="Tap untuk slide sebelumnya"
      />
      <div
        className="absolute top-24 bottom-20 right-0 w-2/3 cursor-pointer z-20"
        onClick={handleNext}
        title="Tap untuk slide selanjutnya"
      />

      {/* Toast Alert */}
      {sharedToast && (
        <div className="absolute bottom-6 z-40 bg-emerald-500 text-white px-4 py-2 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 shadow-xl animate-fade-in">
          <Check className="w-3.5 h-3.5" />
          <span>{sharedToast}</span>
        </div>
      )}
    </div>
  );
}
