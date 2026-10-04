"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useTheme } from "@/hooks/useTheme";
import { useQuality } from "@/lib/quality";
import { isSoundMuted, setSoundMuted, playSfx } from "@/lib/sound";
import { KeepsakeLetterModal } from "@/components/ui/KeepsakeLetterModal";
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Zap,
  ZapOff,
  Trophy,
  Search,
  Menu,
  X,
  Mail,
  MailOpen,
  BookOpen,
  Users,
  Sparkles,
  ChevronRight,
  GraduationCap,
} from "lucide-react";

// 4 desktop quick links
const QUICK_LINKS = [
  { id: "hero", label: "Album" },
  { id: "about", label: "Tentang" },
  { id: "gallery", label: "Galeri" },
  { id: "projects", label: "Karya" },
];

// All sections tracked by scrollspy
const ALL_SECTION_IDS = [
  "hero",
  "about",
  "wrapped-teaser",
  "timeline",
  "members",
  "teachers",
  "gallery",
  "superlatives",
  "projects",
  "playground",
  "playlist",
  "timecapsule",
  "guestbook",
];

// Scrapbook Chapters for the Table of Contents Drawer
const SCRAPBOOK_CHAPTERS = [
  {
    category: "Kilas Balik",
    icon: BookOpen,
    description: "Awal mula, kilas balik perjalanan, dan rekap cerita 3 tahun.",
    items: [
      { id: "hero", label: "Album", desc: "Foto sampul & sambutan pembuka" },
      { id: "about", label: "Tentang Kita", desc: "Visi, identitas, & sejarah kelas" },
      { id: "wrapped-teaser", label: "Wrapped", desc: "Statistik coding & rekap kelas" },
      { id: "timeline", label: "Timeline", desc: "Git log perjalanan 2024–2027" },
    ],
  },
  {
    category: "Keluarga & Cerita",
    icon: Users,
    description: "Sosok-sosok berharga yang mewarnai setiap hari sekolah.",
    items: [
      { id: "members", label: "Anggota Kelas", desc: "Kartu profil seluruh kawan" },
      { id: "teachers", label: "Guru & Wali Kelas", desc: "Apresiasi guru & para mentor" },
      { id: "gallery", label: "Galeri Kenangan", desc: "Polaroid momen tak terlupakan" },
      { id: "superlatives", label: "Momen Legendaris", desc: "Class awards & keunikan" },
    ],
  },
  {
    category: "Ruang Nostalgia",
    icon: Sparkles,
    description: "Keseruan interaktif, lagu begadang, dan pesan masa depan.",
    items: [
      { id: "playground", label: "Photobooth & Games", desc: "Arcade mini & coret seragam" },
      { id: "playlist", label: "Playlist Begadang", desc: "Soundtrack saat ngerjain tugas" },
      { id: "timecapsule", label: "Kapsul Waktu", desc: "Surat & prediksi masa depan" },
      { id: "guestbook", label: "Buku Tamu", desc: "Pesan & jejak para pengunjung" },
    ],
  },
];

interface FloatingNavProps {
  onOpenAchievements?: () => void;
  onOpenSearch?: () => void;
}

export function FloatingNav({ onOpenAchievements, onOpenSearch }: FloatingNavProps) {
  const activeSection = useScrollSpy(ALL_SECTION_IDS, 250);
  const { isDark, toggleTheme } = useTheme();
  const { isHematMode, toggleHematMode } = useQuality();
  const [muted, setMutedState] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLetterOpen, setIsLetterOpen] = useState(false);

  // Sync mute state on client mount
  useEffect(() => {
    setMutedState(isSoundMuted());
  }, []);

  // Handle ESC key for index drawer
  useEffect(() => {
    if (!isDrawerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        playSfx("click");
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen]);

  const handleMuteToggle = () => {
    const next = !muted;
    setMutedState(next);
    setSoundMuted(next);
    if (!next) {
      playSfx("click");
    }
  };

  const scrollTo = (id: string) => {
    playSfx("click");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    playSfx("click");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChapterItemClick = (id: string) => {
    setIsDrawerOpen(false);
    playSfx("paper-slide");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header className="fixed z-50 left-1/2 -translate-x-1/2 bottom-4 md:bottom-auto md:top-4 w-[95%] max-w-5xl transition-all">
        <nav
          aria-label="Navigasi Utama Scrapbook"
          className="flex items-center justify-between px-2.5 sm:px-4 py-2 rounded-full bg-paper-light/95 dark:bg-darkbg-card/95 backdrop-blur-md border border-paper-lines dark:border-darkbg-border"
          style={{
            boxShadow:
              "0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        >
          {/* 1. Left: Badge Logo "XII PPLG 3" (Click to scroll to top) */}
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-amber-400/20 dark:bg-amber-400/10 border border-amber-500/30 hover:bg-amber-400/30 active:scale-95 transition-all shrink-0 cursor-pointer"
            title="Kembali ke atas (Album)"
            aria-label="Kembali ke atas halaman"
          >
            <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="font-mono font-bold text-xs sm:text-sm tracking-tight text-ink-navy dark:text-white">
              XII PPLG 3
            </span>
          </button>

          {/* 2. Center: Desktop 4 Quick Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {QUICK_LINKS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className={`relative px-3 py-1 text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? "text-ink-navy dark:text-white font-bold font-hand text-base"
                      : "text-ink-muted dark:text-gray-400 hover:text-ink-navy dark:hover:text-white"
                  }`}
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0.5 left-1 right-1 h-[3px] bg-accent-mustard/70 dark:bg-accent-mustard/60 -z-10"
                      style={{ borderRadius: "1px", transform: "skewX(-4deg)" }}
                    />
                  )}
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* 3. Special Button "Surat" (Opens KeepsakeLetterModal) */}
          <button
            type="button"
            onClick={() => {
              playSfx("click");
              setIsLetterOpen(true);
            }}
            className="relative group px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-sans font-bold text-xs sm:text-sm shadow-[0_0_12px_rgba(245,158,11,0.45)] hover:shadow-[0_0_18px_rgba(245,158,11,0.65)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1 sm:gap-1.5 shrink-0 animate-pulse-glow cursor-pointer"
            title="Buka Surat Kenangan Kelas XII PPLG 3"
            aria-label="Buka surat kenangan kelas"
          >
            <Mail className="w-3.5 h-3.5 text-amber-500 mr-1.5 inline" />
            <span>Surat</span>
          </button>

          {/* 4. Right Controls: Search, Sound, Theme, Hamburger "Daftar Isi" */}
          <div className="flex items-center gap-1 sm:gap-1.5 pl-1.5 sm:pl-2 border-l border-paper-lines dark:border-white/10 shrink-0">
            {/* Search (Ctrl+K) */}
            {onOpenSearch && (
              <button
                type="button"
                onClick={() => {
                  playSfx("click");
                  onOpenSearch();
                }}
                className="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-paper-base dark:bg-darkbg-base text-ink-navy dark:text-white border border-paper-lines hover:bg-paper-dark dark:hover:bg-darkbg-subtle transition-colors shrink-0"
                title="Cari & Perintah (Ctrl+K)"
                aria-label="Buka pencarian dan menu perintah"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Mute Toggle */}
            <button
              type="button"
              onClick={handleMuteToggle}
              className={`w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border transition-colors shrink-0 ${
                muted
                  ? "bg-paper-base dark:bg-darkbg-base text-ink-muted border-paper-lines"
                  : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300"
              }`}
              title={muted ? "Suara nonaktif (Klik untuk bunyikan)" : "Suara aktif"}
              aria-label={muted ? "Nyalakan suara efek" : "Bisukan suara efek"}
            >
              {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-paper-base dark:bg-darkbg-base text-ink-navy dark:text-yellow-300 border border-paper-lines dark:border-darkbg-border hover:scale-105 transition-transform shrink-0"
              title={isDark ? "Tema Terang (Scrapbook Kertas)" : "Tema Gelap (Begadang Ngoding)"}
              aria-label="Toggle tema gelap atau terang"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Hamburger Menu "Daftar Isi" ☰ */}
            <button
              type="button"
              onClick={() => {
                playSfx("paper");
                setIsDrawerOpen(true);
              }}
              className="px-2.5 py-1 sm:py-1.5 rounded-full bg-paper-base dark:bg-darkbg-base text-ink-navy dark:text-white border border-paper-lines dark:border-darkbg-border hover:bg-paper-dark dark:hover:bg-darkbg-subtle active:scale-95 transition-all flex items-center gap-1 shrink-0 cursor-pointer"
              title="Buka Daftar Isi Buku Kenangan"
              aria-label="Buka daftar isi buku kenangan"
            >
              <Menu className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline font-mono font-bold text-xs">
                Daftar Isi
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Scrapbook Index Drawer ("Daftar Isi Buku Kenangan") */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-[90] overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => {
                playSfx("click");
                setIsDrawerOpen(false);
              }}
              className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Slide-over Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[420px] md:w-[460px] bg-paper-light dark:bg-darkbg-card border-l-2 border-paper-lines dark:border-darkbg-border shadow-2xl flex flex-col z-10 select-none"
              role="dialog"
              aria-modal="true"
              aria-labelledby="drawer-index-title"
            >
              {/* Drawer Vintage Header */}
              <div className="relative p-5 pb-4 border-b border-paper-lines dark:border-darkbg-border bg-paper-base/70 dark:bg-darkbg-base/70">
                {/* Washi Tape on Top Center */}
                <div
                  aria-hidden="true"
                  className="tape tape-mustard absolute -top-2 left-1/2 -translate-x-1/2 w-28 -rotate-1 pointer-events-none"
                />

                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 dark:bg-amber-400/10 border border-amber-500/30 flex items-center justify-center text-amber-700 dark:text-amber-400">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h2
                        id="drawer-index-title"
                        className="font-hand font-bold text-2xl text-ink-navy dark:text-white leading-tight"
                      >
                        Daftar Isi Buku Kenangan
                      </h2>
                      <p className="font-mono text-[11px] text-ink-muted dark:text-gray-400">
                        Scrapbook Tahunan XII PPLG 3
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playSfx("click");
                      setIsDrawerOpen(false);
                    }}
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-ink-muted hover:text-ink-navy dark:hover:text-white transition-colors cursor-pointer"
                    title="Tutup (ESC)"
                    aria-label="Tutup daftar isi"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Chapter Items (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {SCRAPBOOK_CHAPTERS.map((chapter) => (
                  <div key={chapter.category} className="space-y-2">
                    {/* Chapter Header */}
                    <div className="pb-1 border-b border-paper-lines dark:border-white/10 flex items-baseline justify-between">
                      <div className="flex items-center gap-2">
                        <chapter.icon className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-ink-navy dark:text-amber-100">
                          {chapter.category}
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono text-ink-muted">
                        Bab Kelas
                      </span>
                    </div>

                    <p className="text-[11px] text-ink-muted dark:text-gray-400 mb-2 italic">
                      {chapter.description}
                    </p>

                    {/* Chapter Nav Items */}
                    <div className="space-y-1">
                      {chapter.items.map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleChapterItemClick(item.id)}
                            className={`w-full group px-3 py-2 rounded-lg text-left transition-all flex items-center justify-between cursor-pointer ${
                              isActive
                                ? "bg-amber-100/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 shadow-xs"
                                : "hover:bg-paper-dark dark:hover:bg-darkbg-subtle border border-transparent"
                            }`}
                          >
                            <div className="flex flex-col">
                              <span
                                className={`text-sm font-semibold transition-colors ${
                                  isActive
                                    ? "text-amber-900 dark:text-amber-300 font-bold"
                                    : "text-ink-navy dark:text-gray-200 group-hover:text-amber-700 dark:group-hover:text-amber-300"
                                }`}
                              >
                                {item.label}
                              </span>
                              <span className="text-[11px] text-ink-muted dark:text-gray-400 line-clamp-1">
                                {item.desc}
                              </span>
                            </div>

                            <ChevronRight
                              className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                                isActive
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-ink-muted/50 group-hover:text-ink-navy dark:group-hover:text-white"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Drawer Quick Actions Footer */}
              <div className="p-4 border-t border-paper-lines dark:border-darkbg-border bg-paper-base/60 dark:bg-darkbg-base/60 space-y-2.5">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted dark:text-gray-400">
                  Aksi & Pengaturan Cepat
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Trofi Pencapaian */}
                  {onOpenAchievements && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsDrawerOpen(false);
                        playSfx("click");
                        onOpenAchievements();
                      }}
                      className="px-3 py-2 rounded-lg bg-amber-400/20 dark:bg-amber-400/10 border border-amber-500/30 hover:bg-amber-400/30 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Lemari Trofi</span>
                    </button>
                  )}

                  {/* Mode Hemat Toggle */}
                  <button
                    type="button"
                    onClick={toggleHematMode}
                    className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      isHematMode
                        ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-400"
                        : "bg-paper-light dark:bg-darkbg-card text-ink-navy dark:text-white border-paper-lines dark:border-darkbg-border hover:bg-paper-dark"
                    }`}
                  >
                    {isHematMode ? (
                      <ZapOff className="w-4 h-4 text-amber-600 shrink-0" />
                    ) : (
                      <Zap className="w-4 h-4 text-ink-muted shrink-0" />
                    )}
                    <span>{isHematMode ? "Hemat: On" : "Hemat: Off"}</span>
                  </button>
                </div>

                {/* Surat Kenangan Shortcut */}
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    playSfx("click");
                    setIsLetterOpen(true);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <MailOpen className="w-4 h-4 text-rose-500 mr-1.5 inline" />
                  <span>Buka Surat Kenangan</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Keepsake Letter Modal Mounted */}
      <KeepsakeLetterModal
        isOpen={isLetterOpen}
        onClose={() => setIsLetterOpen(false)}
      />
    </>
  );
}
