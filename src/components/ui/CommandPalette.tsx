"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useTheme } from "@/hooks/useTheme";
import { useQuality } from "@/lib/quality";
import membersData from "@/data/members.json";
import { playSfx } from "@/lib/sound";
import {
  Search,
  Moon,
  Sun,
  Zap,
  Terminal,
  Trophy,
  BookOpen,
  Film,
  User,
  ArrowRight,
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAchievements?: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onOpenAchievements,
}: CommandPaletteProps) {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const { isHematMode, toggleHematMode } = useQuality();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        playSfx("click");
        if (isOpen) {
          onClose();
        } else {
          // Open
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const runCommand = (action: () => void) => {
    playSfx("click");
    action();
    onClose();
  };

  const scrollTo = (id: string) => {
    runCommand(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-fade-in select-none"
      onClick={() => {
        playSfx("click");
        onClose();
      }}
    >
      <div
        className="relative w-full max-w-xl bg-paper-light dark:bg-[#111827] rounded-2xl border-4 border-paper-lines dark:border-darkbg-border shadow-2xl overflow-hidden font-sans text-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="w-full flex flex-col">
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-paper-lines dark:border-white/10 bg-paper-base dark:bg-darkbg-base">
            <Search className="w-5 h-5 text-ink-muted" />
            <Command.Input
              autoFocus
              placeholder="Ketik nama teman, section, atau aksi (misal: 'tema', 'buer')..."
              className="w-full bg-transparent outline-none font-sans text-base text-ink-navy dark:text-white placeholder:text-ink-muted"
            />
            <span className="font-mono text-[10px] text-ink-muted px-2 py-0.5 rounded bg-black/5 dark:bg-white/10">
              ESC
            </span>
          </div>

          {/* List Results */}
          <Command.List className="max-h-[60vh] overflow-y-auto p-3 space-y-3">
            <Command.Empty className="p-6 text-center text-xs font-mono text-ink-muted">
              Tidak ada hasil pencarian yang cocok.
            </Command.Empty>

            {/* Quick Actions */}
            <Command.Group
              heading="Perintah Cepat"
              className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted px-2 mb-1"
            >
              <Command.Item
                onSelect={() => runCommand(toggleTheme)}
                className="flex items-center justify-between p-2.5 rounded-lg cursor-pointer hover:bg-accent-mustard/20 dark:hover:bg-darkbg-subtle text-ink-navy dark:text-white"
              >
                <div className="flex items-center gap-2.5">
                  {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                  <span>Ganti Tema ({isDark ? "Aktifkan Tema Terang" : "Aktifkan Tema Begadang"})</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-ink-muted" />
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(toggleHematMode)}
                className="flex items-center justify-between p-2.5 rounded-lg cursor-pointer hover:bg-accent-mustard/20 dark:hover:bg-darkbg-subtle text-ink-navy dark:text-white"
              >
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Toggle Mode Hemat ({isHematMode ? "Matikan Mode Hemat" : "Nyalakan Mode Hemat"})</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-ink-muted" />
              </Command.Item>

              {onOpenAchievements && (
                <Command.Item
                  onSelect={() => runCommand(onOpenAchievements)}
                  className="flex items-center justify-between p-2.5 rounded-lg cursor-pointer hover:bg-accent-mustard/20 dark:hover:bg-darkbg-subtle text-ink-navy dark:text-white"
                >
                  <div className="flex items-center gap-2.5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Buka Lemari Trofi & Pencapaian</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-ink-muted" />
                </Command.Item>
              )}

              <Command.Item
                onSelect={() => runCommand(() => router.push("/wrapped"))}
                className="flex items-center justify-between p-2.5 rounded-lg cursor-pointer hover:bg-accent-mustard/20 dark:hover:bg-darkbg-subtle text-ink-navy dark:text-white"
              >
                <div className="flex items-center gap-2.5">
                  <Film className="w-4 h-4 text-accent-coral" />
                  <span>Putar Kelas Wrapped 2025-2027 (Story Mode)</span>
                </div>
                <span className="font-mono text-[10px] text-accent-coral font-bold">/wrapped</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push("/yearbook"))}
                className="flex items-center justify-between p-2.5 rounded-lg cursor-pointer hover:bg-accent-mustard/20 dark:hover:bg-darkbg-subtle text-ink-navy dark:text-white"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-accent-sky" />
                  <span>Buka Buku Tahunan Siap Cetak (A4/PDF)</span>
                </div>
                <span className="font-mono text-[10px] text-accent-sky font-bold">/yearbook</span>
              </Command.Item>
            </Command.Group>

            {/* Jump to Sections */}
            <Command.Group
              heading="Lompat ke Section"
              className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted px-2 mb-1"
            >
              {[
                { id: "hero", label: "Hero Album Kenangan" },
                { id: "about", label: "Tentang Kita (Sogadev x Tulalit)" },
                { id: "wrapped-teaser", label: "Kilas Balik Wrapped" },
                { id: "timeline", label: "Timeline Git Log" },
                { id: "gallery", label: "Galeri Foto Polaroid" },
                { id: "members", label: "Anggota Contributors" },
                { id: "superlatives", label: "Superlatif (Class Awards)" },
                { id: "teachers", label: "Guru & Wali Kelas" },
                { id: "projects", label: "Showcase Karya Proyek" },
                { id: "quotes", label: "Dinding Quote & Meme" },
                { id: "playground", label: "Playground (Arcade & Photobooth)" },
                { id: "playlist", label: "Playlist Soundtrack" },
                { id: "timecapsule", label: "Time Capsule Surat Masa Depan" },
                { id: "guestbook", label: "Buku Tamu Kenangan" },
              ].map((s) => (
                <Command.Item
                  key={s.id}
                  onSelect={() => scrollTo(s.id)}
                  className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-paper-base dark:hover:bg-darkbg-subtle text-ink-navy dark:text-gray-200 text-xs"
                >
                  <span>{s.label}</span>
                  <span className="font-mono text-[10px] text-ink-muted">#{s.id}</span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Members search */}
            <Command.Group
              heading="Profil Anggota Kelas"
              className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted px-2 mb-1"
            >
              {membersData.map((m) => (
                <Command.Item
                  key={m.id}
                  onSelect={() => runCommand(() => router.push(`/anggota/${m.id}`))}
                  className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-paper-base dark:hover:bg-darkbg-subtle text-ink-navy dark:text-gray-200 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-accent-mustard" />
                    <span>
                      {m.name} ({m.nickname})
                    </span>
                    <span className="text-[10px] text-ink-muted">• {m.role}</span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-500 font-bold">Kartu &rarr;</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
