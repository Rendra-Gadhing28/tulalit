"use client";

import React, { useEffect, useState } from "react";
import { Sticker } from "@/components/ui/Sticker";

interface SnailEasterEggProps {
  active: boolean;
  onFinished: () => void;
}

export function SnailEasterEgg({ active, onFinished }: SnailEasterEggProps) {
  const [positionX, setPositionX] = useState<number>(-120);

  useEffect(() => {
    if (!active) {
      setPositionX(-120);
      return;
    }

    let current = -120;
    const interval = setInterval(() => {
      current += 2;
      setPositionX(current);
      if (current > (typeof window !== "undefined" ? window.innerWidth + 120 : 1200)) {
        clearInterval(interval);
        onFinished();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [active, onFinished]);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      style={{ left: `${positionX}px` }}
      className="fixed bottom-12 z-50 pointer-events-none flex items-end gap-2 transition-all duration-75 select-none"
    >
      {/* Speech Bubble */}
      <div className="bg-white dark:bg-darkbg-card text-ink-navy dark:text-white px-3 py-1.5 rounded-xl rounded-bl-none border-2 border-paper-lines dark:border-darkbg-border shadow-lg font-hand text-base mb-10 whitespace-nowrap">
        🐌 Sabar rek... lagi kompilasi... (Tulalit)
      </div>

      {/* Snail Sticker */}
      <div className="w-20 h-20 -scale-x-100">
        <Sticker id="ekspresi-siput" size={80} decorative />
      </div>
    </div>
  );
}
