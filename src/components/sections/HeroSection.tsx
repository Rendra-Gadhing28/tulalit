"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import gsap from "gsap";
import { siteConfig } from "@/data/config";
import { useQuality } from "@/lib/quality";
import { useCountdown } from "@/hooks/useCountdown";
import { Polaroid } from "@/components/ui/Polaroid";
import { HeroTogaFallback } from "@/components/three/HeroTogaFallback";
import { GraduationCelebration } from "@/components/three/GraduationCelebration";
import { ScrapbookSlot } from "@/components/custom/ScrapbookSlot";
import { CustomDecorationsMount } from "@/components/custom/CustomDecorations";
import { playSfx } from "@/lib/sound";
import { Sparkles, ArrowDown, Users, Film, ChevronDown, GraduationCap } from "lucide-react";

// Lazy import 3D Hero Toga (SSR false)
const HeroToga3D = dynamic(() => import("@/components/three/HeroToga3D"), {
  ssr: false,
  loading: () => <HeroTogaFallback />,
});

const TYPEWRITER_PHRASES = [
  "Git Push Kenangan, Sebelum Bel Terakhir.",
  "Dua circle, satu keluarga, sejuta kenangan.",
  "Dari bug pertama hingga wisuda bersama.",
  "Sogadev di laptop, Tulalit di hati.",
];

interface HeroSectionProps {
  isLoading?: boolean;
}

export function HeroSection({ isLoading = false }: HeroSectionProps) {
  const { quality } = useQuality();
  const [celebrateWisuda, setCelebrateWisuda] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [enable3D, setEnable3D] = useState(false);
  const countdown = useCountdown(siteConfig.graduationDate);

  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Scroll parallax transforms with spring smoothing to eliminate jitter
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });
  const scaleHero = useTransform(smoothProgress, [0, 1], [1, 0.94]);
  const opacityHero = useTransform(smoothProgress, [0, 0.75, 1], [1, 0.85, 0]);

  // Pause heavy effects (confetti) when user scrolls past Hero
  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      setIsHeroVisible(latest < 0.9);
    });
  }, [scrollYProgress]);

  // Typewriter effect state
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = TYPEWRITER_PHRASES[phraseIdx] || "";
    const speed = isDeleting ? 30 : 65;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        const nextText = fullText.substring(0, currentText.length + 1);
        setCurrentText(nextText);
        if (nextText === fullText) {
          setTimeout(() => setIsDeleting(true), 2200);
        }
      } else {
        const nextText = fullText.substring(0, currentText.length - 1);
        setCurrentText(nextText);
        if (nextText === "") {
          setIsDeleting(false);
          setPhraseIdx((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, phraseIdx]);

  // GSAP Intro Drop-Down Spring Landing Timeline
  useEffect(() => {
    if (isLoading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: 0.35,
      });

      // 1. Header Card / Title drops from top with elastic spring landing
      if (headerRef.current) {
        tl.fromTo(
          headerRef.current,
          {
            y: -750,
            opacity: 0,
            scale: 1.15,
            rotateX: 18,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateX: 0,
            duration: 2.2,
            ease: "elastic.out(1, 0.45)",
          }
        );
      }

      // 2. Polaroid & Visual Countdown grid drops down
      if (visualRef.current) {
        tl.fromTo(
          visualRef.current,
          {
            y: -550,
            opacity: 0,
            scale: 0.85,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.8,
            ease: "elastic.out(1, 0.5)",
          },
          "-=1.6"
        );
      }

      // 3. CTA Buttons stagger spring in
      if (buttonsRef.current) {
        tl.fromTo(
          buttonsRef.current,
          {
            y: -200,
            opacity: 0,
            scale: 0.7,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.4,
            ease: "back.out(1.7)",
          },
          "-=1.2"
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoading]);

  const handleCelebrate = () => {
    playSfx("konami");
    setCelebrateWisuda(true);
    try {
      const stored = localStorage.getItem("tulalit_unlocked_achievements");
      const parsed = stored ? JSON.parse(stored) : {};
      if (!parsed["confetti_maker"]) {
        parsed["confetti_maker"] = new Date().toISOString();
        localStorage.setItem("tulalit_unlocked_achievements", JSON.stringify(parsed));
      }
    } catch {}
  };

  const scrollToSection = (id: string) => {
    playSfx("click");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[90vh] md:min-h-screen pt-20 md:pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-center items-center overflow-hidden"
    >
      <CustomDecorationsMount section="hero" />

      {/* Graduation Rain Celebration Layer */}
      {celebrateWisuda && (
        <GraduationCelebration
          active={celebrateWisuda && isHeroVisible}
          infinite={false}
          onComplete={() => setCelebrateWisuda(false)}
        />
      )}

      {/* Motion wrapper with Parallax transforms */}
      <motion.div
        style={{ scale: scaleHero, opacity: opacityHero }}
        className="w-full flex flex-col items-center"
      >
        {/* Main Hero Header */}
        <div ref={headerRef} className="text-center z-10 max-w-4xl mx-auto">
          {/* School Tag Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-paper-light dark:bg-darkbg-card border border-paper-lines dark:border-darkbg-border text-xs font-mono font-bold text-ink-navy dark:text-accent-mustard shadow-sm mb-4 stamp-border border-accent-mustard/40 dark:border-accent-mustard/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            {siteConfig.schoolName} • Angkatan {siteConfig.academicYear}
          </div>

          {/* Mode Hari H check */}
          {countdown.isGraduated ? (
            <div className="mb-2">
              <span className="inline-flex items-center px-4 py-1 rounded-full bg-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
                <GraduationCap className="w-4 h-4 mr-1.5 inline text-accent-mustard" /> SELAMAT WISUDA ANGKATAN 2027!
              </span>
              <h1 className="font-hand text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-ink-navy dark:text-[#F8FAFC] tracking-tight leading-none drop-shadow-xs">
                Kenang-kenangan Tulalit
              </h1>
            </div>
          ) : (
            <h1 className="font-hand text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-ink-navy dark:text-[#F8FAFC] tracking-tight leading-none drop-shadow-xs">
              Kenang-kenangan Tulalit
            </h1>
          )}

          <div className="mt-2 flex items-center justify-center gap-3">
            <span className="font-hand text-3xl sm:text-4xl md:text-5xl font-bold text-accent-coral">
              Sogadev
            </span>
            <span className="font-mono text-xl md:text-2xl text-ink-muted">×</span>
            <span className="font-hand text-3xl sm:text-4xl md:text-5xl font-bold text-accent-mustard">
              Tulalit
            </span>
          </div>

          {/* Subtitle Typewriter */}
          <div className="mt-4 h-8 flex items-center justify-center font-mono text-sm sm:text-base md:text-lg text-ink-brown dark:text-gray-300">
            <span>{currentText}</span>
            <span className="inline-block w-2 h-5 bg-accent-coral ml-1 animate-pulse" />
          </div>
        </div>

        {/* Hero Visual Area: Polaroid + 3D Cap */}
        <div
          ref={visualRef}
          className="mt-8 md:mt-12 w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl z-10"
        >
          {/* Class Photo Polaroid */}
          <div className="flex justify-center">
            <Polaroid
              id="hero-class-photo"
              caption={`Keluarga Besar XII PPLG 3 (${siteConfig.academicYear})`}
              date="Wisuda Kelulusan"
              category="Angkatan"
              aspect="landscape"
              className="w-full max-w-sm md:max-w-md"
              priority
            />
          </div>

          {/* 3D Toga Moment (On-demand / Lightweight Fallback default) */}
          <div className="flex flex-col items-center justify-center text-center">
            {enable3D ? (
              <div className="flex flex-col items-center">
                <HeroToga3D onGraduate={handleCelebrate} />
                <button
                  type="button"
                  onClick={() => setEnable3D(false)}
                  className="mt-2 text-xs font-mono text-ink-muted underline hover:text-ink-navy dark:hover:text-white transition-colors"
                >
                  Kembali ke mode ringan (2D)
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <HeroTogaFallback onGraduate={handleCelebrate} />
                <button
                  type="button"
                  onClick={() => setEnable3D(true)}
                  className="mt-2 text-xs font-mono text-accent-mustard hover:underline flex items-center gap-1 bg-accent-mustard/10 px-2.5 py-1 rounded-full border border-accent-mustard/30 transition-colors"
                >
                  <span>✨ Aktifkan 3D Toga Interaktif</span>
                </button>
              </div>
            )}

            {/* LED / Pixel Countdown Wisuda */}
            <div
              className="mt-4 p-4 bg-ink-navy text-white font-mono border border-accent-mustard/60 shadow-xl w-full max-w-xs select-none"
              style={{
                borderRadius: "2px",
                boxShadow:
                  "0 0 30px rgba(244,185,66,0.15), 0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              <div className="text-[10px] uppercase tracking-widest text-accent-mustard mb-2 font-pixel">
                {countdown.isGraduated ? "HITUNG MAJU SEJAK LULUS" : "COUNTDOWN WISUDA"}
              </div>

              {countdown.isGraduated ? (
                <div className="bg-slate-800 p-3 text-center" style={{ borderRadius: "1px" }}>
                  <span className="block font-bold text-3xl text-emerald-400">
                    {countdown.daysSinceGraduation}
                  </span>
                  <span className="text-xs text-gray-300">HARI SEJAK KELULUSAN</span>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-slate-800 p-1.5" style={{ borderRadius: "1px" }}>
                    <span className="block font-bold text-lg md:text-xl text-emerald-400">
                      {countdown.days}
                    </span>
                    <span className="text-[9px] text-gray-400">HARI</span>
                  </div>
                  <div className="bg-slate-800 p-1.5" style={{ borderRadius: "1px" }}>
                    <span className="block font-bold text-lg md:text-xl text-sky-400">
                      {countdown.hours}
                    </span>
                    <span className="text-[9px] text-gray-400">JAM</span>
                  </div>
                  <div className="bg-slate-800 p-1.5" style={{ borderRadius: "1px" }}>
                    <span className="block font-bold text-lg md:text-xl text-amber-400">
                      {countdown.minutes}
                    </span>
                    <span className="text-[9px] text-gray-400">MNT</span>
                  </div>
                  <div className="bg-slate-800 p-1.5" style={{ borderRadius: "1px" }}>
                    <span className="block font-bold text-lg md:text-xl text-rose-400">
                      {countdown.seconds}
                    </span>
                    <span className="text-[9px] text-gray-400">DTK</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleCelebrate}
                className="mt-3 w-full py-1.5 px-3 bg-accent-mustard hover:bg-amber-400 text-ink-navy font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                style={{ borderRadius: "1px" }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Rayakan Wisuda!
              </button>
            </div>
          </div>
        </div>

        {/* Action CTA Buttons: [Buka Album], [Lihat Anggota], [Kelas Wrapped] */}
        <div
          ref={buttonsRef}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 md:gap-4 z-10"
        >
          <button
            type="button"
            onClick={() => scrollToSection("gallery")}
            className="px-5 md:px-6 py-2.5 md:py-3 bg-accent-coral hover:bg-rose-500 text-white font-bold font-sans text-sm shadow-lg flex items-center gap-2 transition-transform hover:-translate-y-0.5 active:translate-y-0"
            style={{ borderRadius: "3px" }}
          >
            <ArrowDown className="w-4 h-4" />
            Buka Album
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("members")}
            className="px-5 md:px-6 py-2.5 md:py-3 bg-paper-light dark:bg-darkbg-card hover:bg-paper-dark text-ink-navy dark:text-white border border-paper-lines dark:border-darkbg-border font-bold font-sans text-sm shadow-md flex items-center gap-2 transition-transform hover:-translate-y-0.5 active:translate-y-0"
            style={{ borderRadius: "3px" }}
          >
            <Users className="w-4 h-4" />
            Lihat Anggota
          </button>

          <Link
            href="/wrapped"
            onClick={() => playSfx("click")}
            className="px-5 md:px-6 py-2.5 md:py-3 bg-accent-mustard hover:bg-amber-400 text-ink-navy font-bold font-sans text-sm shadow-md flex items-center gap-2 transition-transform hover:-translate-y-0.5 active:translate-y-0"
            style={{ borderRadius: "3px" }}
          >
            <Film className="w-4 h-4" />
            Kelas Wrapped
          </Link>
        </div>
      </motion.div>

      {/* Floating Scroll Indicator prompt */}
      <motion.div
        animate={{
          y: [0, 6, 0],
          opacity: [0.45, 0.95, 0.45],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mt-6 flex flex-col items-center justify-center text-ink-muted dark:text-gray-400 cursor-pointer pointer-events-none"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase">Scroll ke bawah</span>
        <ChevronDown className="w-4 h-4 mt-0.5 text-accent-coral" />
      </motion.div>

      {/* Reserved Slot Ruang Kosong untuk Komponen Kustom User */}
      <div className="w-full max-w-4xl mt-4 z-10">
        <ScrapbookSlot id="hero-custom-slot" hint="Ruang Kosong di Bawah Hero" />
      </div>
    </section>
  );
}
