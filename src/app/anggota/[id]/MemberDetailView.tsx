"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import type { Member } from "@/types";
import { PhotoCard } from "@/components/ui/PhotoCard";
import { Sticker } from "@/components/ui/Sticker";
import { playSfx } from "@/lib/sound";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Share2,
  Copy,
  Download,
  Check,
  Sparkles,
  ExternalLink,
  Lightbulb,
} from "lucide-react";

// Lazy load 3D modal
const HolographicCardModal = dynamic(
  () =>
    import("@/components/three/HolographicCardModal").then(
      (m) => m.HolographicCardModal
    ),
  { ssr: false }
);

interface Props {
  member: Member;
}

export function MemberDetailView({ member }: Props) {
  const [copied, setCopied] = useState(false);
  const [isDownloadingStory, setIsDownloadingStory] = useState(false);
  const [is3DOpen, setIs3DOpen] = useState(false);
  const storyRef = useRef<HTMLDivElement>(null);

  const handleCopyLink = () => {
    playSfx("pop");
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadStory = async () => {
    if (!storyRef.current || isDownloadingStory) return;
    try {
      setIsDownloadingStory(true);
      playSfx("click");
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(storyRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });

      // If Web Share API supports files, offer share, else download
      if (navigator.share) {
        try {
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], `${member.nickname}-story.png`, {
            type: "image/png",
          });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: `Kartu Kelulusan ${member.name}`,
              text: `Cek kartu kenangan ${member.name} dari XII PPLG 3!`,
            });
            setIsDownloadingStory(false);
            return;
          }
        } catch {
          // fallback to standard download
        }
      }

      const a = document.createElement("a");
      a.download = `story-${member.nickname.toLowerCase()}-xiipplg3.png`;
      a.href = dataUrl;
      a.click();
    } catch (err) {
      console.error("Gagal membuat story:", err);
    } finally {
      setIsDownloadingStory(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper-base dark:bg-darkbg-base py-12 px-4 md:px-8 select-none">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/#members"
            onClick={() => playSfx("click")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-paper-light dark:bg-darkbg-card text-ink-navy dark:text-white border border-paper-lines hover:bg-paper-dark transition-all text-xs font-mono font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Grid Anggota</span>
          </Link>

          <span className="font-mono text-xs text-ink-muted">
            ID: {member.id}
          </span>
        </div>

        {/* Hero Profile Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left: Interactive 3D Card / Flip Card */}
          <div className="md:col-span-6 flex flex-col items-center">
            <PhotoCard
              member={member}
              onOpen3D={() => setIs3DOpen(true)}
            />
            <p className="mt-3 font-mono text-[11px] text-ink-muted text-center flex items-center justify-center">
              <Lightbulb className="w-4 h-4 mr-1.5 inline text-amber-400 shrink-0" />
              <span>Tap kartu untuk membalik, atau klik tombol 3D untuk memutar di ruang 3D.</span>
            </p>
          </div>

          {/* Right: Detailed Scrapbook Bio */}
          <div className="md:col-span-6 space-y-5">
            <div className="bg-paper-light dark:bg-darkbg-card p-6 md:p-8 rounded-3xl border-4 border-paper-lines dark:border-darkbg-border shadow-scrapbook relative">
              {/* Washi Tape */}
              <div
                aria-hidden="true"
                className="absolute -top-3.5 left-8 w-28 h-6 bg-accent-mustard/60 backdrop-blur-xs border-y border-accent-mustard/40 -rotate-2"
              />

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-ink-navy font-mono text-[10px] font-bold uppercase tracking-wider">
                  {member.rarity}
                </span>
                <span className="text-xs font-mono text-ink-muted">
                  • {member.role}
                </span>
              </div>

              <h1 className="font-hand text-4xl md:text-5xl font-bold text-ink-navy dark:text-white leading-tight">
                {member.name}
              </h1>
              <div className="font-mono text-sm text-accent-coral font-bold mt-0.5">
                alias &quot;{member.nickname}&quot;
              </div>

              {/* Quote */}
              <div className="my-5 p-4 rounded-xl bg-paper-base dark:bg-darkbg-base border border-paper-lines dark:border-darkbg-border italic font-sans text-sm md:text-base text-ink-navy dark:text-gray-200 shadow-xs">
                &ldquo;{member.quote}&rdquo;
              </div>

              {/* Technical Bio */}
              <div className="space-y-2 text-xs font-sans">
                <div className="flex items-center justify-between py-1.5 border-b border-paper-lines dark:border-white/10">
                  <span className="text-ink-muted">Bahasa / Tech Favorit:</span>
                  <span className="font-mono font-bold text-ink-navy dark:text-white">
                    {member.favoriteLang}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-paper-lines dark:border-white/10">
                  <span className="text-ink-muted">Hobi & Aktivitas:</span>
                  <span className="font-sans font-medium text-ink-navy dark:text-white text-right max-w-[200px] truncate">
                    {member.hobby}
                  </span>
                </div>
                {member.social?.instagram && (
                  <div className="flex items-center justify-between py-1.5 border-b border-paper-lines dark:border-white/10">
                    <span className="text-ink-muted">Instagram:</span>
                    <a
                      href={member.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-accent-sky font-bold flex items-center gap-1 hover:underline"
                    >
                      <span>Profil IG</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadStory}
                  disabled={isDownloadingStory}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-accent-coral hover:bg-rose-500 text-white font-bold font-sans text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {isDownloadingStory ? "Memproses..." : "Bagikan ke Story (1080x1920)"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="py-2.5 px-4 rounded-xl bg-paper-base dark:bg-darkbg-base border border-paper-lines text-ink-navy dark:text-white font-mono text-xs flex items-center gap-2 hover:bg-paper-dark transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Container for 1080x1920 Story Export */}
        <div className="fixed -left-[9999px] top-0 pointer-events-none" aria-hidden="true">
          <div
            ref={storyRef}
            style={{ width: "1080px", height: "1920px" }}
            className="bg-[#0F172A] text-white p-16 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 text-amber-400 font-mono text-2xl font-bold uppercase tracking-widest">
                <Sparkles className="w-8 h-8" />
                <span>XII PPLG 3 • SOGADEV × TULALIT</span>
              </div>
              <div className="text-gray-400 font-mono text-xl mt-2">
                ANGKATAN 2025 - 2027
              </div>
            </div>

            {/* Center: Big Polaroid Card */}
            <div className="bg-[#FFFDF9] text-ink-navy p-10 rounded-2xl shadow-2xl max-w-2xl mx-auto border-8 border-white/20 transform -rotate-1 text-center">
              <div className="w-[600px] h-[600px] bg-slate-900 rounded-xl mx-auto flex items-center justify-center text-8xl font-bold text-amber-400">
                {member.nickname[0]}
              </div>
              <h2 className="font-hand text-7xl font-bold mt-8 text-ink-navy">
                {member.name}
              </h2>
              <div className="font-mono text-2xl font-bold text-accent-coral mt-2">
                &ldquo;{member.nickname}&rdquo; — {member.role}
              </div>
              <p className="font-sans text-2xl italic text-ink-brown mt-6 px-4">
                &ldquo;{member.quote}&rdquo;
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t-2 border-white/10 pt-8 font-mono text-xl text-gray-400">
              <span>commit-terakhir.tulalit.id</span>
              <span className="text-amber-400 font-bold">#GitPushKenangan</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Holographic Modal */}
      {is3DOpen && (
        <HolographicCardModal
          member={member}
          onClose={() => setIs3DOpen(false)}
        />
      )}
    </div>
  );
}
