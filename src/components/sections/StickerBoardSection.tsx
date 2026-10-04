"use client";

import React, { useState, useEffect, useRef } from "react";
import { stickersRegistry, type StickerDefinition } from "@/data/stickers";
import type { StickerBoardElement } from "@/types";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Sticker } from "@/components/ui/Sticker";
import { ScrapbookSlot } from "@/components/custom/ScrapbookSlot";
import { playSfx } from "@/lib/sound";
import { Download, Trash2, RotateCcw, Plus, Layers } from "lucide-react";

const STORAGE_KEY_BOARD = "tulalit_sticker_board_state";

export function StickerBoardSection() {
  const [boardStickers, setBoardStickers] = useState<StickerBoardElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("dev");
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const boardRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BOARD);
      if (stored) {
        setBoardStickers(JSON.parse(stored));
      } else {
        // Initial stickers on cork board
        setBoardStickers([
          { id: "sb-1", stickerId: "sekolah-toga", x: 120, y: 80, rotation: -6, scale: 1.1, zIndex: 1 },
          { id: "sb-2", stickerId: "dev-code-tag", x: 260, y: 140, rotation: 8, scale: 1, zIndex: 2 },
          { id: "sb-3", stickerId: "ekspresi-siput", x: 420, y: 90, rotation: -4, scale: 1.2, zIndex: 3 },
          { id: "sb-4", stickerId: "gim-controller", x: 160, y: 220, rotation: 12, scale: 1, zIndex: 4 },
        ]);
      }
    } catch {}
  }, []);

  // Save to localStorage
  const saveToStorage = (updated: StickerBoardElement[]) => {
    setBoardStickers(updated);
    try {
      localStorage.setItem(STORAGE_KEY_BOARD, JSON.stringify(updated));
    } catch {}
  };

  const addStickerToBoard = (stickerDef: StickerDefinition) => {
    if (boardStickers.length >= 40) {
      alert("Papan gabus sudah penuh! Hapus beberapa stiker terlebih dahulu.");
      return;
    }

    playSfx("pop");
    const nextZ = Math.max(0, ...boardStickers.map((s) => s.zIndex)) + 1;
    const newElement: StickerBoardElement = {
      id: `board-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      stickerId: stickerDef.id,
      x: 80 + Math.random() * 200,
      y: 60 + Math.random() * 150,
      rotation: Math.round((Math.random() - 0.5) * 20),
      scale: 1,
      zIndex: nextZ,
    };

    const next = [...boardStickers, newElement];
    saveToStorage(next);
    setSelectedElementId(newElement.id);
  };

  const removeSelected = () => {
    if (!selectedElementId) return;
    playSfx("click");
    const next = boardStickers.filter((s) => s.id !== selectedElementId);
    saveToStorage(next);
    setSelectedElementId(null);
  };

  const resetBoard = () => {
    playSfx("click");
    if (confirm("Reset seluruh stiker di papan gabus?")) {
      saveToStorage([]);
      setSelectedElementId(null);
    }
  };

  const exportPng = async () => {
    if (!boardRef.current || isExporting) return;
    try {
      setIsExporting(true);
      playSfx("click");
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(boardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const a = document.createElement("a");
      a.download = "papan-stiker-xiipplg3.png";
      a.href = dataUrl;
      a.click();
    } catch (err) {
      console.error("Gagal mengekspor papan:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // Pointer Drag Handler
  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    setSelectedElementId(id);

    // Bring to front
    const maxZ = Math.max(0, ...boardStickers.map((s) => s.zIndex)) + 1;
    const target = boardStickers.find((s) => s.id === id);
    if (!target) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const origX = target.x;
    const origY = target.y;

    const handlePointerMove = (moveEvt: PointerEvent) => {
      const dx = moveEvt.clientX - startX;
      const dy = moveEvt.clientY - startY;

      setBoardStickers((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, x: Math.max(0, origX + dx), y: Math.max(0, origY + dy), zIndex: maxZ }
            : item
        )
      );
    };

    const handlePointerUp = () => {
      playSfx("pop");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      // Persist latest state
      setBoardStickers((curr) => {
        saveToStorage(curr);
        return curr;
      });
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
  };

  const rotateSelected = (delta: number) => {
    if (!selectedElementId) return;
    playSfx("click");
    const updated = boardStickers.map((s) =>
      s.id === selectedElementId ? { ...s, rotation: s.rotation + delta } : s
    );
    saveToStorage(updated);
  };

  const scaleSelected = (delta: number) => {
    if (!selectedElementId) return;
    playSfx("click");
    const updated = boardStickers.map((s) =>
      s.id === selectedElementId
        ? { ...s, scale: Math.max(0.6, Math.min(2.0, s.scale + delta)) }
        : s
    );
    saveToStorage(updated);
  };

  const categories = [
    { id: "dev", label: "Developer" },
    { id: "gim", label: "Gim" },
    { id: "sekolah", label: "Sekolah" },
    { id: "momen", label: "Momen" },
    { id: "ekspresi", label: "Ekspresi" },
  ];

  const currentCategoryStickers = stickersRegistry.filter(
    (s) => s.category === activeCategory
  );

  return (
    <section
      id="stickers"
      className="relative py-16 md:py-24 px-4 md:px-8 max-w-6xl mx-auto overflow-hidden"
    >
      <SectionTitle
        badge="Sticker Board"
        title="Papan Gabus Stiker Bebas"
        subtitle="Hias papan gabus kelas sesukamu! Pilih dari 30+ stiker die-cut, seret, putar, dan unduh kreasimu menjadi file gambar PNG."
      />

      {/* Board Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-paper-light dark:bg-darkbg-card p-3 rounded-xl border border-paper-lines shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportPng}
            disabled={isExporting}
            className="px-3.5 py-1.5 rounded-lg bg-accent-coral text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-rose-500 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            {isExporting ? "Menyimpan..." : "Unduh Gambar PNG"}
          </button>

          <button
            type="button"
            onClick={resetBoard}
            className="px-3 py-1.5 rounded-lg bg-paper-base dark:bg-darkbg-base text-ink-muted border border-paper-lines font-mono text-xs hover:text-ink-navy flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        {/* Selected Controls */}
        {selectedElementId && (
          <div className="flex items-center gap-2 animate-fade-in text-xs font-mono">
            <span className="text-ink-muted">Edit Stiker:</span>
            <button
              type="button"
              onClick={() => rotateSelected(-15)}
              className="px-2 py-1 rounded bg-paper-base dark:bg-darkbg-base border border-paper-lines"
              title="Putar ke kiri"
            >
              ⟲ -15°
            </button>
            <button
              type="button"
              onClick={() => rotateSelected(15)}
              className="px-2 py-1 rounded bg-paper-base dark:bg-darkbg-base border border-paper-lines"
              title="Putar ke kanan"
            >
              ⟳ +15°
            </button>
            <button
              type="button"
              onClick={() => scaleSelected(-0.15)}
              className="px-2 py-1 rounded bg-paper-base dark:bg-darkbg-base border border-paper-lines font-bold"
              title="Perkecil"
            >
              -
            </button>
            <button
              type="button"
              onClick={() => scaleSelected(0.15)}
              className="px-2 py-1 rounded bg-paper-base dark:bg-darkbg-base border border-paper-lines font-bold"
              title="Perbesar"
            >
              +
            </button>
            <button
              type="button"
              onClick={removeSelected}
              className="p-1 rounded bg-rose-100 text-rose-700 hover:bg-rose-200"
              title="Hapus stiker ini"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Papan Gabus (Cork Board Canvas) */}
      <div
        ref={boardRef}
        onClick={() => setSelectedElementId(null)}
        className="relative w-full h-[450px] md:h-[550px] rounded-2xl border-8 border-[#8D6E63] shadow-2xl overflow-hidden select-none touch-none"
        style={{
          backgroundColor: "#C49A6C",
          backgroundImage:
            "radial-gradient(#A97D4F 15%, transparent 16%), radial-gradient(#9B6F43 15%, transparent 16%)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 10px 10px",
        }}
      >
        {/* Wood grain vignette */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(0,0,0,0.35)]" />

        {/* Board Stickers */}
        {boardStickers.map((item) => {
          const isSelected = item.id === selectedElementId;

          return (
            <div
              key={item.id}
              onPointerDown={(e) => handlePointerDown(e, item.id)}
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
                transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
                zIndex: item.zIndex,
              }}
              className={`absolute cursor-grab active:cursor-grabbing p-1 transition-shadow duration-150 touch-none ${
                isSelected
                  ? "ring-2 ring-accent-coral ring-offset-2 rounded-lg"
                  : ""
              }`}
            >
              <Sticker id={item.stickerId} size={70} decorative={false} />
            </div>
          );
        })}

        {boardStickers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-amber-950/60 font-hand text-3xl">
            Papan gabus masih kosong. Pilih stiker di bawah untuk menempel!
          </div>
        )}
      </div>

      {/* Drawer Stiker (Drawer with Tabs) */}
      <div className="mt-6 bg-paper-light dark:bg-darkbg-card p-4 rounded-xl border-2 border-paper-lines dark:border-darkbg-border shadow-scrapbook">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-paper-lines dark:border-white/10 mb-4">
          <Layers className="w-4 h-4 text-ink-muted shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? "bg-accent-mustard text-ink-navy shadow-xs"
                  : "text-ink-muted hover:text-ink-navy dark:hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Stiker Carousel/Grid in Drawer */}
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3 justify-items-center">
          {currentCategoryStickers.map((sticker) => (
            <button
              key={sticker.id}
              type="button"
              onClick={() => addStickerToBoard(sticker)}
              className="p-1 rounded-lg hover:bg-paper-base dark:hover:bg-darkbg-base transition-transform hover:scale-115 active:scale-95 flex flex-col items-center gap-1 group"
              title={`Tempel ${sticker.name}`}
            >
              <Sticker id={sticker.id} size={48} decorative />
            </button>
          ))}
        </div>
      </div>

      {/* Reserved Slot Ruang Kosong */}
      <ScrapbookSlot id="stickers-custom-slot" hint="Ruang Kosong di Bawah Papan Stiker" />
    </section>
  );
}
