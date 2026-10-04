"use client";

import React, { useRef, useEffect, useState } from "react";
import membersData from "@/data/members.json";

interface Member {
  name: string;
  nickname: string;
  role: string;
}

const SPECIAL_THANKS = [
  "Kantin Sekolah — Penyedia Energi Utama",
  "PC No. 14 — Yang Tidak Pernah Menyerah",
  "Colokan Pojok — Wilayah Sengketa Terpanas",
  "Stack Overflow — Guru Tanpa Jadwal",
  "Ibu Guru — Atas Semua Kesabaran & Ilmunya",
];

export function CreditsRollSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const posRef = useRef<number>(0);
  const [countdown, setCountdown] = useState(10);
  const [countActive, setCountActive] = useState(false);
  const [done, setDone] = useState(false);

  // Auto-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const totalHeight = el.scrollHeight - el.clientHeight;

    const tick = () => {
      posRef.current += 0.6;
      if (posRef.current >= totalHeight) {
        posRef.current = totalHeight;
        setCountActive(true);
      } else {
        el.scrollTop = posRef.current;
        animRef.current = requestAnimationFrame(tick);
      }
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!countActive) return;
    if (countdown <= 0) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countActive, countdown]);

  const handleRestart = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const members = membersData as Member[];

  return (
    <section
      id="credits"
      className="relative py-16 md:py-24 px-4 overflow-hidden bg-[#0A0A0F] text-white"
    >
      {/* Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.8) 2px, rgba(0,0,0,0.8) 4px)",
        }}
      />

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Scrolling credits container */}
      <div
        ref={scrollRef}
        className="relative z-20 max-w-2xl mx-auto h-[70vh] overflow-hidden"
        style={{ maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)" }}
      >
        <div className="space-y-0 pb-32">
          {/* Title card */}
          <div className="text-center py-20">
            <p className="font-mono text-xs tracking-[0.4em] text-yellow-400/60 mb-4">
              XII PPLG 3 · SMK · 2022–2025
            </p>
            <h2
              className="font-mono text-4xl md:text-5xl font-bold text-yellow-400 tracking-widest mb-2"
              style={{ textShadow: "0 0 30px rgba(251,191,36,0.6)" }}
            >
              KENANG-KENANGAN
            </h2>
            <h3 className="font-mono text-2xl font-bold text-white tracking-widest">
              TULALIT
            </h3>
            <div className="mt-6 w-24 h-px bg-yellow-400/40 mx-auto" />
          </div>

          {/* Production credit */}
          <div className="text-center py-12">
            <p className="font-mono text-xs tracking-[0.3em] text-gray-400 mb-3">
              DIPRODUKSI OLEH
            </p>
            <p className="font-mono text-xl text-white font-bold">
              Seluruh Warga Kelas XII PPLG 3
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 py-6 px-8">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="font-mono text-[10px] tracking-widest text-gray-500">CAST</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          {/* Cast members */}
          <div className="space-y-8 py-6">
            {members.map((m, i) => (
              <div key={i} className="text-center space-y-1">
                <p className="font-mono text-xl font-bold text-white">
                  {m.name}
                  <span className="text-yellow-400/70 ml-2 text-sm font-normal">
                    &ldquo;{m.nickname}&rdquo;
                  </span>
                </p>
                <p className="font-mono text-xs tracking-widest text-gray-400 uppercase">
                  {m.role}
                </p>
              </div>
            ))}
          </div>

          {/* Special Thanks */}
          <div className="py-16">
            <div className="flex items-center gap-4 mb-10 px-8">
              <div className="flex-1 h-px bg-gray-700" />
              <span className="font-mono text-[10px] tracking-widest text-gray-500">
                SPECIAL THANKS
              </span>
              <div className="flex-1 h-px bg-gray-700" />
            </div>
            <div className="space-y-6 text-center">
              {SPECIAL_THANKS.map((t, i) => (
                <p key={i} className="font-mono text-sm text-gray-300">
                  {t}
                </p>
              ))}
            </div>
          </div>

          {/* Footer message */}
          <div className="text-center py-20">
            <p className="font-mono text-xs text-gray-500 tracking-widest mb-4">
              © 2025 KELAS XII PPLG 3 · ALL MEMORIES RESERVED
            </p>
            <p
              className="font-mono text-lg text-yellow-400"
              style={{ textShadow: "0 0 16px rgba(251,191,36,0.5)" }}
            >
              Terima kasih sudah jadi bagian cerita ini.
            </p>
          </div>
        </div>
      </div>

      {/* Countdown + CTA */}
      {countActive && (
        <div className="relative z-20 max-w-xl mx-auto mt-8 text-center space-y-6 animate-fade-in">
          <div className="font-mono text-gray-400 text-sm tracking-widest">
            {!done ? (
              <>
                GAME OVER? Continue? [{countdown}...]
              </>
            ) : (
              <span className="text-yellow-400">TIME&apos;S UP!</span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleRestart}
              className="px-6 py-3 font-mono text-sm font-bold border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all tracking-widest"
            >
              ▶ MAIN LAGI DARI AWAL
            </button>
            <span className="font-mono text-xs text-gray-600">
              Sampai Jumpa di Level Berikutnya 👾
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
