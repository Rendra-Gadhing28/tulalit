"use client";

import React, { useState } from "react";
import { playSfx } from "@/lib/sound";

const FUNNY_DOT_MESSAGES = [
  "⚠️ Error 418: Saya teko kopi, bukan compiler!",
  "🛑 segmentation fault (core dumped): Kebanyakan mikirin mantan.",
  "✨ Warning: Tingkat ketampanan developer melebihi batas CSS.",
  "🐛 Bug #404: Semangat koding tidak ditemukan. Silakan isi ulang kopi.",
  "🚀 Success: Berhasil pura-pura sibuk ngetik pas guru lewat!",
];

interface TerminalWindowProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function TerminalWindow({
  title = "bash - sogadev@tulalit: ~",
  children,
  className = "",
}: TerminalWindowProps) {
  const [dotNotice, setDotNotice] = useState<string | null>(null);

  const handleDotClick = () => {
    playSfx("click");
    const msg =
      FUNNY_DOT_MESSAGES[Math.floor(Math.random() * FUNNY_DOT_MESSAGES.length)];
    setDotNotice(msg);
    setTimeout(() => setDotNotice(null), 3500);
  };

  return (
    <div
      className={`rounded-lg overflow-hidden border-2 border-darkbg-border shadow-2xl bg-darkbg-base text-slate-100 font-mono text-sm ${className}`}
    >
      {/* Title Bar */}
      <div className="bg-darkbg-card px-4 py-2.5 flex items-center justify-between select-none border-b border-white/5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDotClick}
            aria-label="Tutup jendela terminal"
            className="w-3 h-3 rounded-full bg-[#EF4444] hover:opacity-80 transition-opacity focus:outline-none"
            title="Klik aku!"
          />
          <button
            type="button"
            onClick={handleDotClick}
            aria-label="Minimalkan jendela terminal"
            className="w-3 h-3 rounded-full bg-[#F59E0B] hover:opacity-80 transition-opacity focus:outline-none"
            title="Klik aku!"
          />
          <button
            type="button"
            onClick={handleDotClick}
            aria-label="Perbesar jendela terminal"
            className="w-3 h-3 rounded-full bg-[#10B981] hover:opacity-80 transition-opacity focus:outline-none"
            title="Klik aku!"
          />
        </div>

        <span className="text-xs text-slate-400 font-medium truncate max-w-[200px] md:max-w-md">
          {title}
        </span>

        <span className="text-[10px] text-accent-terminal font-bold px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">
          zsh
        </span>
      </div>

      {/* Floating Dot Notification Easter Egg */}
      {dotNotice && (
        <div className="bg-amber-400 text-ink-navy px-3 py-1.5 text-xs font-bold text-center border-b border-amber-500 animate-fade-in">
          {dotNotice}
        </div>
      )}

      {/* Terminal Content Body */}
      <div className="p-4 md:p-6 overflow-x-auto">{children}</div>
    </div>
  );
}
