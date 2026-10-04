"use client";

import { useEffect, useState, useCallback } from "react";
import { playSfx } from "@/lib/sound";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function useKonami() {
  const [isKonamiActive, setIsKonamiActive] = useState<boolean>(false);
  const [keys, setKeys] = useState<string[]>([]);

  const deactivate = useCallback(() => {
    setIsKonamiActive(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Abaikan jika fokus di input / textarea form
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

      setKeys((prevKeys) => {
        const updated = [...prevKeys, key].slice(-KONAMI_CODE.length);
        const match = KONAMI_CODE.every(
          (codeKey, idx) =>
            updated[idx] &&
            updated[idx].toLowerCase() === codeKey.toLowerCase()
        );

        if (match) {
          setIsKonamiActive(true);
          playSfx("konami");
          return [];
        }
        return updated;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { isKonamiActive, deactivate };
}
