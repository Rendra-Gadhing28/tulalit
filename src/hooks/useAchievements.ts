"use client";

import { useState, useEffect, useCallback } from "react";
import { initialAchievements } from "@/data/achievements";
import type { Achievement } from "@/types";
import { playSfx } from "@/lib/sound";

const STORAGE_ACHIEVEMENTS_KEY = "tulalit_unlocked_achievements";

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [unlockedIds, setUnlockedIds] = useState<Record<string, string>>({});
  const [latestToast, setLatestToast] = useState<Achievement | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_ACHIEVEMENTS_KEY);
      const parsed: Record<string, string> = stored ? JSON.parse(stored) : {};
      // Auto unlock 'first_visit' on first load
      if (!parsed["first_visit"]) {
        parsed["first_visit"] = new Date().toISOString();
        localStorage.setItem(STORAGE_ACHIEVEMENTS_KEY, JSON.stringify(parsed));
      }
      setUnlockedIds(parsed);
    } catch {}
  }, []);

  const unlock = useCallback((id: string) => {
    setUnlockedIds((prev) => {
      if (prev[id]) return prev; // Already unlocked

      const updated = { ...prev, [id]: new Date().toISOString() };
      try {
        localStorage.setItem(STORAGE_ACHIEVEMENTS_KEY, JSON.stringify(updated));
      } catch {}

      const found = initialAchievements.find((a) => a.id === id);
      if (found) {
        setLatestToast(found);
        playSfx("konami");
        setTimeout(() => setLatestToast(null), 4000);
      }

      // Check completionist (12 non-completionist unlocked)
      const nonCompletionist = initialAchievements.filter((a) => a.id !== "completionist");
      const allUnlocked = nonCompletionist.every((a) => updated[a.id]);

      if (allUnlocked && !updated["completionist"]) {
        setTimeout(() => {
          unlock("completionist");
        }, 1500);
      }

      return updated;
    });
  }, []);

  // Update achievements list with unlock timestamps
  const achievementList = achievements.map((a) => ({
    ...a,
    unlockedAt: unlockedIds[a.id],
  }));

  const unlockedCount = Object.keys(unlockedIds).length;
  const totalCount = initialAchievements.length;

  return {
    achievements: achievementList,
    unlockedCount,
    totalCount,
    latestToast,
    unlock,
    isUnlocked: (id: string) => Boolean(unlockedIds[id]),
  };
}
