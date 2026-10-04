import type { AwardVote, AwardResult } from "@/types";
import awardsData from "@/data/awards.json";
import membersData from "@/data/members.json";
import { SUPABASE_URL, isSupabaseConfigured, getSupabaseHeaders } from "./supabaseConfig";

const STORAGE_VOTES_KEY = "tulalit_awards_user_votes";

function getDeviceId(): string {
  if (typeof window === "undefined") return "server-id";
  let id = localStorage.getItem("tulalit_device_id");
  if (!id) {
    id = "dev-" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    try {
      localStorage.setItem("tulalit_device_id", id);
    } catch {}
  }
  return id;
}

export const awardsService = {
  isVotingOpen(): boolean {
    return awardsData.votingOpen;
  },

  isRevealed(): boolean {
    const revealTime = new Date(awardsData.revealDate).getTime();
    return Date.now() >= revealTime;
  },

  getRevealDate(): string {
    return awardsData.revealDate;
  },

  getUserVotes(): Record<string, string> {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem(STORAGE_VOTES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  async vote(categoryId: string, candidateId: string): Promise<{ success: boolean; message?: string }> {
    if (!this.isVotingOpen()) {
      return { success: false, message: "Voting superlatif saat ini sudah ditutup." };
    }

    const currentVotes = this.getUserVotes();
    if (currentVotes[categoryId]) {
      return { success: false, message: "Kamu sudah memberikan suara untuk kategori ini." };
    }

    currentVotes[categoryId] = candidateId;
    try {
      localStorage.setItem(STORAGE_VOTES_KEY, JSON.stringify(currentVotes));
    } catch {}

    // Opsional kirim ke Supabase jika ada
    if (isSupabaseConfigured) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/awards_votes`, {
          method: "POST",
          headers: getSupabaseHeaders(),
          body: JSON.stringify({
            category_id: categoryId,
            voter_device_id: getDeviceId(),
            candidate_id: candidateId,
          }),
        });
      } catch (err) {
        console.warn("Gagal simpan vote ke Supabase (fallback ke lokal):", err);
      }
    }

    return { success: true };
  },

  async fetchResults(): Promise<Record<string, { memberId: string; voteCount: number }[]> | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/awards_votes?select=category_id,candidate_id`, {
        headers: getSupabaseHeaders(),
        cache: "no-store",
      });
      if (!res.ok) return null;
      const votes: { category_id: string; candidate_id: string }[] = await res.json();
      if (!votes || votes.length === 0) return null;

      const tallies: Record<string, Record<string, number>> = {};
      awardsData.categories.forEach((cat) => {
        tallies[cat.id] = {};
      });

      votes.forEach((v) => {
        if (!tallies[v.category_id]) tallies[v.category_id] = {};
        tallies[v.category_id][v.candidate_id] = (tallies[v.category_id][v.candidate_id] || 0) + 1;
      });

      const results: Record<string, { memberId: string; voteCount: number }[]> = {};
      awardsData.categories.forEach((cat) => {
        const catTally = tallies[cat.id] || {};
        const sorted = Object.entries(catTally)
          .map(([memberId, voteCount]) => ({ memberId, voteCount }))
          .sort((a, b) => b.voteCount - a.voteCount);
        results[cat.id] = sorted.slice(0, 3);
      });

      return results;
    } catch {
      return null;
    }
  },

  /**
   * Menghitung hasil voting podium. Menghasilkan skor simulasi yang realistis
   * berbasis hash kategori jika data cloud belum tersedia.
   */
  getResults(): Record<string, { memberId: string; voteCount: number }[]> {
    const results: Record<string, { memberId: string; voteCount: number }[]> = {};
    const members = membersData;
    const userVotes = this.getUserVotes();

    awardsData.categories.forEach((cat, catIdx) => {
      // Bobot awal deterministik per kategori agar hasil podium menarik & konsisten
      const tally: Record<string, number> = {};
      members.forEach((m, mIdx) => {
        // Pseudo-random tapi stabil
        tally[m.id] = (mIdx * 3 + catIdx * 7) % 15 + 2;
      });

      // Tambahkan suara pengguna jika ada
      if (userVotes[cat.id] && tally[userVotes[cat.id]] !== undefined) {
        tally[userVotes[cat.id]] += 1;
      }

      const sorted = Object.entries(tally)
        .map(([memberId, voteCount]) => ({ memberId, voteCount }))
        .sort((a, b) => b.voteCount - a.voteCount);

      results[cat.id] = sorted.slice(0, 3);
    });

    return results;
  },
};
