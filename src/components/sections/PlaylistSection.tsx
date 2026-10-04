"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import playlistData from "@/data/playlist.json";
import type { PlaylistItem } from "@/types";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ScrapbookSlot } from "@/components/custom/ScrapbookSlot";
import { playSfx } from "@/lib/sound";
import { Play, Pause, Disc3, Radio } from "lucide-react";

const SuaraKelas = dynamic(
  () => import("@/components/interactive/SuaraKelas").then((m) => m.SuaraKelas),
  { ssr: false }
);

export function PlaylistSection() {
  const [activeTrackIndex, setActiveTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showSpotify, setShowSpotify] = useState<boolean>(false);

  const currentTrack: PlaylistItem =
    (playlistData as PlaylistItem[])[activeTrackIndex] || (playlistData as PlaylistItem[])[0];

  const togglePlay = () => {
    if (!isPlaying) {
      playSfx("vinyl-scratch");
      setIsPlaying(true);
    } else {
      playSfx("click");
      setIsPlaying(false);
    }
  };

  const selectTrack = (index: number) => {
    playSfx("vinyl-scratch");
    setActiveTrackIndex(index);
    setIsPlaying(true);
  };

  return (
    <section
      id="playlist"
      className="relative py-16 md:py-24 px-4 md:px-8 max-w-5xl mx-auto overflow-hidden"
    >
      <SectionTitle
        badge="Radio Tulalit"
        title="Soundtrack 3 Tahun Sekolah"
        subtitle="Lagu-lagu pengiring praktikum lab, teman begadang tugas akhir, dan nostalgia masa putih abu-abu."
      />

      <div className="bg-paper-light dark:bg-darkbg-card p-6 md:p-8 rounded-2xl border-2 border-paper-lines dark:border-darkbg-border shadow-scrapbook grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Vinyl Turntable Animation */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative p-6 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-2xl flex items-center justify-center">
            {/* Vinyl Record */}
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{
                duration: 7,
                ease: "linear",
                repeat: isPlaying ? Infinity : 0,
              }}
              className="relative w-48 h-48 md:w-56 md:h-56 rounded-full bg-slate-900 border-8 border-slate-800 shadow-2xl flex items-center justify-center select-none overflow-hidden"
              style={{
                boxShadow: isPlaying
                  ? "0 0 30px rgba(244, 185, 66, 0.2), 0 10px 25px -5px rgba(0, 0, 0, 0.8)"
                  : "0 10px 25px -5px rgba(0, 0, 0, 0.6)",
              }}
            >
              {/* Spinning Groove Rings */}
              <div className="w-full h-full rounded-full border-4 border-dashed border-slate-700/50 flex items-center justify-center">
                {/* Vinyl Center Label */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-accent-mustard border-4 border-white flex flex-col items-center justify-center p-2 text-ink-navy shadow-inner">
                  <Disc3 className="w-5 h-5 mb-0.5 text-ink-navy" />
                  <span className="font-hand font-bold text-xs truncate max-w-[70px]">
                    {currentTrack.title}
                  </span>
                  <span className="font-mono text-[8px] text-ink-brown">XII PPLG 3</span>
                </div>
              </div>

              {/* Center Spindle Hole */}
              <div className="absolute w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-900 z-10 shadow-sm" />
            </motion.div>

            {/* Tonearm (Turntable Needle) - Precision Mechanical Transition */}
            <div
              className="absolute top-2 right-2 w-16 h-36 origin-top-right transition-transform duration-700 pointer-events-none z-20"
              style={{
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                transform: isPlaying ? "rotate(-4deg)" : "rotate(-32deg)",
              }}
            >
              {/* Pivot Base */}
              <div className="absolute top-1 right-1 w-7 h-7 rounded-full bg-zinc-600 border-2 border-zinc-400 shadow-md" />
              {/* Metallic Arm */}
              <div className="absolute top-4 right-3.5 w-1.5 h-28 bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-500 rounded-full shadow-sm" />
              {/* Needle Cartridge Head */}
              <div className="absolute bottom-0 right-2 w-4 h-6 bg-accent-coral rounded-xs shadow-md border border-zinc-700" />
            </div>
          </div>

          {/* Current Track Info & Equalizer */}
          <div className="mt-4 flex flex-col items-center">
            <div className="flex items-center gap-2">
              <h4 className="font-sans font-bold text-xl text-ink-navy dark:text-white">
                {currentTrack.title}
              </h4>
              {/* Animated Equalizer Bars */}
              {isPlaying && (
                <div className="flex items-end gap-1 h-4">
                  {[40, 80, 50, 100].map((h, i) => (
                    <motion.span
                      key={i}
                      animate={{ height: ["20%", `${h}%`, "30%"] }}
                      transition={{
                        duration: 0.5 + i * 0.1,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                      className="w-1 bg-accent-coral rounded-full inline-block"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              )}
            </div>
            <p className="font-mono text-xs text-accent-coral font-semibold mt-0.5">
              {currentTrack.artist} • {currentTrack.duration}
            </p>
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="p-3.5 rounded-full bg-accent-coral hover:bg-rose-500 text-white shadow-md transition-transform hover:scale-105 active:scale-95"
              aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={() => {
                playSfx("click");
                setShowSpotify((prev) => !prev);
              }}
              className="px-3.5 py-1.5 rounded-full bg-paper-base dark:bg-darkbg-base border border-paper-lines text-xs font-mono text-ink-navy dark:text-gray-300 flex items-center gap-1.5 hover:bg-paper-dark transition-colors"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-500" />
              {showSpotify ? "Sembunyikan Spotify" : "Embed Spotify"}
            </button>
          </div>
        </div>

        {/* Tracklist List */}
        <div className="space-y-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink-muted block mb-3">
            Daftar Putar Kenangan:
          </span>

          {(playlistData as PlaylistItem[]).map((track, idx) => {
            const isActive = idx === activeTrackIndex;

            return (
              <div
                key={track.id}
                onClick={() => selectTrack(idx)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isActive
                    ? "bg-amber-100/70 dark:bg-amber-950/40 border-accent-mustard font-bold text-ink-navy dark:text-white scale-[1.02] shadow-sm"
                    : "bg-paper-base dark:bg-darkbg-base border-paper-lines dark:border-white/10 text-ink-brown dark:text-gray-300 hover:bg-paper-dark"
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <span className="font-mono text-xs text-ink-muted w-4">
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <p className="font-sans text-sm truncate">{track.title}</p>
                    <p className="font-mono text-[10px] text-ink-muted truncate">
                      {track.artist}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-ink-muted">
                    {track.duration}
                  </span>
                  {isActive && isPlaying && (
                    <span className="w-2 h-2 rounded-full bg-accent-coral animate-ping" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spotify Embed Player */}
      {showSpotify && (
        <div className="mt-8 p-4 bg-paper-light dark:bg-darkbg-card rounded-2xl border-2 border-paper-lines dark:border-darkbg-border">
          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0"
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Playlist Sekolah"
          />
        </div>
      )}

      {/* Soundboard Interaktif Suara Kelas */}
      <div className="mt-12">
        <SuaraKelas />
      </div>

      <ScrapbookSlot id="playlist-slot" hint="Ruang Kosong di Area Soundtrack" />
    </section>
  );
}
