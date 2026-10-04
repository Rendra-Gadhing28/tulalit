"use client";

import React from "react";
import Link from "next/link";
import wrappedData from "@/data/wrapped.json";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Sticker } from "@/components/ui/Sticker";
import { ScrapbookSlot } from "@/components/custom/ScrapbookSlot";
import { playSfx } from "@/lib/sound";
import { Play, Sparkles, ArrowRight, Disc3 } from "lucide-react";

export function WrappedTeaserSection() {
  const slides = wrappedData.slides.slice(0, 3);

  return (
    <section
      id="wrapped-teaser"
      className="relative py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <SectionTitle
        badge="Story Kilas Balik"
        title="Kelas Wrapped 2025 - 2027"
        subtitle="Rangkuman statistik lucu, rekor begadang, dan momen bersejarah XII PPLG 3 dalam format story layar penuh ala Spotify Wrapped!"
      />

      {/* Main Teaser Banner */}
      <div className="relative rounded-3xl bg-darkbg-card text-white p-6 md:p-12 border-4 border-paper-lines dark:border-darkbg-border shadow-2xl overflow-hidden">
        {/* Background Decorative Rings */}
        <div
          aria-hidden="true"
          className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full border-8 border-white/5 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -left-20 -top-20 w-72 h-72 rounded-full border-8 border-accent-mustard/10 pointer-events-none"
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-mustard/20 border border-accent-mustard text-accent-mustard text-xs font-mono font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Story Mode Interaktif
            </div>

            <h3 className="font-hand text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
              Bagaimana Cerita 3 Tahun Kita Dirangkum?
            </h3>

            <p className="mt-3 font-sans text-sm md:text-base text-gray-300 leading-relaxed">
              Dari ribuan cangkir kopi kantin Mbak Sri, jutaan baris kode, hingga indeks Tulalit kelas yang mencapai 99.8%. Tonton kilas balik sinematik dan unduh kartu ceritamu untuk dibagikan ke media sosial!
            </p>

            {/* CTA Button to /wrapped */}
            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Link
                href="/wrapped"
                onClick={() => playSfx("click")}
                className="px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-accent-coral text-ink-navy font-bold font-sans text-sm md:text-base flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                Putar Kelas Wrapped Sekarang
              </Link>
            </div>
          </div>

          {/* Quick Preview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            {slides.map((s, idx) => (
              <div
                key={s.id}
                className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col justify-between text-center lg:text-left min-w-[150px]"
              >
                <div className="text-[10px] font-mono text-gray-300 uppercase tracking-wider">
                  {s.subtitle}
                </div>
                <div className="my-2 font-mono font-black text-3xl text-accent-mustard">
                  {s.metric}
                </div>
                <div className="text-[11px] font-mono font-semibold text-gray-200 line-clamp-1">
                  {s.metricLabel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ScrapbookSlot id="wrapped-teaser-slot" hint="Ruang Kosong di Area Wrapped" />
    </section>
  );
}
