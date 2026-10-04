import type { GuestbookEntry } from "@/types";

export class SupabaseGuestbookDriver {
  private url: string;
  private anonKey: string;

  constructor(url: string, anonKey: string) {
    this.url = url.replace(/\/$/, "");
    this.anonKey = anonKey;
  }

  private get headers(): HeadersInit {
    return {
      apikey: this.anonKey,
      Authorization: `Bearer ${this.anonKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };
  }

  async getEntries(): Promise<GuestbookEntry[]> {
    try {
      const res = await fetch(
        `${this.url}/rest/v1/guestbook?select=*&order=created_at.desc&limit=50`,
        {
          headers: this.headers,
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error(`Supabase query failed: ${res.statusText}`);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        relationship: item.relationship,
        message: item.message,
        color: item.color || "mustard",
        createdAt: item.created_at,
        isLocal: false,
      }));
    } catch (err) {
      console.error("Gagal memuat dari Supabase:", err);
      return [];
    }
  }

  async addEntry(
    entry: Omit<GuestbookEntry, "id" | "createdAt" | "isLocal">
  ): Promise<GuestbookEntry | null> {
    try {
      const res = await fetch(`${this.url}/rest/v1/guestbook`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          name: entry.name,
          relationship: entry.relationship,
          message: entry.message,
          color: entry.color,
        }),
      });

      if (!res.ok) {
        throw new Error(`Supabase insert failed: ${res.statusText}`);
      }

      const inserted = await res.json();
      if (inserted && inserted[0]) {
        return {
          id: inserted[0].id,
          name: inserted[0].name,
          relationship: inserted[0].relationship,
          message: inserted[0].message,
          color: inserted[0].color,
          createdAt: inserted[0].created_at,
          isLocal: false,
        };
      }
      return null;
    } catch (err) {
      console.error("Gagal mengirim ke Supabase:", err);
      return null;
    }
  }

  async deleteEntry(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${this.url}/rest/v1/guestbook?id=eq.${id}`, {
        method: "DELETE",
        headers: this.headers,
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
