import type { GuestbookEntry } from "@/types";

const STORAGE_KEY = "tulalit_guestbook_entries";

const SEED_ENTRIES: GuestbookEntry[] = [
  {
    id: "gb-seed-01",
    name: "Ibu Ratna Dewi (Wali Kelas)",
    relationship: "guru",
    message: "Selamat atas kelulusan kalian anak-anakku XII PPLG 3! Tetaplah rendah hati dan jangan pernah berhenti belajar koding.",
    color: "mustard",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isLocal: true,
  },
  {
    id: "gb-seed-02",
    name: "Aditya (Ketua OSIS)",
    relationship: "teman",
    message: "XII PPLG 3 circle paling rame dan seru kalau ada event sekolah. Sukses di perkuliahan dan industri ya bro!",
    color: "coral",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    isLocal: true,
  },
  {
    id: "gb-seed-03",
    name: "Bapak Joko Prasetyo",
    relationship: "guru",
    message: "Semoga ilmu pemrograman yang dipelajari selama 3 tahun bermanfaat untuk nusa dan bangsa. Sukses selalu!",
    color: "sky",
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    isLocal: true,
  },
  {
    id: "gb-seed-04",
    name: "Tiara (Adik Kelas XI PPLG)",
    relationship: "adik_kelas",
    message: "Terima kasih kakak-kakak XII PPLG 3 yang udah sering bantuin kami pas bingung tugas praktikum!",
    color: "sage",
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    isLocal: true,
  },
];

export class LocalGuestbookDriver {
  getEntries(): GuestbookEntry[] {
    if (typeof window === "undefined") return SEED_ENTRIES;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ENTRIES));
        return SEED_ENTRIES;
      }
      return JSON.parse(raw);
    } catch {
      return SEED_ENTRIES;
    }
  }

  addEntry(
    entry: Omit<GuestbookEntry, "id" | "createdAt" | "isLocal">
  ): GuestbookEntry {
    const current = this.getEntries();
    const newEntry: GuestbookEntry = {
      ...entry,
      id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      isLocal: true,
    };
    const updated = [newEntry, ...current];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return newEntry;
  }

  deleteEntry(id: string): boolean {
    const current = this.getEntries();
    const updated = current.filter((item) => item.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch {
      return false;
    }
  }
}
