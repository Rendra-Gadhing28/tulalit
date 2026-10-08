"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import type { Member } from "@/types";
import { Sticker } from "./Sticker";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { playSfx } from "@/lib/sound";
import { Download, RotateCw, Box, Instagram, Linkedin, Github, User } from "lucide-react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";

interface PhotoCardProps {
  member: Member;
  onOpen3D?: (member: Member) => void;
}

const DEFAULT_PHOTO_POSITIONS: Record<string, string> = {
  "mem-001": "50% 38%",
  "mem-002": "68% 58%",
  "mem-003": "52% 46%",
  "mem-004": "50% 40%",
  "mem-005": "48% 44%",
  "mem-006": "50% 28%",
  "mem-007": "62% 32%",
  "mem-008": "50% 30%",
};

export function PhotoCard({ member, onOpen3D }: PhotoCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isHolo = member.rarity === "Epic" || member.rarity === "Legendary";

  // 3D tilt tracking
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-60, 60], [10, -10]), {
    stiffness: 160,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [-60, 60], [-10, 10]), {
    stiffness: 160,
    damping: 18,
  });

  // Holographic sheen: follow mouse
  const sheenX = useTransform(mx, [-60, 60], ["0%", "100%"]);
  const sheenY = useTransform(my, [-60, 60], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isFlipped) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const rarityBadgeStyles = {
    Common: "bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-700 dark:text-slate-200",
    Rare: "bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-900/60 dark:text-sky-200",
    Epic: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/60 dark:text-purple-200 animate-pulse",
    Legendary: "bg-amber-100 text-amber-900 border-amber-400 dark:bg-amber-900/60 dark:text-amber-200 shadow-sm",
  };

  const handleFlip = () => {
    playSfx("paper");
    setIsFlipped((prev) => !prev);
    try {
      const stored = localStorage.getItem("tulalit_unlocked_achievements");
      const parsed = stored ? JSON.parse(stored) : {};
      if (!parsed["card_collector"]) {
        parsed["card_collector"] = new Date().toISOString();
        localStorage.setItem("tulalit_unlocked_achievements", JSON.stringify(parsed));
      }
    } catch {}
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!cardRef.current || isDownloading) return;

    try {
      setIsDownloading(true);
      playSfx("click");
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `kartu-${member.nickname.toLowerCase()}-xiipplg3.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Gagal mendownload kartu:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpen3D = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSfx("click");
    if (onOpen3D) onOpen3D(member);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Trading Card Container with 3D tilt */}
      <motion.div
        ref={cardRef}
        style={{
          rotateX: isFlipped ? 0 : rotateX,
          rotateY: isFlipped ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleFlip}
        whileTap={{ scale: 0.97 }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
        className="relative w-full max-w-[320px] aspect-[1/1.55] cursor-pointer select-none"
      >
        {/* ================= SISI DEPAN (FRONT) ================= */}
        <div
          className={`absolute inset-0 w-full h-full p-4 bg-paper-light dark:bg-darkbg-card border-2 ${
            member.rarity === "Legendary"
              ? "border-amber-400"
              : member.rarity === "Epic"
              ? "border-purple-400"
              : "border-paper-lines dark:border-darkbg-border"
          } shadow-polaroid [backface-visibility:hidden] flex flex-col justify-between overflow-hidden`}
        >
          {/* Holographic Shimmer */}
          {isHolo && (
            <>
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none opacity-50 holo-sheen"
              />
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none rounded-[inherit] opacity-0 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at ${sheenX} ${sheenY}, rgba(255,255,255,0.22) 0%, transparent 70%)`,
                  opacity: 0.6,
                }}
              />
            </>
          )}

          {/* Header Card */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="font-hand text-xl font-bold text-ink-navy dark:text-white">
              #{member.id.replace("mem-", "")} {member.nickname}
            </span>
            <span
              className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${rarityBadgeStyles[member.rarity]}`}
            >
              {member.rarity}
            </span>
          </div>

          {/* Foto Anggota */}
          <div className="relative z-10 my-2 w-full aspect-[4/3] overflow-hidden border border-paper-lines/60 dark:border-white/10 bg-gray-100 dark:bg-darkbg-base shadow-inner">
            {member.photo && !imgError ? (
              <Image
                src={member.photo}
                alt={member.name}
                fill
                sizes="300px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                style={{
                  objectPosition:
                    member.photoPosition || DEFAULT_PHOTO_POSITIONS[member.id] || "center",
                }}
                onError={() => setImgError(true)}
              />
            ) : (
              <ImagePlaceholder
                label={member.name}
                category={member.role}
                aspect="landscape"
              />
            )}
          </div>

          {/* Detail */}
          <div className="relative z-10">
            <h3 className="font-sans font-bold text-base text-ink-navy dark:text-white line-clamp-1">
              {member.name}
            </h3>
            <p className="font-mono text-xs font-semibold text-accent-coral dark:text-accent-mustard min-h-[1.25rem]">
              {member.role?.trim() || "\u00A0"}
            </p>

            {/* Quote Bubble */}
            <div
              className="mt-2 p-2 bg-paper-base dark:bg-darkbg-base border border-paper-lines dark:border-darkbg-border"
              style={{ borderRadius: "2px" }}
            >
              <p className="font-hand text-sm text-ink-brown dark:text-gray-300 italic line-clamp-2">
                &ldquo;{member.quote}&rdquo;
              </p>
            </div>
          </div>

          {/* Sticker row with micro-bounce */}
          <div className="relative z-10 pt-2 border-t border-paper-lines dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {member.stickers.map((stkId, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -4, 0], rotate: [0, i % 2 === 0 ? 6 : -6, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.8 + i * 0.3,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                >
                  <Sticker id={stkId} size={26} decorative />
                </motion.div>
              ))}
            </div>
            <span className="text-[10px] font-mono text-ink-muted flex items-center gap-0.5">
              <RotateCw className="w-3 h-3" /> Balik kartu
            </span>
          </div>
        </div>

        {/* ================= SISI BELAKANG (BACK) ================= */}
        <div
          className={`absolute inset-0 w-full h-full p-5 bg-paper-light dark:bg-darkbg-card border-2 border-dashed ${
            member.rarity === "Legendary"
              ? "border-amber-400"
              : member.rarity === "Epic"
              ? "border-purple-400"
              : "border-paper-lines dark:border-darkbg-border"
          } shadow-polaroid [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col justify-between overflow-hidden`}
        >
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-paper-lines dark:border-white/10">
              <span className="font-mono text-xs font-bold text-ink-muted uppercase">
                Profil Siswa
              </span>
              <span className="font-pixel text-[9px] text-accent-coral">
                LVL 12
              </span>
            </div>

            <div className="mt-4 space-y-3 font-sans text-xs">
              <div>
                <span className="block text-ink-muted dark:text-gray-400 text-[11px] font-semibold">
                  Keahlian & Hobi:
                </span>
                <span className="font-mono font-bold text-emerald-800 dark:text-accent-terminal bg-emerald-100 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20 inline-block mt-0.5">
                  {member.favoriteLang}
                </span>
              </div>

              <div>
                <span className="block text-ink-muted dark:text-gray-400 text-[11px] font-semibold">
                  Kebiasaan / Hobby:
                </span>
                <p className="font-medium text-ink-navy dark:text-gray-200 mt-0.5">
                  {member.hobby}
                </p>
              </div>

              <div>
                <span className="block text-ink-muted dark:text-gray-400 text-[11px] font-semibold">
                  Nama Lengkap:
                </span>
                <p className="font-semibold text-ink-navy dark:text-white mt-0.5">
                  {member.name}
                </p>
              </div>
            </div>
          </div>

          {/* Social Links & Footer */}
          <div>
            {member.social && (
              <div className="flex items-center gap-2 pt-3 border-t border-paper-lines dark:border-white/10">
                {member.social.instagram && (
                  <a
                    href={member.social.instagram}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-100 dark:bg-pink-950 text-pink-600 hover:scale-110 transition-transform"
                    title="Instagram"
                    aria-label={`Instagram ${member.name}`}
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {member.social.github && (
                  <a
                    href={member.social.github}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:scale-110 transition-transform"
                    title="GitHub"
                    aria-label={`GitHub ${member.name}`}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {member.social.linkedin && (
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 hover:scale-110 transition-transform"
                    title="LinkedIn"
                    aria-label={`LinkedIn ${member.name}`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
            <span className="block text-[10px] text-center font-hand text-ink-muted mt-2">
              Klik untuk membalik kembali
            </span>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons Below Card */}
      <div className="flex items-center gap-1.5 sm:gap-2 mt-3">
        <Link
          href={`/anggota/${member.id}`}
          onClick={(e) => {
            e.stopPropagation();
            playSfx("click");
          }}
          className="flex items-center gap-1 min-h-[38px] px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-paper-base dark:bg-darkbg-card border border-paper-lines dark:border-darkbg-border hover:bg-white dark:hover:bg-darkbg-subtle text-ink-navy dark:text-white shadow-xs transition-colors"
          title="Buka Halaman Profil Penuh"
        >
          <User className="w-3.5 h-3.5 text-amber-500" />
          <span>Profil</span>
        </Link>

        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-1 min-h-[38px] px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-paper-base dark:bg-darkbg-card border border-paper-lines dark:border-darkbg-border hover:bg-white dark:hover:bg-darkbg-subtle text-ink-navy dark:text-white shadow-xs transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          {isDownloading ? "..." : "PNG"}
        </button>

        {isHolo && onOpen3D && (
          <button
            type="button"
            onClick={handleOpen3D}
            className="flex items-center gap-1 min-h-[38px] px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-ink-navy dark:bg-accent-mustard text-accent-mustard dark:text-ink-navy border border-accent-mustard/40 hover:opacity-90 shadow-xs transition-all"
          >
            <Box className="w-3.5 h-3.5" />
            3D
          </button>
        )}
      </div>
    </div>
  );
}
