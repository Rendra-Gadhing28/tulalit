"use client";

import React, { useState, useMemo } from "react";
import dictionaryData from "@/data/dictionary.json";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ScrapbookSlot } from "@/components/custom/ScrapbookSlot";
import { Search, BookOpen } from "lucide-react";

interface DictEntry {
  id: string;
  word: string;
  phonetic: string;
  type: string;
  definition: string;
  example: string;
  emoji: string;
}

export function KamusTulalitSection() {
  const [query, setQuery] = useState("");

  const entries = dictionaryData as DictEntry[];

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.word.toLowerCase().includes(q) ||
        e.definition.toLowerCase().includes(q)
    );
  }, [query, entries]);

  return (
    <section
      id="kamus"
      className="relative py-16 md:py-24 px-4 md:px-8 max-w-5xl mx-auto overflow-hidden"
    >
      <SectionTitle
        badge="Kamus Kelas"
        title="Kamus Besar Bahasa Tulalit"
        subtitle="Kumpulan istilah internal, jargon lab, dan kata mutiara yang cuma dipahami anak kelas."
      />

      {/* Search Input */}
      <div className="relative max-w-md mx-auto mb-10">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
        <input
          type="text"
          aria-label="Cari istilah kelas"
          placeholder="Cari istilah kelas..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-none border-2 border-ink-navy dark:border-darkbg-border bg-paper-base dark:bg-darkbg-card text-ink-navy dark:text-white font-mono text-sm placeholder:text-ink-muted focus:outline-none focus:border-accent-mustard transition-colors shadow-inner"
        />
      </div>

      {/* Dictionary Cards */}
      <div className="space-y-5">
        {filtered.length === 0 && (
          <div className="text-center py-16 font-mono text-ink-muted">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Kata &ldquo;{query}&rdquo; tidak ditemukan di kamus kelas.</p>
          </div>
        )}

        {filtered.map((entry, idx) => (
          <div
            key={entry.id}
            className="relative bg-[#FFFDF6] dark:bg-darkbg-card border border-[#D4CAAA] dark:border-darkbg-border shadow-scrapbook"
            style={{ transform: `rotate(${idx % 2 === 0 ? "-0.3" : "0.3"}deg)` }}
          >
            {/* Top ruled line decoration */}
            <div className="h-1.5 bg-accent-mustard/40 border-b border-accent-mustard/60" />

            <div className="px-6 py-5 md:px-8 md:py-6">
              {/* Word header row */}
              <div className="flex flex-wrap items-baseline gap-3 mb-2">
                <span className="font-mono text-2xl md:text-3xl font-bold text-ink-navy dark:text-white tracking-tight">
                  {entry.emoji} {entry.word}
                </span>
                <span className="font-mono text-sm text-accent-coral bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 px-2 py-0.5 rounded-sm">
                  {entry.phonetic}
                </span>
                <span className="font-mono text-xs text-accent-mustard bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 px-2 py-0.5 rounded-sm italic">
                  {entry.type}
                </span>
              </div>

              {/* Ruled lines background simulation */}
              <div className="border-t border-dashed border-[#C9C1A8] dark:border-darkbg-border pt-3 mt-3">
                <p className="font-mono text-base text-ink-brown dark:text-gray-200 leading-relaxed mb-3">
                  {entry.definition}
                </p>
                <p className="font-hand text-lg text-ink-muted dark:text-gray-400 leading-snug pl-3 border-l-2 border-accent-mustard/60 italic">
                  {entry.example}
                </p>
              </div>
            </div>

            {/* Page corner fold */}
            <div
              className="absolute bottom-0 right-0 w-6 h-6"
              style={{
                background: "linear-gradient(225deg, #E5DEC9 50%, transparent 50%)",
              }}
            />
          </div>
        ))}
      </div>

      <ScrapbookSlot id="kamus-slot" hint="Ruang untuk Tambah Kata Baru" />
    </section>
  );
}
