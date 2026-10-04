"use client";

import React from "react";
import { motion } from "framer-motion";
import { getStableRotation } from "@/lib/random";
import { playSfx } from "@/lib/sound";

interface StickyNoteProps {
  id: string;
  color?: "mustard" | "coral" | "sage" | "sky";
  children: React.ReactNode;
  className?: string;
  hasPin?: boolean;
  onClick?: () => void;
}

// Stable pushpin color derived from id string — avoids all-red monotony
function getPinColor(id: string): string {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const colors = [
    "bg-red-500 shadow-red-700/50",
    "bg-blue-500 shadow-blue-700/50",
    "bg-emerald-500 shadow-emerald-700/50",
    "bg-orange-500 shadow-orange-700/50",
    "bg-violet-500 shadow-violet-700/50",
    "bg-pink-500 shadow-pink-700/50",
  ];
  return colors[hash % colors.length];
}

export function StickyNote({
  id,
  color = "mustard",
  children,
  className = "",
  hasPin = true,
  onClick,
}: StickyNoteProps) {
  const rotation = getStableRotation(id, 2.5);
  const pinColor = getPinColor(id);

  const colorStyles = {
    mustard: "bg-[#FEF9C3] dark:bg-[#854D0E]/40 text-[#713F12] dark:text-[#FEF08A] border-[#FDE047]/60",
    coral:   "bg-[#FFE4E6] dark:bg-[#9F1239]/40 text-[#881337] dark:text-[#FECDD3] border-[#FDA4AF]/60",
    sage:    "bg-[#DCFCE7] dark:bg-[#166534]/40 text-[#14532D] dark:text-[#BBF7D0] border-[#86EFAC]/60",
    sky:     "bg-[#E0F2FE] dark:bg-[#075985]/40 text-[#0C4A6E] dark:text-[#BAE6FD] border-[#7DD3FC]/60",
  };

  // Subtle inner texture: a narrow top strip (the fold-back "sticky" adhesive area)
  const foldColors = {
    mustard: "bg-amber-200/60 dark:bg-amber-700/30",
    coral:   "bg-rose-200/60 dark:bg-rose-700/30",
    sage:    "bg-emerald-200/60 dark:bg-emerald-700/30",
    sky:     "bg-sky-200/60 dark:bg-sky-700/30",
  };

  const handleClick = () => {
    playSfx("paper-slide");
    if (onClick) onClick();
  };

  return (
    <motion.div
      onClick={handleClick}
      animate={{
        rotate: [rotation, rotation + 1.8, rotation - 1.8, rotation],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      whileHover={{
        scale: 1.025,
        rotate: 0,
        boxShadow: "0 15px 30px -5px rgba(0,0,0,0.15)",
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
      className={`relative p-5 pt-8 rounded-sm shadow-sticky border transition-all duration-300 cursor-pointer ${colorStyles[color]} ${className}`}
    >
      {/* Adhesive fold strip at top */}
      <div
        aria-hidden="true"
        className={`absolute top-0 left-0 right-0 h-5 rounded-t-sm ${foldColors[color]} border-b border-black/8 pointer-events-none`}
      />

      {/* Pushpin */}
      {hasPin && (
        <div
          aria-hidden="true"
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex flex-col items-center"
        >
          {/* Pin head */}
          <div
            className={`w-5 h-5 rounded-full ${pinColor} shadow-md border border-white/40 relative flex items-center justify-center`}
          >
            {/* Highlight glint */}
            <div className="w-1.5 h-1.5 rounded-full bg-white/70 absolute top-0.5 left-1" />
          </div>
          {/* Pin shaft */}
          <div className="w-[2px] h-2.5 bg-gray-400/80 rounded-full" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Lifted corner curl */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-10 h-10 pointer-events-none overflow-hidden"
        style={{ borderRadius: "0 0 2px 0" }}
      >
        <div
          className="absolute bottom-0 right-0 w-0 h-0"
          style={{
            borderStyle: "solid",
            borderWidth: "0 0 10px 10px",
            borderColor: "transparent transparent rgba(0,0,0,0.12) transparent",
          }}
        />
      </div>
    </motion.div>
  );
}
