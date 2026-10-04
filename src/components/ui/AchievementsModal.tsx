"use client";

import React, { useEffect } from "react";
import type { Achievement } from "@/types";
import { X, Trophy, CheckCircle, Lock } from "lucide-react";
import { playSfx } from "@/lib/sound";

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  unlockedCount: number;
  totalCount: number;
}

export function AchievementsModal({
  isOpen,
  onClose,
  achievements,
  unlockedCount,
  totalCount,
}: AchievementsModalProps) {
  if (!isOpen) return null;

  const percent = Math.round((unlockedCount / totalCount) * 100);

  const handleClose = () => {
    playSfx("click");
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="achievements-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-2xl bg-paper-light dark:bg-darkbg-card rounded-2xl border-4 border-paper-lines dark:border-darkbg-border shadow-2xl p-6 md:p-8 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-paper-lines dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400 text-ink-navy shadow-sm">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 id="achievements-modal-title" className="font-hand text-2xl md:text-3xl font-bold text-ink-navy dark:text-white">
                Pencapaian & Trofi Kelas
              </h3>
              <p className="font-mono text-xs text-ink-muted">
                Buka seluruh easter egg dan fitur untuk gelar Completionist!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-full bg-paper-base dark:bg-darkbg-base text-ink-navy dark:text-white border border-paper-lines hover:scale-105 transition-transform"
            aria-label="Tutup jendela trofi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="my-4 p-4 rounded-xl bg-paper-base dark:bg-darkbg-base border border-paper-lines dark:border-white/10">
          <div className="flex items-center justify-between font-mono text-xs font-bold mb-1.5">
            <span className="text-ink-navy dark:text-white">
              Progres: {unlockedCount} dari {totalCount} Trofi
            </span>
            <span className="text-amber-600 dark:text-amber-400">{percent}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-paper-lines dark:bg-darkbg-card overflow-hidden">
            <div
              style={{ width: `${percent}%` }}
              className="h-full bg-gradient-to-r from-amber-400 to-accent-coral rounded-full transition-all duration-500"
            />
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {achievements.map((ach) => {
            const isUnlocked = Boolean(ach.unlockedAt);

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-xl border flex items-center gap-3.5 transition-all ${
                  isUnlocked
                    ? "bg-white dark:bg-darkbg-card border-amber-400/80 shadow-xs"
                    : "bg-paper-base/50 dark:bg-darkbg-base/40 border-paper-lines/60 dark:border-white/5 opacity-60"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                    isUnlocked
                      ? "bg-amber-100 dark:bg-amber-950/60 border border-amber-300"
                      : "bg-gray-200 dark:bg-gray-800 text-gray-400"
                  }`}
                >
                  {isUnlocked ? ach.icon : <Lock className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-sans font-bold text-sm text-ink-navy dark:text-white truncate">
                      {ach.title}
                    </h4>
                    {isUnlocked && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-300">
                        <CheckCircle className="w-3 h-3" /> Terbuka
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-xs text-ink-muted dark:text-gray-300 line-clamp-2 mt-0.5">
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Secret Completionist Message */}
        {unlockedCount >= totalCount && (
          <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-ink-navy font-bold font-hand text-lg text-center shadow-lg animate-pulse">
            👑 SELAMAT! Kamu telah membuka seluruh rahasia XII PPLG 3. Kamu legenda sejati!
          </div>
        )}
      </div>
    </div>
  );
}
