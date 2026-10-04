"use client";

import React, { useState } from "react";
import { GraduationCap } from "lucide-react";

export interface HeroTogaFallbackProps {
  onGraduate?: () => void;
}

export function HeroTogaFallback({ onGraduate }: HeroTogaFallbackProps) {
  const [isRight, setIsRight] = useState(false);
  const [hasFlipped, setHasFlipped] = useState(false);

  const handleClick = () => {
    const nextRight = !isRight;
    setIsRight(nextRight);
    if (nextRight && !hasFlipped) {
      setHasFlipped(true);
      setTimeout(() => onGraduate?.(), 400);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        aria-label="Klik kuncir toga untuk wisuda"
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
        className="relative w-44 h-44 md:w-56 md:h-56 mx-auto flex items-center justify-center select-none cursor-pointer animate-float-slow"
      >
        {/* 2D SVG Graduation Cap */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-[0_20px_25px_rgba(0,0,0,0.25)]"
        >
          {/* Cap Base Skullcap */}
          <path
            d="M60 100 L60 130 C60 150 140 150 140 130 L140 100 Z"
            fill="#0F172A"
            stroke="#FFFFFF"
            strokeWidth="6"
          />

          {/* Diamond Mortarboard */}
          <polygon
            points="100,50 185,85 100,120 15,85"
            fill="#1E293B"
            stroke="#FFFFFF"
            strokeWidth="8"
            strokeLinejoin="round"
          />

          {/* Tassel Button */}
          <circle cx="100" cy="85" r="7" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="3" />

          {/* Tassel — flips with CSS transition */}
          <g
            style={{
              transformOrigin: "100px 85px",
              transform: isRight ? "scaleX(-1)" : "scaleX(1)",
              transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {/* Tassel string */}
            <path
              d="M100 85 C140 95 170 110 170 145"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Tassel charm */}
            <circle cx="170" cy="148" r="8" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="3" />
            {/* Tassel fringe */}
            <line x1="158" y1="156" x2="154" y2="172" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
            <line x1="165" y1="158" x2="163" y2="175" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
            <line x1="172" y1="158" x2="172" y2="175" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
            <line x1="179" y1="156" x2="181" y2="172" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>

        {/* Floating decorative mini badges */}
        <div className="absolute top-2 -right-4 px-2 py-0.5 rounded-full bg-accent-mustard text-ink-navy text-[11px] font-mono font-bold shadow-md rotate-12">
          &lt;/&gt; LULUS
        </div>
        <div className="absolute bottom-4 -left-4 px-2 py-0.5 rounded-full bg-accent-coral text-white text-[11px] font-mono font-bold shadow-md -rotate-12">
          v1.0 Release
        </div>
      </div>

      {/* Hint button */}
      <button
        type="button"
        onClick={handleClick}
        className="flex items-center gap-1.5 px-3 py-1 bg-accent-mustard/10 border border-accent-mustard/30 rounded-full cursor-pointer select-none text-[11px] font-mono text-accent-mustard font-bold hover:bg-accent-mustard/20 transition-colors"
      >
        <span>
          {isRight ? "Klik lagi untuk balik kuncir" : "Klik kuncir toga untuk wisuda"}
        </span>
        <GraduationCap className="w-4 h-4 inline ml-1.5" />
      </button>
    </div>
  );
}
