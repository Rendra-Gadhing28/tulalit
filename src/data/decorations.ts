/**
 * REGISTRY DEKORASI & KOMPONEN KUSTOM USER
 *
 * File ini disediakan khusus agar kamu bisa menambahkan hiasan,
 * stiker kustom, atau komponen dekoratif buatanmu sendiri tanpa merusak layout.
 *
 * Cukup tambahkan item baru ke array `userCustomDecorations` di bawah.
 */

export interface CustomDecorationItem {
  id: string;
  targetSection: "hero" | "about" | "timeline" | "gallery" | "members" | "teachers" | "projects" | "quotes" | "guestbook" | "footer";
  anchor: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "gutter-left" | "gutter-right" | "custom";
  label?: string;
  imageSrc?: string; // Path ke foto/gambar buatanmu di /public/img/custom/
  rotation?: number;
  scale?: number;
}

export const userCustomDecorations: CustomDecorationItem[] = [
  {
    id: "custom-deco-1",
    targetSection: "hero",
    anchor: "top-right",
    label: "Slot Hiasan Kamu 01",
    rotation: 6,
    scale: 1,
  },
  {
    id: "custom-deco-2",
    targetSection: "about",
    anchor: "gutter-right",
    label: "Slot Foto Bebas 02",
    rotation: -4,
    scale: 0.95,
  },
  {
    id: "custom-deco-3",
    targetSection: "gallery",
    anchor: "gutter-left",
    label: "Slot Scrapbook Kamu 03",
    rotation: 3,
    scale: 1,
  },
];
