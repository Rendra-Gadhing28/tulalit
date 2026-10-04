"use client";

import React, { useState, useEffect, useRef } from "react";
import timelineData from "@/data/timeline.json";
import type { TimelineItem } from "@/types";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Polaroid } from "@/components/ui/Polaroid";
import { ScrapbookSlot } from "@/components/custom/ScrapbookSlot";
import { CustomDecorationsMount } from "@/components/custom/CustomDecorations";
import { playSfx } from "@/lib/sound";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { CalendarDays, Tag, X, Milestone } from "lucide-react";

function TimelineCard({ item, index, onOpen }: { item: TimelineItem; index: number; onOpen: (item: TimelineItem) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-40, 40], [6, -6]), { stiffness: 160, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-40, 40], [-5, 5]), { stiffness: 160, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const isRelease = item.tag === "Wisuda";

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, x: -32 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.07, type: "spring", stiffness: 120, damping: 18 }}
    >
      {/* Commit Node Circle */}
      <motion.div
        aria-hidden="true"
        className={`absolute -left-[31px] md:-left-[47px] top-3 w-5 h-5 md:w-7 md:h-7 rounded-full border-2 border-paper-base dark:border-darkbg-base flex items-center justify-center ${
          isRelease ? "bg-accent-coral" : "bg-accent-mustard"
        }`}
        animate={{ scale: [1, 1.25, 1] }}
        transition={{ repeat: Infinity, duration: isRelease ? 1.4 : 2.2, ease: "easeInOut" }}
      >
        <Milestone className="w-2.5 h-2.5 md:w-3 md:h-3 text-ink-navy" />
      </motion.div>

      {/* Connecting pulse line dot */}
      <motion.div
        aria-hidden="true"
        className="absolute -left-[28px] md:-left-[44px] top-10 w-1.5 h-1.5 rounded-full bg-accent-mustard/60"
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
        transition={{ repeat: Infinity, duration: 1.8 + index * 0.2, ease: "easeInOut" }}
      />

      {/* Card with 3D tilt */}
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", borderRadius: "2px" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
        role="button"
        tabIndex={0}
        onClick={() => onOpen(item)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen(item);
          }
        }}
        className="cursor-pointer bg-paper-light dark:bg-darkbg-card p-5 md:p-6 border border-paper-lines dark:border-darkbg-border shadow-scrapbook hover:shadow-xl paper-texture focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-coral"
      >
        {/* Meta Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-900 dark:bg-slate-950 text-emerald-400 font-bold" style={{ borderRadius: "2px" }}>
              {item.hash}
            </span>
            <span className="inline-flex items-center gap-1 text-ink-muted">
              <Tag className="w-3 h-3" />
              {item.tag}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-ink-muted">
            <CalendarDays className="w-3.5 h-3.5" />
            {item.date}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-mono font-bold text-sm md:text-base text-ink-navy dark:text-white group-hover:text-accent-coral transition-colors leading-snug">
          {item.title}
        </h3>

        {/* Story snippet */}
        <p className="mt-2 font-sans text-sm text-ink-brown dark:text-gray-300 line-clamp-2 leading-relaxed">
          {item.story}
        </p>

        <div className="mt-3 flex items-center justify-between pt-2 border-t border-paper-lines dark:border-white/10 text-xs font-mono text-accent-coral">
          <span>Lihat arsip &amp; cerita &rarr;</span>
          <span className="text-ink-muted">#{String(index + 1).padStart(2, "0")}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function TimelineSection() {
  const [selectedCommit, setSelectedCommit] = useState<TimelineItem | null>(null);

  const handleOpenDetail = (item: TimelineItem) => {
    playSfx("click");
    setSelectedCommit(item);
  };

  const handleCloseDetail = () => {
    playSfx("click");
    setSelectedCommit(null);
  };

  useEffect(() => {
    if (!selectedCommit) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseDetail();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCommit]);

  return (
    <section
      id="timeline"
      className="relative py-16 md:py-24 px-4 md:px-8 max-w-5xl mx-auto overflow-hidden"
    >
      <CustomDecorationsMount section="timeline" />

      <SectionTitle
        badge="Jejak Perjalanan"
        title="Timeline Kenangan Kita"
        subtitle="Dari hari pertama masuk sampai detik perpisahan—setiap momen tersimpan rapi di sini."
      />

      {/* Commit Tree Container */}
      <div
        className="relative mt-12 pl-6 md:pl-10 space-y-10"
        style={{ borderLeft: "2px dashed rgba(244,185,66,0.45)" }}
      >
        {timelineData.map((item, index) => (
          <TimelineCard
            key={item.id}
            item={item as TimelineItem}
            index={index}
            onOpen={handleOpenDetail}
          />
        ))}
      </div>

      {/* Modal Detail */}
      <AnimatePresence>
        {selectedCommit && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="timeline-modal-title"
            onClick={handleCloseDetail}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.85, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative w-full max-w-lg bg-paper-light dark:bg-darkbg-card rounded-2xl border-4 border-paper-lines dark:border-darkbg-border shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <motion.button
                type="button"
                onClick={handleCloseDetail}
                whileHover={{ scale: 1.1, rotate: 90 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="absolute top-4 right-4 p-2 rounded-full bg-paper-base dark:bg-darkbg-base text-ink-navy dark:text-white border border-paper-lines"
                aria-label="Tutup detail"
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Modal Header */}
              <div className="flex items-center gap-2 font-mono text-xs text-accent-terminal mb-2">
                <span className="px-2 py-0.5 rounded bg-slate-900 font-bold">
                  {selectedCommit.hash}
                </span>
                <span className="text-ink-muted">• {selectedCommit.date}</span>
              </div>

              <h3 id="timeline-modal-title" className="font-mono font-bold text-xl text-ink-navy dark:text-white mb-4">
                {selectedCommit.title}
              </h3>

              {/* Photo Polaroid */}
              {selectedCommit.photos && selectedCommit.photos[0] && (
                <div className="my-4 flex justify-center">
                  <Polaroid
                    id={`detail-${selectedCommit.id}`}
                    src={selectedCommit.photos[0]}
                    caption={selectedCommit.tag}
                    date={selectedCommit.date}
                    aspect="landscape"
                    className="w-full max-w-sm pointer-events-none"
                  />
                </div>
              )}

              {/* Full Story */}
              <div className="p-4 rounded-xl bg-paper-base dark:bg-darkbg-base border border-paper-lines dark:border-darkbg-border">
                <p className="font-sans text-sm md:text-base text-ink-navy dark:text-gray-200 leading-relaxed whitespace-pre-line">
                  {selectedCommit.story}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reserved Slot */}
      <ScrapbookSlot id="timeline-custom-slot" hint="Ruang Kosong untuk Catatan Milestone Tambahanmu" />
    </section>
  );
}
