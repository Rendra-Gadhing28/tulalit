"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import galleryData from "@/data/gallery.json";
import type { GalleryItem, GalleryCategory } from "@/types";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Polaroid } from "@/components/ui/Polaroid";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { ScrapbookSlot } from "@/components/custom/ScrapbookSlot";
import { CustomDecorationsMount } from "@/components/custom/CustomDecorations";
import { playSfx } from "@/lib/sound";
import { springPresets } from "@/lib/motion";
import { X, ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { ScrollStaggerItem } from "@/components/ui/ScrollReveal";

const CATEGORIES: GalleryCategory[] = [
  "Semua",
  "Kelas",
  "PKL",
  "Study Tour",
  "Lomba",
  "Candid",
  "Praktikum",
];

export function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>("Semua");
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const filteredItems: GalleryItem[] =
    selectedCategory === "Semua"
      ? (galleryData as GalleryItem[])
      : (galleryData as GalleryItem[]).filter(
          (item) => item.category === selectedCategory
        );

  const handleOpenLightbox = (index: number) => {
    playSfx("camera-shutter");
    setActiveLightboxIndex(index);
    try {
      const stored = localStorage.getItem("tulalit_unlocked_achievements");
      const parsed = stored ? JSON.parse(stored) : {};
      if (!parsed["photo_detective"]) {
        parsed["photo_detective"] = new Date().toISOString();
        localStorage.setItem("tulalit_unlocked_achievements", JSON.stringify(parsed));
      }
    } catch {}
  };

  const handleCloseLightbox = () => {
    playSfx("click");
    setActiveLightboxIndex(null);
  };

  const handleNext = useCallback(() => {
    if (activeLightboxIndex === null) return;
    playSfx("paper-slide");
    setActiveLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % filteredItems.length : null
    );
  }, [activeLightboxIndex, filteredItems.length]);

  const handlePrev = useCallback(() => {
    if (activeLightboxIndex === null) return;
    playSfx("paper-slide");
    setActiveLightboxIndex((prev) =>
      prev !== null
        ? (prev - 1 + filteredItems.length) % filteredItems.length
        : null
    );
  }, [activeLightboxIndex, filteredItems.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activeLightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseLightbox();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLightboxIndex, handleNext, handlePrev]);

  const currentItem =
    activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  return (
    <section
      id="gallery"
      className="relative py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <CustomDecorationsMount section="gallery" />

      <SectionTitle
        badge="Galeri Scrapbook"
        title="Album Foto Polaroid"
        subtitle="Potret candid, momen lomba, keseruan study tour, dan rutinitas praktikum selama 3 tahun."
      />

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-2xl mx-auto">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                playSfx("click");
                setSelectedCategory(cat);
              }}
              className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all ${
                isActive
                  ? "bg-accent-coral text-white shadow-md scale-105"
                  : "bg-paper-light dark:bg-darkbg-card text-ink-muted dark:text-gray-400 border border-paper-lines hover:text-ink-navy dark:hover:text-white"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Masonry Polaroid Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {filteredItems.map((item, idx) => (
          <ScrollStaggerItem key={item.id} index={idx} columns={3} className="break-inside-avoid">
            <Polaroid
              id={item.id}
              src={item.src}
              caption={item.caption}
              date={item.date}
              category={item.category}
              aspect={item.aspect || "square"}
              onClick={() => handleOpenLightbox(idx)}
            />
          </ScrollStaggerItem>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal with Spring Physics */}
      <AnimatePresence>
        {currentItem && (
          <motion.div
            key="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={handleCloseLightbox}
          >
            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{
                scale: 1,
                y: 0,
                opacity: 1,
                transition: springPresets.modalBounce,
              }}
              exit={{ scale: 0.92, y: 15, opacity: 0 }}
              className="relative max-w-4xl w-full bg-paper-light dark:bg-darkbg-card rounded-2xl p-4 md:p-6 shadow-2xl border-4 border-paper-lines dark:border-darkbg-border flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Bar: Counter & Close */}
              <div className="w-full flex items-center justify-between pb-3 border-b border-paper-lines dark:border-white/10 mb-4">
                <span className="font-mono text-xs text-ink-muted">
                  Foto {activeLightboxIndex! + 1} dari {filteredItems.length}
                </span>
                <button
                  type="button"
                  onClick={handleCloseLightbox}
                  className="p-1.5 rounded-full bg-paper-base dark:bg-darkbg-base text-ink-navy dark:text-white border border-paper-lines hover:scale-110 transition-transform active:scale-95"
                  aria-label="Tutup lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Photo Big Display with Darkroom Reveal simulation */}
              <div className="relative w-full max-h-[60vh] aspect-[4/3] rounded-lg overflow-hidden bg-black/10 dark:bg-black/40 flex items-center justify-center shadow-inner">
                {currentItem.src ? (
                  <motion.div
                    key={currentItem.src}
                    initial={{ filter: "brightness(0.5) sepia(0.6)", opacity: 0.8 }}
                    animate={{ filter: "brightness(1) sepia(0)", opacity: 1 }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={currentItem.src}
                      alt={currentItem.caption}
                      fill
                      sizes="1000px"
                      className="object-contain"
                    />
                  </motion.div>
                ) : (
                  <ImagePlaceholder
                    label={currentItem.caption}
                    category={currentItem.category}
                    aspect="landscape"
                  />
                )}
              </div>

              {/* Caption & Category */}
              <div className="mt-4 text-center max-w-xl">
                <p className="font-hand text-2xl md:text-3xl text-ink-navy dark:text-white font-bold leading-snug">
                  {currentItem.caption}
                </p>
                <div className="mt-2 flex items-center justify-center gap-2 font-mono text-xs text-ink-muted">
                  <span className="inline-flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    {currentItem.category}
                  </span>
                  <span>•</span>
                  <span>{currentItem.date}</span>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-paper-light dark:bg-darkbg-card text-ink-navy dark:text-white shadow-xl hover:scale-110 active:scale-95 transition-transform"
                aria-label="Foto sebelumnya"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 md:-right-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-paper-light dark:bg-darkbg-card text-ink-navy dark:text-white shadow-xl hover:scale-110 active:scale-95 transition-transform"
                aria-label="Foto berikutnya"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reserved Slot Ruang Kosong */}
      <ScrapbookSlot id="gallery-custom-slot" hint="Ruang Kosong untuk Tambahan Foto Pribadi Kamu" />
    </section>
  );
}
