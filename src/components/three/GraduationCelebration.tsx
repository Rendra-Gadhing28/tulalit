"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { useQuality } from "@/lib/quality";

interface GraduationCelebrationProps {
  active: boolean;
  infinite?: boolean;
  onComplete?: () => void;
}

const CONFETTI_COLORS = [
  "#F4B942",
  "#FF6B6B",
  "#9DC08B",
  "#7DD3FC",
  "#FDE047",
  "#EC4899",
  "#FFFFFF",
];

export function GraduationCelebration({
  active,
  infinite = false,
  onComplete,
}: GraduationCelebrationProps) {
  const { isReducedMotion, isHematMode } = useQuality();

  useEffect(() => {
    if (!active || isReducedMotion || isHematMode) return;

    // Single celebratory burst from top
    confetti({
      particleCount: 40,
      angle: 270,
      spread: 120,
      origin: { x: 0.5, y: -0.05 },
      startVelocity: 12,
      gravity: 0.7,
      ticks: 200,
      colors: CONFETTI_COLORS,
      shapes: ["square"],
      scalar: 1.1,
      disableForReducedMotion: true,
    });

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [active, onComplete, isReducedMotion, isHematMode]);

  return null;
}
