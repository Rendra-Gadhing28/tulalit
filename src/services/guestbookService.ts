import type { GuestbookEntry } from "@/types";
import { LocalGuestbookDriver } from "./drivers/local";
import { SupabaseGuestbookDriver } from "./drivers/supabase";
import { SUPABASE_URL, SUPABASE_KEY, isSupabaseConfigured } from "./supabaseConfig";

const localDriver = new LocalGuestbookDriver();

const supabaseDriver = isSupabaseConfigured
  ? new SupabaseGuestbookDriver(SUPABASE_URL, SUPABASE_KEY)
  : null;

export const guestbookService = {
  isCloudEnabled(): boolean {
    return Boolean(supabaseDriver);
  },

  async getEntries(): Promise<GuestbookEntry[]> {
    if (supabaseDriver) {
      const cloudData = await supabaseDriver.getEntries();
      if (cloudData && cloudData.length > 0) {
        return cloudData;
      }
    }
    // Fallback ke local
    return localDriver.getEntries();
  },

  async addEntry(
    entry: Omit<GuestbookEntry, "id" | "createdAt" | "isLocal">
  ): Promise<{ success: boolean; error?: string; entry?: GuestbookEntry }> {
    if (supabaseDriver) {
      const inserted = await supabaseDriver.addEntry(entry);
      if (inserted) {
        return { success: true, entry: inserted };
      }
      // Jika supabase gagal kirim, simpan di lokal agar pesan pengguna tidak hilang
    }

    const localInserted = localDriver.addEntry(entry);
    return { success: true, entry: localInserted };
  },

  async deleteEntry(id: string): Promise<boolean> {
    if (supabaseDriver) {
      const deleted = await supabaseDriver.deleteEntry(id);
      if (deleted) return true;
    }
    return localDriver.deleteEntry(id);
  },
};
