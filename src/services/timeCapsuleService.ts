import type { TimeCapsuleMessage } from "@/types";
import { SUPABASE_URL, SUPABASE_KEY, isSupabaseConfigured, getSupabaseHeaders } from "./supabaseConfig";

const STORAGE_CAPSULE_KEY = "tulalit_time_capsule_messages";

const SEED_CAPSULE_MESSAGES: TimeCapsuleMessage[] = [
  {
    id: "tc-seed-01",
    authorName: "Arkamudya (Lead)",
    message: "Semoga pas kapsul ini terbuka, kodingan kita semua sudah jalan di production dan gak ada lagi yang panik kena merge conflict!",
    prediction2031: "Semua anak XII PPLG 3 jadi tech lead atau founder.",
    unlockAt: "2024-01-01T00:00:00Z", // Sudah terbuka sebagai contoh
    createdAt: "2023-11-10T12:00:00Z",
    isUnlocked: true,
    isLocal: true,
  },
];

export const timeCapsuleService = {
  isCloudEnabled(): boolean {
    return isSupabaseConfigured;
  },

  async getMessages(): Promise<{ unlocked: TimeCapsuleMessage[]; lockedCount: number }> {
    if (isSupabaseConfigured) {
      try {
        const nowIso = new Date().toISOString();
        // 1. Ambil yang sudah unlock (unlock_at <= now())
        const resUnlocked = await fetch(
          `${SUPABASE_URL}/rest/v1/time_capsule?select=*&unlock_at=lte.${nowIso}&order=created_at.desc`,
          {
            headers: getSupabaseHeaders(),
            cache: "no-store",
          }
        );

        // 2. Ambil count yang masih terkunci (unlock_at > now()) via header count
        const resLocked = await fetch(
          `${SUPABASE_URL}/rest/v1/time_capsule?select=id&unlock_at=gt.${nowIso}`,
          {
            headers: getSupabaseHeaders({ Prefer: "count=exact" }),
            cache: "no-store",
          }
        );

        if (resUnlocked.ok) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = await resUnlocked.json();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const unlocked = data.map((item: any) => ({
            id: item.id,
            authorName: item.author_name,
            message: item.message,
            prediction2031: item.prediction_2031,
            unlockAt: item.unlock_at,
            createdAt: item.created_at,
            isUnlocked: true,
            isLocal: false,
          }));

          const countHeader = resLocked.headers.get("content-range");
          const totalLocked = countHeader ? parseInt(countHeader.split("/")[1] || "0", 10) : 0;

          return { unlocked, lockedCount: totalLocked };
        }
      } catch (err) {
        console.warn("Gagal memuat Time Capsule dari Supabase (fallback ke lokal):", err);
      }
    }

    // Fallback Lokal (localStorage)
    if (typeof window === "undefined") {
      return { unlocked: SEED_CAPSULE_MESSAGES, lockedCount: 3 };
    }

    try {
      const raw = localStorage.getItem(STORAGE_CAPSULE_KEY);
      const all: TimeCapsuleMessage[] = raw ? JSON.parse(raw) : SEED_CAPSULE_MESSAGES;
      const now = Date.now();

      const unlocked = all.filter((m) => new Date(m.unlockAt).getTime() <= now);
      const locked = all.filter((m) => new Date(m.unlockAt).getTime() > now);

      return { unlocked, lockedCount: locked.length };
    } catch {
      return { unlocked: SEED_CAPSULE_MESSAGES, lockedCount: 2 };
    }
  },

  async addMessage(data: {
    authorName: string;
    message: string;
    prediction2031?: string;
    unlockAt: string;
  }): Promise<{ success: boolean; message?: string }> {
    if (isSupabaseConfigured) {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/time_capsule`, {
          method: "POST",
          headers: getSupabaseHeaders(),
          body: JSON.stringify({
            author_name: data.authorName,
            message: data.message,
            prediction_2031: data.prediction2031,
            unlock_at: data.unlockAt,
          }),
        });

        if (res.ok) {
          return { success: true };
        }
      } catch (err) {
        console.warn("Gagal kirim Time Capsule ke Supabase, fallback lokal:", err);
      }
    }

    // Simpan ke localStorage
    try {
      const raw = localStorage.getItem(STORAGE_CAPSULE_KEY);
      const current: TimeCapsuleMessage[] = raw ? JSON.parse(raw) : SEED_CAPSULE_MESSAGES;
      const newMsg: TimeCapsuleMessage = {
        id: `tc-local-${Date.now()}`,
        authorName: data.authorName,
        message: data.message,
        prediction2031: data.prediction2031,
        unlockAt: data.unlockAt,
        createdAt: new Date().toISOString(),
        isUnlocked: new Date(data.unlockAt).getTime() <= Date.now(),
        isLocal: true,
      };

      current.push(newMsg);
      localStorage.setItem(STORAGE_CAPSULE_KEY, JSON.stringify(current));
      return { success: true };
    } catch {
      return { success: false, message: "Penyimpanan browser penuh." };
    }
  },
};
