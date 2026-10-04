"use client";

import React from "react";
import { motion } from "framer-motion";
import { stickersRegistry } from "@/data/stickers";
import { playSfx } from "@/lib/sound";

interface StickerProps {
  id: string;
  className?: string;
  size?: number | string;
  rotation?: number;
  decorative?: boolean;
  onClick?: () => void;
}

export function Sticker({
  id,
  className = "",
  size = 64,
  rotation = 0,
  decorative = false,
  onClick,
}: StickerProps) {
  const sticker = stickersRegistry.find((s) => s.id === id);

  if (!sticker) {
    return null;
  }

  const dimension = typeof size === "number" ? `${size}px` : size;
  const isInteractive = !decorative && Boolean(onClick);

  const handleClick = () => {
    if (decorative) return;
    playSfx("pop");
    onClick?.();
  };

  return (
    <motion.div
      onClick={handleClick}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick();
              }
            }
          : undefined
      }
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-hidden={decorative ? "true" : undefined}
      style={{
        width: dimension,
        height: dimension,
      }}
      initial={{ rotate: rotation }}
      whileHover={
        decorative
          ? undefined
          : {
              scale: 1.12,
              rotate: rotation + 5,
              transition: { duration: 0.2 },
            }
      }
      whileTap={
        decorative
          ? undefined
          : {
              scale: 0.92,
              rotate: rotation - 5,
            }
      }
      className={`relative inline-block select-none filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)] ${
        decorative
          ? "pointer-events-none"
          : "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-coral rounded-md"
      } ${className}`}
      title={sticker.name}
    >
      {sticker.render()}
    </motion.div>
  );
}
