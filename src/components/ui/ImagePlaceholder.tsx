import React from "react";

interface ImagePlaceholderProps {
  label: string;
  category?: string;
  aspect?: "square" | "portrait" | "landscape";
  className?: string;
}

export function ImagePlaceholder({
  label,
  category = "Memori",
  aspect = "square",
  className = "",
}: ImagePlaceholderProps) {
  // Generate deterministic pastel color from label string
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hues = [210, 340, 45, 140, 280, 25];
  const selectedHue = hues[Math.abs(hash) % hues.length];

  const aspectClass =
    aspect === "portrait"
      ? "aspect-[3/4]"
      : aspect === "landscape"
      ? "aspect-[4/3]"
      : "aspect-square";

  return (
    <div
      className={`w-full relative flex flex-col items-center justify-center p-4 rounded border-2 border-dashed border-ink-navy/20 dark:border-white/20 select-none overflow-hidden ${aspectClass} ${className}`}
      style={{
        backgroundColor: `hsl(${selectedHue}, 50%, 94%)`,
      }}
    >
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:12px_12px]" />

      {/* Decorative Scrapbook Icon */}
      <div className="relative z-10 w-12 h-12 mb-2 rounded-full bg-white/80 dark:bg-darkbg-card shadow-sm flex items-center justify-center text-ink-navy dark:text-white">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      </div>

      {/* Category Pill */}
      <span className="relative z-10 text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-white/90 text-ink-navy shadow-sm mb-1">
        {category}
      </span>

      {/* Label */}
      <span className="relative z-10 font-hand text-base md:text-lg text-ink-brown dark:text-ink-navy text-center line-clamp-2 px-2 font-bold">
        {label}
      </span>

      <span className="relative z-10 text-[9px] font-mono text-ink-muted/80 mt-1">
        (Foto Placeholder)
      </span>
    </div>
  );
}
