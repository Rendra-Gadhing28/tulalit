"use client";

import React from "react";
import type { Achievement } from "@/types";
import { Trophy } from "lucide-react";

interface AchievementToastProps {
  achievement: Achievement | null;
}

export function AchievementToast({ achievement }: AchievementToastProps) {
  if (!achievement) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 right-4 z-50 max-w-sm w-full bg-darkbg-card text-white p-3.5 rounded-xl border-2 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center gap-3 animate-float-slow select-none"
    >
      <div className="w-12 h-12 rounded-lg bg-amber-500/20 border border-amber-400 flex items-center justify-center text-2xl shrink-0">
        {achievement.icon || "🏆"}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
          <Trophy className="w-3 h-3 text-amber-400" />
          <span>PENCAPAIAN TERBUKA!</span>
        </div>
        <h4 className="font-sans font-bold text-sm text-white truncate">
          {achievement.title}
        </h4>
        <p className="font-sans text-[11px] text-gray-300 line-clamp-1">
          {achievement.description}
        </p>
      </div>
    </div>
  );
}
