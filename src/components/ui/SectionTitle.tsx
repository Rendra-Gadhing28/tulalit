import React from "react";

interface SectionTitleProps {
  badge?: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "center" | "left";
}

export function SectionTitle({
  badge,
  title,
  subtitle,
  className = "",
  align = "center",
}: SectionTitleProps) {
  return (
    <div
      className={`mb-10 md:mb-14 ${
        align === "center" ? "text-center mx-auto" : "text-left"
      } max-w-3xl ${className}`}
    >
      {badge && (
        /* Feels like a rubber-stamp tag, not a generic pill */
        <div
          className="inline-block mb-4 stamp-border border-amber-700/50 dark:border-accent-mustard/30 text-amber-800 dark:text-accent-mustard"
          style={{ transform: "rotate(-0.8deg)" }}
        >
          <span className="block px-3 py-0.5 font-mono text-[11px] font-bold text-amber-800 dark:text-amber-300">
            {badge}
          </span>
        </div>
      )}

      <h2 className="font-hand text-4xl md:text-5xl lg:text-6xl font-bold text-ink-navy dark:text-white relative inline-block leading-tight">
        {title}
        {/* Highlighter underline — one organic swipe, not a gradient band */}
        <span
          aria-hidden="true"
          className="absolute left-0 right-0 -z-10 pointer-events-none"
          style={{
            bottom: "2px",
            height: "12px",
            background: "rgba(244,185,66,0.32)",
            transform: "rotate(-0.5deg) skewX(-2deg)",
            borderRadius: "2px",
          }}
        />
      </h2>

      {subtitle && (
        <p className="mt-4 font-sans text-sm md:text-base text-ink-muted dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
