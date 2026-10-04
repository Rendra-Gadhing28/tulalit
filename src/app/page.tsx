"use client";

import React, { useState, useEffect } from "react";
import { useQuality } from "@/lib/quality";
import { useKonami } from "@/hooks/useKonami";
import { useAchievements } from "@/hooks/useAchievements";

// UI & Section Components
import { LoadingScreen } from "@/components/sections/LoadingScreen";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { WrappedTeaserSection } from "@/components/sections/WrappedTeaserSection";
import { TimelineSection } from "@/components/sections/TimelineSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { MembersSection } from "@/components/sections/MembersSection";
import { TeachersSection } from "@/components/sections/TeachersSection";
import { SuperlativesSection } from "@/components/sections/SuperlativesSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { QuotesMemesSection } from "@/components/sections/QuotesMemesSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { PlaygroundSection } from "@/components/sections/PlaygroundSection";
import { PlaylistSection } from "@/components/sections/PlaylistSection";
import { TimeCapsuleSection } from "@/components/sections/TimeCapsuleSection";
import { GuestbookSection } from "@/components/sections/GuestbookSection";
import { KamusTulalitSection } from "@/components/sections/KamusTulalitSection";
import { CreditsRollSection } from "@/components/sections/CreditsRollSection";

// Modals, Overlays & Easter Eggs
import { AchievementToast } from "@/components/ui/AchievementToast";
import { ScrollReveal, ScrollProgressBar } from "@/components/ui/ScrollReveal";
import { AchievementsModal } from "@/components/ui/AchievementsModal";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { KonamiOverlay } from "@/components/easter/KonamiOverlay";
import { SnailEasterEgg } from "@/components/easter/SnailEasterEgg";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSnailActive, setIsSnailActive] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const { quality, isHematMode, isReducedMotion } = useQuality();
  const { isKonamiActive, deactivate: deactivateKonami } = useKonami();
  const {
    achievements,
    unlockedCount,
    totalCount,
    latestToast,
    unlock,
  } = useAchievements();

  // Listen to Konami activation for achievement
  useEffect(() => {
    if (isKonamiActive) {
      unlock("konami_finder");
    }
  }, [isKonamiActive, unlock]);

  // Global shortcut for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleTriggerSnail = () => {
    setIsSnailActive(true);
    unlock("snail_breeder");
  };

  return (
    <div className="relative min-h-screen">
      {/* Scroll Progress Bar (ReactBits style) */}
      <ScrollProgressBar />

      {/* 1. Loading Screen dengan Tulalit Freeze Joke & Auto Benchmark */}
      {isLoading && <LoadingScreen onFinish={() => setIsLoading(false)} />}

      {/* 2. Floating Pill Navigation */}
      <FloatingNav
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onOpenSearch={() => setIsCommandOpen(true)}
      />

      <main>
        {/* 3. Urutan Section Scrapbook Lengkap */}
        {/* 1. Hero */}
        <HeroSection isLoading={isLoading} />

        {/* 2. Tentang Kita */}
        <ScrollReveal>
          <AboutSection />
        </ScrollReveal>

        {/* 3. Kelas Wrapped Teaser */}
        <ScrollReveal>
          <WrappedTeaserSection />
        </ScrollReveal>

        {/* 4. Timeline Git Log */}
        <ScrollReveal>
          <TimelineSection />
        </ScrollReveal>

        {/* 5. Galeri Polaroid */}
        <ScrollReveal>
          <GallerySection />
        </ScrollReveal>

        {/* 6. Anggota Contributors */}
        <ScrollReveal>
          <MembersSection />
        </ScrollReveal>

        {/* 6b. Guru & Wali Kelas */}
        <ScrollReveal>
          <TeachersSection />
        </ScrollReveal>

        {/* 7. Superlatif (Class Awards) */}
        <ScrollReveal>
          <SuperlativesSection />
        </ScrollReveal>

        {/* 8. Karya Proyek */}
        <ScrollReveal>
          <ProjectsSection />
        </ScrollReveal>

        {/* 9. Quote & Meme */}
        <ScrollReveal>
          <QuotesMemesSection />
        </ScrollReveal>

        {/* 9b. Kamus Besar Bahasa Tulalit */}
        <ScrollReveal>
          <KamusTulalitSection />
        </ScrollReveal>

        {/* 10. Playground (Arcade, Photobooth, Sticker Board, Coret Seragam) */}
        <ScrollReveal>
          <PlaygroundSection />
        </ScrollReveal>

        {/* 11. Playlist Soundtrack */}
        <ScrollReveal>
          <PlaylistSection />
        </ScrollReveal>

        {/* 12. Time Capsule Surat Masa Depan */}
        <ScrollReveal>
          <TimeCapsuleSection />
        </ScrollReveal>

        {/* 13. Buku Tamu */}
        <ScrollReveal>
          <GuestbookSection />
        </ScrollReveal>

        {/* 14. Credits Roll */}
        <ScrollReveal>
          <CreditsRollSection />
        </ScrollReveal>
      </main>

      {/* 15. Footer */}
      <FooterSection onTriggerSnail={handleTriggerSnail} />

      {/* Modals & Overlays */}
      {isAchievementsOpen && (
        <AchievementsModal
          isOpen={isAchievementsOpen}
          onClose={() => setIsAchievementsOpen(false)}
          achievements={achievements}
          unlockedCount={unlockedCount}
          totalCount={totalCount}
        />
      )}

      <AchievementToast achievement={latestToast} />

      {isCommandOpen && (
        <CommandPalette
          isOpen={isCommandOpen}
          onClose={() => setIsCommandOpen(false)}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
        />
      )}

      {/* Easter Eggs */}
      {isKonamiActive && (
        <KonamiOverlay active={isKonamiActive} onClose={deactivateKonami} />
      )}
      {isSnailActive && (
        <SnailEasterEgg
          active={isSnailActive}
          onFinished={() => setIsSnailActive(false)}
        />
      )}
    </div>
  );
}
