"use client";

import React, { useState, useCallback } from "react";
import quotesData from "@/data/quotes.json";
import memesData from "@/data/memes.json";
import type { QuoteItem, MemeItem } from "@/types";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StickyNote } from "@/components/ui/StickyNote";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { ScrapbookSlot } from "@/components/custom/ScrapbookSlot";
import { CustomDecorationsMount } from "@/components/custom/CustomDecorations";
import { playSfx } from "@/lib/sound";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Dices, Heart } from "lucide-react";

interface HeartParticle {
  id: number;
  x: number;
  y: number;
}

let heartIdCounter = 0;

export function QuotesMemesSection() {
  const [activeQuote, setActiveQuote] = useState<QuoteItem | null>(null);
  const [isGachaSpinning, setIsGachaSpinning] = useState(false);
  const [memeLikes, setMemeLikes] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    (memesData as MemeItem[]).forEach((m) => {
      initial[m.id] = m.initialLikes;
    });
    return initial;
  });
  const [heartParticles, setHeartParticles] = useState<Record<string, HeartParticle[]>>({});

  const handleGacha = () => {
    playSfx("gacha");
    setIsGachaSpinning(true);
    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * quotesData.length);
      setActiveQuote((quotesData as QuoteItem[])[randomIdx] || null);
      setIsGachaSpinning(false);
      playSfx("pop");
    }, 700);
  };

  const handleLikeMeme = useCallback((memeId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    playSfx("pop");
    setMemeLikes((prev) => ({
      ...prev,
      [memeId]: (prev[memeId] || 0) + 1,
    }));

    // Spawn heart particles at click position
    const rect = e.currentTarget.getBoundingClientRect();
    const count = 6;
    const newParticles: HeartParticle[] = Array.from({ length: count }, () => ({
      id: heartIdCounter++,
      x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 40,
      y: rect.top + rect.height / 2,
    }));

    setHeartParticles((prev) => ({
      ...prev,
      [memeId]: [...(prev[memeId] || []), ...newParticles],
    }));

    // Clean up after animation
    setTimeout(() => {
      setHeartParticles((prev) => ({
        ...prev,
        [memeId]: (prev[memeId] || []).filter(
          (p) => !newParticles.find((np) => np.id === p.id)
        ),
      }));
    }, 900);
  }, []);

  return (
    <section
      id="quotes"
      className="relative py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <CustomDecorationsMount section="quotes" />

      <SectionTitle
        badge="Humor & Nostalgia"
        title="Dinding Quote & Meme Tulalit"
        subtitle="Kumpulan quote andalan warga kelas dan meme legendaris yang selalu mewarnai hari-hari di sekolah."
      />

      {/* Mesin Gacha Quote Acak */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        className="mb-14 max-w-xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 dark:from-darkbg-card dark:via-darkbg-base dark:to-darkbg-card border-4 border-accent-mustard shadow-xl text-center select-none"
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-mustard text-ink-navy text-xs font-mono font-bold mb-3"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Mesin Gacha Quote
        </motion.div>

        <h3 className="font-hand text-3xl font-bold text-ink-navy dark:text-white">
          Tarik Tuas Kapsul Keberuntungan
        </h3>

        <div className="my-4 min-h-[100px] flex items-center justify-center">
          {isGachaSpinning ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
              className="font-mono text-sm text-accent-coral flex items-center gap-2"
            >
              <Dices className="w-5 h-5" />
              Mengocok kapsul memori...
            </motion.div>
          ) : activeQuote ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeQuote.id}
                initial={{ scale: 0.7, opacity: 0, rotate: -4 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="p-4 rounded-xl bg-white dark:bg-darkbg-card border-2 border-paper-lines shadow-sm max-w-md"
              >
                <p className="font-hand text-xl md:text-2xl text-ink-brown dark:text-gray-100 font-bold leading-snug">
                  &ldquo;{activeQuote.quote}&rdquo;
                </p>
                <span className="block font-mono text-xs text-accent-coral font-bold mt-2">
                  — {activeQuote.author} ({activeQuote.role})
                </span>
              </motion.div>
            </AnimatePresence>
          ) : (
            <p className="font-sans text-sm text-ink-muted italic">
              Klik tombol di bawah untuk mengeluarkan quote acak siswa!
            </p>
          )}
        </div>

        <motion.button
          type="button"
          onClick={handleGacha}
          disabled={isGachaSpinning}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.93 }}
          animate={isGachaSpinning ? {} : { y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="px-6 py-2.5 rounded-full bg-accent-mustard hover:bg-amber-400 text-ink-navy font-bold font-mono text-sm shadow-md disabled:opacity-50"
        >
          {isGachaSpinning ? "Memutar..." : "🎰 Tarik Tuas Quote"}
        </motion.button>
      </motion.div>

      {/* Dinding Sticky Notes Quotes */}
      <h3 className="font-hand text-3xl font-bold text-ink-navy dark:text-white mb-6 text-center">
        Dinding Catatan Tempel
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(quotesData as QuoteItem[]).map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 24, rotate: (i % 3 === 0 ? -2 : i % 3 === 1 ? 1.5 : -1) }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: (i % 4) * 0.08, type: "spring", stiffness: 130, damping: 16 }}
            whileHover={{ scale: 1.04, rotate: 0, zIndex: 10 }}
          >
            <StickyNote id={q.id} color={q.color}>
              <p className="font-hand text-xl md:text-2xl text-ink-navy dark:text-gray-900 leading-snug">
                &ldquo;{q.quote}&rdquo;
              </p>
              <div className="mt-3 pt-2 border-t border-black/10 flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-ink-brown">{q.author}</span>
                <span className="text-[10px] text-ink-muted">{q.role}</span>
              </div>
            </StickyNote>
          </motion.div>
        ))}
      </div>

      {/* Galeri Meme Kelas */}
      <div className="mt-16">
        <h3 className="font-hand text-3xl font-bold text-ink-navy dark:text-white mb-6 text-center">
          Meme Arsip Legendaris
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(memesData as MemeItem[]).map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: (i % 3) * 0.1, type: "spring", stiffness: 120, damping: 16 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-paper-light dark:bg-darkbg-card p-4 rounded-xl border-2 border-paper-lines dark:border-darkbg-border shadow-scrapbook flex flex-col justify-between"
            >
              <div>
                <motion.div
                  className="relative aspect-[4/3] rounded-lg overflow-hidden border border-paper-lines mb-3"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <ImagePlaceholder label={m.title} category="Meme" aspect="landscape" />
                </motion.div>
                <h4 className="font-sans font-bold text-base text-ink-navy dark:text-white">
                  {m.title}
                </h4>
                <p className="font-sans text-xs text-ink-muted mt-1 leading-relaxed">
                  {m.caption}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-paper-lines dark:border-white/10 flex items-center justify-between relative">
                <div className="relative">
                  <motion.button
                    type="button"
                    onClick={(e) => handleLikeMeme(m.id, e)}
                    whileTap={{ scale: 0.85 }}
                    whileHover={{ scale: 1.08 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-mono text-xs font-bold border border-rose-200"
                  >
                    <motion.div
                      animate={
                        (memeLikes[m.id] || 0) > (memesData as MemeItem[]).find((x) => x.id === m.id)!.initialLikes
                          ? { scale: [1, 1.5, 1] }
                          : {}
                      }
                      transition={{ duration: 0.3 }}
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </motion.div>
                    <span>{memeLikes[m.id] || 0} Ngakak</span>
                  </motion.button>

                  {/* Heart burst particles */}
                  <AnimatePresence>
                    {(heartParticles[m.id] || []).map((p) => (
                      <motion.div
                        key={p.id}
                        className="fixed pointer-events-none z-50 text-rose-500 text-base select-none"
                        style={{ left: p.x, top: p.y }}
                        initial={{ opacity: 1, scale: 0.5, y: 0 }}
                        animate={{
                          opacity: 0,
                          scale: 1.4,
                          y: -48 - Math.random() * 32,
                          x: (Math.random() - 0.5) * 60,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.75, ease: "easeOut" }}
                      >
                        ❤️
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <span className="font-mono text-[10px] text-ink-muted">#TulalitMemes</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Reserved Slot Ruang Kosong */}
      <ScrapbookSlot id="quotes-custom-slot" hint="Ruang Kosong untuk Catatan / Meme Tambahanmu" />
    </section>
  );
}
