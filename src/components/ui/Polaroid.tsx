"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { getStableRotation, getStableTapeVariant } from "@/lib/random";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { playSfx } from "@/lib/sound";
import { springPresets } from "@/lib/motion";

interface PolaroidProps {
  id: string;
  src?: string;
  caption: string;
  date?: string;
  category?: string;
  aspect?: "square" | "portrait" | "landscape";
  onClick?: () => void;
  className?: string;
  hasTape?: boolean;
  priority?: boolean;
}

// Derive a stable tape color from id
function getTapeColor(id: string): string {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return (["tape-mustard", "tape-sky", "tape-coral", "tape-sage"] as const)[hash % 4];
}

export function Polaroid({
  id,
  src,
  caption,
  date,
  category = "Memori",
  aspect = "square",
  onClick,
  className = "",
  hasTape = true,
  priority = false,
}: PolaroidProps) {
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const rotation = getStableRotation(id, 3);
  const tapeVariant = getStableTapeVariant(id);
  const tapeColor = getTapeColor(id);

  // 3D Mouse Parallax Tilt Physics (stiffness: 160, damping: 18)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, springPresets.card3DTilt);
  const mouseYSpring = useSpring(y, springPresets.card3DTilt);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Natural tape positions — asymmetric, varied
  const tapeConfigs = {
    "top-left": {
      style: { top: "-11px", left: "12px", width: "56px", transform: "rotate(-8deg)" },
    },
    "top-right": {
      style: { top: "-11px", right: "10px", width: "52px", transform: "rotate(11deg)" },
    },
    "top-center": {
      style: { top: "-12px", left: "50%", width: "64px", transform: "translateX(-50%) rotate(-2deg)" },
    },
  };

  const tapeCfg = tapeConfigs[tapeVariant];

  const handleCardClick = () => {
    playSfx("camera-shutter");
    if (onClick) onClick();
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={handleCardClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCardClick();
              }
            }
          : undefined
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        borderRadius: "1px",
      }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 0 25px rgba(244, 185, 66, 0.25), 0 20px 25px -5px rgba(0, 0, 0, 0.15)",
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.97 }}
      className={`relative group bg-paper-light dark:bg-darkbg-card p-3 pb-6 shadow-polaroid cursor-pointer select-none border border-black/8 dark:border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-coral ${className}`}
    >
      {/* Washi Tape */}
      {hasTape && (
        <div
          aria-hidden="true"
          className={`tape ${tapeColor} absolute z-20 pointer-events-none`}
          style={tapeCfg.style}
        />
      )}

      {/* Photo Frame */}
      <div className="relative overflow-hidden bg-gray-200 dark:bg-darkbg-base" style={{ borderRadius: 0 }}>
        {src && !imgError ? (
          <div
            className={`relative w-full ${
              aspect === "portrait"
                ? "aspect-[3/4]"
                : aspect === "landscape"
                ? "aspect-[4/3]"
                : "aspect-square"
            }`}
          >
            <Image
              src={src}
              alt={caption}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <ImagePlaceholder label={caption} category={category} aspect={aspect} />
        )}

        {/* Photo development vignette */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30 group-hover:opacity-10 transition-opacity"
          style={{
            background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.35) 100%)",
          }}
        />
      </div>

      {/* Caption Area — the polaroid white strip */}
      <div className="mt-2 px-1 text-center">
        <p className="font-hand text-lg md:text-xl text-ink-navy dark:text-white leading-snug line-clamp-2">
          {caption}
        </p>
        {date && (
          <span className="block font-mono text-[10px] text-ink-muted dark:text-slate-400 mt-1">
            {date}
          </span>
        )}
      </div>
    </motion.div>
  );
}
