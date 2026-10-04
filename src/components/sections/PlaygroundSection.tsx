"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ScrapbookSlot } from "@/components/custom/ScrapbookSlot";
import { playSfx } from "@/lib/sound";
import { Gamepad2, Camera, Sparkles, PenTool } from "lucide-react";

const MemoryMatchGame = dynamic(
  () =>
    import("@/components/games/MemoryMatchGame").then(
      (m) => m.MemoryMatchGame
    ),
  { ssr: false }
);

const BugCatcherGame = dynamic(
  () =>
    import("@/components/games/BugCatcherGame").then(
      (m) => m.BugCatcherGame
    ),
  { ssr: false }
);

const Photobooth = dynamic(
  () =>
    import("@/components/photobooth/Photobooth").then(
      (m) => m.Photobooth
    ),
  { ssr: false }
);

const StickerBoardSection = dynamic(
  () =>
    import("@/components/sections/StickerBoardSection").then(
      (m) => m.StickerBoardSection
    ),
  { ssr: false }
);

const SeragamDigital = dynamic(
  () =>
    import("@/components/interactive/SeragamDigital").then(
      (m) => m.SeragamDigital
    ),
  { ssr: false }
);

type PlaygroundTab = "arcade" | "photobooth" | "stickers" | "seragam";

export function PlaygroundSection() {
  const [activeTab, setActiveTab] = useState<PlaygroundTab>("arcade");
  const [activeGame, setActiveGame] = useState<"memory" | "bug">("memory");

  return (
    <section
      id="playground"
      className="relative py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <SectionTitle
        badge="Playground & Fun"
        title="Arena Bermain & Nostalgia"
        subtitle="Istirahat sejenak dari tugas! Mainkan mini-game retro bertema merge conflict, jepret foto wisuda di Photobooth, atau hias papan gabus stiker."
      />

      {/* Main Tab Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        {[
          { id: "arcade", label: "Arcade Game", icon: <Gamepad2 className="w-4 h-4" /> },
          { id: "photobooth", label: "Photobooth Wisuda", icon: <Camera className="w-4 h-4" /> },
          { id: "stickers", label: "Papan Gabus Stiker", icon: <Sparkles className="w-4 h-4" /> },
          { id: "seragam", label: "Coret Seragam", icon: <PenTool className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              playSfx("click");
              setActiveTab(tab.id as PlaygroundTab);
            }}
            className={`px-4 py-2 font-mono text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === tab.id
                ? "bg-accent-terminal text-ink-navy shadow-md scale-105"
                : "bg-paper-light dark:bg-darkbg-card text-ink-muted dark:text-gray-300 border border-paper-lines hover:text-ink-navy dark:hover:text-white"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Arcade */}
      {activeTab === "arcade" && (
        <div className="space-y-6 animate-fade-in">
          {/* Sub-game switcher */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <button
              type="button"
              onClick={() => {
                playSfx("click");
                setActiveGame("memory");
              }}
              className={`px-3 py-1 text-xs font-mono font-bold border ${
                activeGame === "memory"
                  ? "bg-accent-mustard text-ink-navy border-amber-500 shadow-xs"
                  : "bg-paper-base dark:bg-darkbg-base text-ink-muted border-paper-lines"
              }`}
            >
              1. Merge Conflict (Memory Match)
            </button>
            <button
              type="button"
              onClick={() => {
                playSfx("click");
                setActiveGame("bug");
              }}
              className={`px-3 py-1 text-xs font-mono font-bold border ${
                activeGame === "bug"
                  ? "bg-accent-mustard text-ink-navy border-amber-500 shadow-xs"
                  : "bg-paper-base dark:bg-darkbg-base text-ink-muted border-paper-lines"
              }`}
            >
              2. Tangkap Bug & Siput
            </button>
          </div>

          {activeGame === "memory" ? <MemoryMatchGame /> : <BugCatcherGame />}
        </div>
      )}

      {/* Tab 2: Photobooth */}
      {activeTab === "photobooth" && (
        <div className="animate-fade-in">
          <Photobooth />
        </div>
      )}

      {/* Tab 3: Sticker Board */}
      {activeTab === "stickers" && (
        <div className="animate-fade-in">
          <StickerBoardSection />
        </div>
      )}

      {/* Tab 4: Coret Seragam */}
      {activeTab === "seragam" && (
        <div className="animate-fade-in">
          <SeragamDigital />
        </div>
      )}

      <ScrapbookSlot id="playground-slot" hint="Ruang Kosong di Area Playground" />
    </section>
  );
}
