"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { X, Gamepad2 } from "lucide-react";

interface KonamiOverlayProps {
  active: boolean;
  onClose: () => void;
}

export function KonamiOverlay({ active, onClose }: KonamiOverlayProps) {
  useEffect(() => {
    if (active) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        shapes: ["square"],
      });
    }
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-pixel select-none">
      {/* Scanline CRT overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]"
      />

      <div className="relative max-w-lg w-full bg-[#111827] border-4 border-emerald-400 p-6 rounded-none shadow-[0_0_50px_rgba(52,211,153,0.5)] text-center text-emerald-400">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-emerald-400 hover:text-white p-1"
          aria-label="Tutup mode 8-bit"
        >
          <X className="w-5 h-5" />
        </button>

        <Gamepad2 className="w-12 h-12 mx-auto mb-4 text-amber-400 animate-pulse" />

        <h3 className="text-sm md:text-base leading-relaxed tracking-wider mb-2 text-white">
          ★ KONAMI CODE UNLOCKED ★
        </h3>

        <p className="text-[11px] md:text-xs text-emerald-300 leading-loose mb-6">
          CHEAT KELULUSAN AKTIF: RESTU GURU +9999, BUG RESISTANCE MAX!
        </p>

        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-[10px] text-amber-300 mb-6 font-mono">
          &gt; git commit -m &quot;lulus_dengan_bantuan_cheat_code&quot;
          <br />
          &gt; STATUS: OK (XII PPLG 3 COMPLETED)
        </div>

        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-ink-navy font-bold text-xs uppercase tracking-widest border-2 border-white shadow-md active:translate-y-0.5"
        >
          [ MATIKAN CHEAT ]
        </button>
      </div>
    </div>
  );
}
