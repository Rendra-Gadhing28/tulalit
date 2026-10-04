import React from "react";

interface ScrapbookSlotProps {
  id: string;
  className?: string;
  children?: React.ReactNode;
  hint?: string;
}

/**
 * ScrapbookSlot menyediakan titik alokasi ruang kosong (breathing space)
 * khusus untuk komponen dan dekorasi kustom buatanmu.
 */
export function ScrapbookSlot({
  id,
  className = "",
  children,
  hint,
}: ScrapbookSlotProps) {
  return (
    <div
      data-slot={id}
      className={`relative my-4 p-2 transition-all ${className}`}
    >
      {children}
      {hint && !children && (
        <div
          aria-hidden="true"
          className="border-2 border-dashed border-ink-navy/10 dark:border-white/10 rounded-lg p-3 text-center pointer-events-none select-none"
        >
          <span className="font-mono text-[10px] text-ink-muted/50 dark:text-gray-500">
            [Slot Komponen Kamu: {id}]
          </span>
        </div>
      )}
    </div>
  );
}
