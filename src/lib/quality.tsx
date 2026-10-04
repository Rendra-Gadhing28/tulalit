"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { QualityLevel } from "@/types";

interface QualityContextType {
  quality: QualityLevel;
  isHematMode: boolean;
  isReducedMotion: boolean;
  toggleHematMode: () => void;
  toggleReducedMotion: () => void;
  setQuality: (level: QualityLevel) => void;
  reportFpsBenchmark: (fps: number) => void;
}

const QualityContext = createContext<QualityContextType>({
  quality: "high",
  isHematMode: false,
  isReducedMotion: false,
  toggleHematMode: () => {},
  toggleReducedMotion: () => {},
  setQuality: () => {},
  reportFpsBenchmark: () => {},
});

const STORAGE_KEY_HEMAT = "tulalit_hemat_mode";
const STORAGE_KEY_REDUCED = "tulalit_reduced_motion";
const STORAGE_KEY_QUALITY = "tulalit_quality_level";

export function QualityProvider({ children }: { children: React.ReactNode }) {
  const [quality, setQualityState] = useState<QualityLevel>("medium"); // safe initial state for SSR
  const [isHematMode, setIsHematMode] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Deteksi otomatis hardware & koneksi
  const detectOptimalQuality = useCallback((): QualityLevel => {
    if (typeof window === "undefined") return "medium";

    // 1. Cek prefers-reduced-motion dari OS
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      return "low";
    }

    // 2. Cek koneksi penghemat data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nav = navigator as any;
    if (nav.connection?.saveData) {
      return "low";
    }

    // 3. Cek memori perangkat (RAM)
    const ram = nav.deviceMemory; // dalam GB
    if (typeof ram === "number" && ram < 3) {
      return "low";
    }

    // 4. Cek core CPU
    const cores = nav.hardwareConcurrency;
    if (typeof cores === "number" && cores <= 4) {
      return "medium";
    }

    // 5. Layar kecil dengan RAM pas-pasan
    if (window.innerWidth < 480 && ram && ram <= 4) {
      return "medium";
    }

    return "high";
  }, []);

  // Inisialisasi awal dari localStorage atau deteksi hardware
  useEffect(() => {
    try {
      const savedHemat = localStorage.getItem(STORAGE_KEY_HEMAT);
      const savedReduced = localStorage.getItem(STORAGE_KEY_REDUCED);
      const savedQuality = localStorage.getItem(STORAGE_KEY_QUALITY) as QualityLevel | null;

      const mediaReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const initialReduced = savedReduced !== null ? savedReduced === "true" : mediaReduced;
      const initialHemat = savedHemat === "true";

      setIsHematMode(initialHemat);
      setIsReducedMotion(initialReduced);

      if (initialHemat || initialReduced) {
        setQualityState("low");
      } else if (savedQuality && ["high", "medium", "low"].includes(savedQuality)) {
        setQualityState(savedQuality);
      } else {
        setQualityState(detectOptimalQuality());
      }
    } catch {
      setQualityState("medium");
    } finally {
      setIsInitialized(true);
    }
  }, [detectOptimalQuality]);

  // Listener untuk tab aktif / tidak aktif (jeda rendering canvas)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab tidak aktif: biarkan quality tetap atau pause render lewat frameloop
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const toggleHematMode = useCallback(() => {
    setIsHematMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY_HEMAT, String(next));
      } catch {}
      if (next) {
        setQualityState("low");
      } else {
        const detected = detectOptimalQuality();
        setQualityState(detected);
      }
      return next;
    });
  }, [detectOptimalQuality]);

  const toggleReducedMotion = useCallback(() => {
    setIsReducedMotion((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY_REDUCED, String(next));
      } catch {}
      if (next) {
        setQualityState("low");
      }
      return next;
    });
  }, []);

  const setQuality = useCallback((level: QualityLevel) => {
    setQualityState(level);
    try {
      localStorage.setItem(STORAGE_KEY_QUALITY, level);
    } catch {}
  }, []);

  // Downgrade otomatis jika benchmark FPS awal terlalu rendah (< 35 FPS)
  const reportFpsBenchmark = useCallback(
    (fps: number) => {
      if (isHematMode) return;
      if (fps < 35 && quality !== "low") {
        setQualityState("low");
      } else if (fps < 50 && quality === "high") {
        setQualityState("medium");
      }
    },
    [isHematMode, quality]
  );

  return (
    <QualityContext.Provider
      value={{
        quality: isInitialized ? quality : "medium",
        isHematMode,
        isReducedMotion,
        toggleHematMode,
        toggleReducedMotion,
        setQuality,
        reportFpsBenchmark,
      }}
    >
      {children}
    </QualityContext.Provider>
  );
}

export function useQuality() {
  return useContext(QualityContext);
}
