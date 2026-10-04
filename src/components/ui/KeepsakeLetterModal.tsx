"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playSfx } from "@/lib/sound";
import { X, Mail, Heart, Sparkles, Code2, Users } from "lucide-react";

interface KeepsakeLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeepsakeLetterModal({ isOpen, onClose }: KeepsakeLetterModalProps) {
  const [stage, setStage] = useState<"envelope" | "opening" | "letter">("envelope");

  // Reset state when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setStage("envelope");
      playSfx("paper");
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        playSfx("click");
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleBreakSeal = () => {
    if (stage !== "envelope") return;
    playSfx("seal-break");
    setStage("opening");

    // Transition flap opening then unveil letter
    setTimeout(() => {
      playSfx("paper-slide");
      setStage("letter");
    }, 550);
  };

  const handleClose = () => {
    playSfx("paper");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              playSfx("click");
              onClose();
            }}
            className="fixed inset-0 bg-black/75 dark:bg-black/85 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Envelope Stage */}
          {(stage === "envelope" || stage === "opening") && (
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="relative z-10 w-full max-w-lg select-none perspective-[1200px]"
            >
              {/* Outer Quick Close Button */}
              <button
                type="button"
                onClick={() => {
                  playSfx("click");
                  onClose();
                }}
                className="absolute -top-11 right-0 sm:-right-2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                title="Tutup"
                aria-label="Tutup amplop surat"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Envelope Body (Vintage Kraft Paper) */}
              <div
                className="relative overflow-hidden rounded-xl border-2 border-amber-900/40 shadow-2xl p-6 sm:p-8 aspect-[1.45/1] flex flex-col justify-between"
                style={{
                  background: "linear-gradient(145deg, #d4954d 0%, #b87b38 50%, #9a6225 100%)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -2px 6px rgba(0, 0, 0, 0.4)",
                }}
              >
                {/* Kraft Paper Subtle Fiber Texture */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage: `radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.15) 1px, transparent 1px)`,
                    backgroundSize: "16px 16px, 12px 12px",
                    backgroundPosition: "0 0, 6px 6px",
                  }}
                />

                {/* Envelope Flap 3D Simulation */}
                <motion.div
                  aria-hidden="true"
                  initial={{ rotateX: 0 }}
                  animate={stage === "opening" ? { rotateX: -175, opacity: 0.3 } : { rotateX: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  style={{ transformOrigin: "top center" }}
                  className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none z-10"
                >
                  <div
                    className="w-full h-full border-b-2 border-amber-950/30"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      background: "linear-gradient(180deg, #c78942 0%, #ad702f 100%)",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                    }}
                  />
                </motion.div>

                {/* Diagonal Envelope Fold Creases */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none opacity-25"
                  style={{
                    background: "linear-gradient(to bottom right, transparent 49%, rgba(70,30,5,0.4) 50%, transparent 51%), linear-gradient(to bottom left, transparent 49%, rgba(70,30,5,0.4) 50%, transparent 51%)",
                  }}
                />

                {/* Top Section: Stamps & Cancellation Mark */}
                <div className="relative z-20 flex items-start justify-between">
                  {/* Left: Vintage Airmail / Priority Label */}
                  <div className="flex flex-col gap-1">
                    <div className="px-2.5 py-0.5 rounded border border-amber-950/40 bg-amber-100/90 text-amber-950 text-[10px] font-mono tracking-wider uppercase font-bold shadow-xs">
                      ✈ SURAT ISTIMEWA • KELAS XII
                    </div>
                    <div className="text-[11px] font-hand text-amber-950/80 font-bold tracking-wide">
                      Pos Kilat Kenangan
                    </div>
                  </div>

                  {/* Right: Retro Postage Stamps + Circular Postmark */}
                  <div className="flex items-center gap-2">
                    {/* Official Postmark Cancellation SVG */}
                    <div className="relative text-amber-950/80 select-none pointer-events-none">
                      <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-950/70 flex flex-col items-center justify-center p-1 rotate-[-12deg]">
                        <span className="text-[7px] font-mono font-bold tracking-tighter uppercase text-center leading-tight">
                          XII PPLG 3
                        </span>
                        <span className="text-[8px] font-bold tracking-wider my-0.5 text-center leading-none text-red-900">
                          OFFICIAL
                        </span>
                        <span className="text-[6px] font-mono tracking-tight text-center">
                          2024 • 2027
                        </span>
                      </div>
                      {/* Cancellation wavy lines */}
                      <svg
                        className="absolute -left-6 top-1/2 -translate-y-1/2 w-8 h-8 opacity-60 text-amber-950"
                        viewBox="0 0 50 40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M0 10 Q 12 5, 25 10 T 50 10" />
                        <path d="M0 20 Q 12 15, 25 20 T 50 20" />
                        <path d="M0 30 Q 12 25, 25 30 T 50 30" />
                      </svg>
                    </div>

                    {/* Retro Stamp */}
                    <div className="w-12 h-14 bg-amber-50 rounded border-2 border-dashed border-amber-800 p-1 flex flex-col items-center justify-between shadow-xs rotate-[4deg]">
                      <span className="text-[7px] font-mono font-bold text-amber-900 tracking-tighter">
                        INDONESIA
                      </span>
                      <Code2 className="w-5 h-5 text-amber-700" />
                      <span className="text-[8px] font-bold text-amber-950 font-mono">
                        Rp 3000
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center / Wax Seal Button */}
                <div className="relative z-30 flex flex-col items-center justify-center my-auto py-2">
                  <AnimatePresence>
                    {stage === "envelope" && (
                      <motion.button
                        type="button"
                        onClick={handleBreakSeal}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.94 }}
                        exit={{
                          scale: 0.2,
                          rotate: 80,
                          opacity: 0,
                          filter: "blur(4px)",
                          transition: { duration: 0.4 },
                        }}
                        className="group relative cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 rounded-full"
                        aria-label="Klik segel lilin merah untuk membuka surat kenangan"
                        title="Buka segel lilin"
                      >
                        {/* Wax Dripping Organic Rim */}
                        <div
                          className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1.5 flex items-center justify-center"
                          style={{
                            background: "radial-gradient(circle at 35% 30%, #ef4444 0%, #b91c1c 45%, #7f1d1d 80%, #450a0a 100%)",
                            boxShadow: "0 8px 24px rgba(69, 10, 10, 0.7), inset 0 2px 4px rgba(254, 202, 202, 0.4), inset 0 -3px 6px rgba(0, 0, 0, 0.6)",
                          }}
                        >
                          {/* Inner Seal Circle Relief */}
                          <div
                            className="w-full h-full rounded-full border border-red-400/40 flex flex-col items-center justify-center text-center p-1"
                            style={{
                              background: "radial-gradient(circle at 50% 45%, #991b1b, #7f1d1d 85%)",
                              boxShadow: "inset 0 2px 6px rgba(0,0,0,0.5), 0 1px 2px rgba(255,255,255,0.2)",
                            }}
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-200/90 mb-0.5" />
                            <span className="font-mono font-black text-[9px] sm:text-[10px] text-amber-100 tracking-wider leading-none drop-shadow">
                              XII PPLG 3
                            </span>
                            <span className="text-[7px] text-amber-300/80 font-mono tracking-tighter mt-0.5">
                              SEALED
                            </span>
                          </div>
                        </div>

                        {/* Interactive Wax Glow on Hover */}
                        <span className="absolute -inset-1 rounded-full bg-red-500/20 group-hover:bg-red-500/40 blur-md transition-all -z-10" />
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* Pulsing Helper Prompt */}
                  <motion.p
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="mt-3 text-xs sm:text-sm font-medium text-amber-100 drop-shadow-md text-center flex items-center justify-center gap-1.5"
                  >
                    <span>Klik segel lilin untuk membuka surat</span>
                    <Mail className="w-5 h-5 text-amber-200" />
                  </motion.p>
                </div>

                {/* Bottom Address / Recipient (Handwritten Style) */}
                <div className="relative z-20 flex justify-between items-end pt-1 border-t border-amber-950/20">
                  <div className="font-hand text-amber-950/90 leading-tight">
                    <p className="text-xs font-bold text-amber-950/60 uppercase font-mono tracking-wider">
                      Untuk Penerima:
                    </p>
                    <p className="text-base sm:text-lg font-bold">
                      Seluruh Sahabat & Saudara XII PPLG 3
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-amber-950/70 font-semibold text-right">
                    #TulalitForever
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Letter Stage (Full Unfolded Luxury View) */}
          {stage === "letter" && (
            <motion.div
              initial={{ scale: 0.75, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              className="relative z-20 w-full max-w-3xl my-auto select-text"
              role="dialog"
              aria-modal="true"
              aria-labelledby="keepsake-letter-title"
            >
              {/* Outer Close Button */}
              <button
                type="button"
                onClick={() => {
                  playSfx("click");
                  onClose();
                }}
                className="absolute -top-11 right-0 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                title="Tutup (ESC)"
                aria-label="Tutup surat"
              >
                <X className="w-5 h-5" />
              </button>

              {/* The Unfolded Paper Card */}
              <div
                className="relative rounded-2xl bg-[#FFFDF8] dark:bg-slate-900 border-2 border-amber-800/25 dark:border-amber-500/25 shadow-2xl p-6 sm:p-8 md:p-10 max-h-[88vh] overflow-y-auto"
                style={{
                  boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(217, 119, 6, 0.15)",
                }}
              >
                {/* Vintage Letterhead Paper Crease Line */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-8 top-1/3 h-px border-b border-dashed border-amber-900/10 dark:border-white/5 pointer-events-none"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-8 top-2/3 h-px border-b border-dashed border-amber-900/10 dark:border-white/5 pointer-events-none"
                />

                {/* Letter Header Ribbon */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-amber-900/15 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                    <span className="text-xs font-mono font-bold tracking-widest uppercase text-amber-800 dark:text-amber-400">
                      LEMBAR MEMORI KELAS • XII PPLG 3
                    </span>
                  </div>
                  <div className="text-xs font-mono text-ink-muted dark:text-gray-400">
                    Angkatan 2024 — 2027
                  </div>
                </div>

                {/* Main Content Grid: Left Polaroid + Right Touching Letter */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Memory Polaroid */}
                  <div className="md:col-span-5 flex flex-col items-center">
                    <div className="relative group w-full max-w-[270px] bg-white dark:bg-slate-800 p-3 pb-5 shadow-xl rounded-sm border border-black/10 dark:border-white/10 rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
                      {/* Washi Tape on top left corner */}
                      <div
                        aria-hidden="true"
                        className="tape tape-mustard absolute -top-3 left-4 w-16 -rotate-6 z-20"
                      />

                      {/* Photo Artwork / Classroom Illustration */}
                      <div className="relative aspect-[4/3] rounded-xs overflow-hidden bg-gradient-to-tr from-slate-900 via-indigo-950 to-amber-950 border border-black/15 flex flex-col items-center justify-center p-3 text-center">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-radial from-amber-500/15 via-transparent to-black/60 pointer-events-none" />

                        {/* Silhouette / Developer Classroom Scene */}
                        <div className="relative z-10 flex flex-col items-center gap-1.5 text-white">
                          <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
                            <Users className="w-6 h-6" />
                          </div>
                          <div className="font-mono text-[10px] text-emerald-400 bg-slate-900/80 px-2 py-0.5 rounded border border-emerald-500/30">
                            git commit -m &quot;we made history&quot;
                          </div>
                          <div className="text-xs font-bold text-amber-100 flex items-center gap-1 mt-0.5">
                            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500 inline" />
                            <span>XII PPLG 3 Family</span>
                          </div>
                        </div>

                        {/* Photo Vignette */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
                      </div>

                      {/* Polaroid Caption Strip */}
                      <div className="mt-3 px-1 text-center">
                        <p className="font-hand font-bold text-lg text-ink-navy dark:text-white leading-tight">
                          XII PPLG 3 • Selamanya Bersaudara
                        </p>
                        <p className="font-mono text-[10px] text-ink-muted dark:text-gray-400 mt-0.5">
                          Angkatan 2024-2027
                        </p>
                      </div>
                    </div>

                    <p className="text-[11px] font-hand text-ink-muted dark:text-gray-400 text-center mt-3">
                      &quot;Setiap baris kode punya kenangan, setiap tawa punya arti.&quot;
                    </p>
                  </div>

                  {/* Right Column: Warm Memorial Letter */}
                  <div className="md:col-span-7 flex flex-col">
                    <h3
                      id="keepsake-letter-title"
                      className="font-sans font-extrabold text-xl sm:text-2xl text-ink-navy dark:text-amber-100 leading-snug mb-4"
                    >
                      Untuk Sahabat-Sahabat Hebatku di XII PPLG 3,
                    </h3>

                    <div className="space-y-4 text-sm sm:text-base leading-relaxed text-ink-navy/90 dark:text-gray-300">
                      <p>
                        Terima kasih untuk tiga tahun yang penuh tawa, canda, dan perjuangan bersama. Dari awal kita canggung belajar baris kode, begadang bareng ngerjain tugas sampai subuh, tawa di jam kosong, hingga rebutan gorengan kantin yang selalu kita rindukan.
                      </p>
                      <p>
                        Kini saatnya kita melangkah ke jalan masing-masing. Ingatlah bahwa di sudut kelas ini, kita pernah bermimpi dan berjuang bersama.
                      </p>
                      <p className="font-medium text-amber-900 dark:text-amber-300">
                        Sukses selalu untuk kalian semua, sampai jumpa di puncak kejayaan!
                      </p>
                    </div>

                    {/* Handwriting Signature */}
                    <div className="mt-6 pt-4 border-t border-amber-900/15 dark:border-white/10 text-right">
                      <p className="font-hand text-2xl sm:text-3xl font-bold text-amber-700 dark:text-amber-400 tracking-wide">
                        — Keluarga Besar XII PPLG 3
                      </p>
                      <p className="text-[11px] font-mono text-ink-muted dark:text-gray-400 mt-1">
                        Disimpan abadi di relung hati & kenangan masa sekolah.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="mt-8 pt-5 border-t border-amber-900/15 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-ink-muted dark:text-gray-400">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Scrapbook Surat Resmi • XII PPLG 3</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Lipat & Tutup Surat</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
