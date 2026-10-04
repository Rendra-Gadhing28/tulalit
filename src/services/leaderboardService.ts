import type { ArcadeScore } from "@/types";
import { SUPABASE_URL, isSupabaseConfigured, getSupabaseHeaders } from "./supabaseConfig";

const STORAGE_LEADERBOARD_KEY = "tulalit_arcade_scores";

export const leaderboardService = {
  isCloudEnabled(): boolean {
    return isSupabaseConfigured;
  },

  getTopScores(game: "memory" | "bug_catcher"): ArcadeScore[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_LEADERBOARD_KEY);
      const all: ArcadeScore[] = raw ? JSON.parse(raw) : [];
      return all
        .filter((item) => item.game === game)
        .sort((a, b) => (game === "memory" ? a.score - b.score : b.score - a.score))
        .slice(0, 5);
    } catch {
      return [];
    }
  },

  async fetchTopScores(game: "memory" | "bug_catcher"): Promise<ArcadeScore[]> {
    if (!isSupabaseConfigured) {
      return this.getTopScores(game);
    }

    try {
      const order = game === "memory" ? "asc" : "desc";
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/arcade_scores?game=eq.${game}&select=*&order=score.${order}&limit=5`,
        {
          headers: getSupabaseHeaders(),
          cache: "no-store",
        }
      );

      if (res.ok) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const cloudScores: ArcadeScore[] = data.map((item: any) => ({
            game: item.game,
            playerName: item.player_name,
            score: item.score,
            playedAt: item.created_at,
          }));

          // Sinkronkan ke cache lokal
          if (typeof window !== "undefined") {
            try {
              const raw = localStorage.getItem(STORAGE_LEADERBOARD_KEY);
              const localAll: ArcadeScore[] = raw ? JSON.parse(raw) : [];
              const otherGames = localAll.filter((i) => i.game !== game);
              localStorage.setItem(
                STORAGE_LEADERBOARD_KEY,
                JSON.stringify([...otherGames, ...cloudScores])
              );
            } catch {}
          }

          return cloudScores;
        }
      }
    } catch (err) {
      console.warn("Gagal mengambil skor arcade dari Supabase, fallback lokal:", err);
    }

    return this.getTopScores(game);
  },

  async saveScore(score: ArcadeScore): Promise<void> {
    // 1. Simpan di local storage
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(STORAGE_LEADERBOARD_KEY);
        const all: ArcadeScore[] = raw ? JSON.parse(raw) : [];
        all.push(score);
        localStorage.setItem(STORAGE_LEADERBOARD_KEY, JSON.stringify(all));
      } catch {}
    }

    // 2. Simpan ke Supabase jika aktif
    if (isSupabaseConfigured) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/arcade_scores`, {
          method: "POST",
          headers: getSupabaseHeaders(),
          body: JSON.stringify({
            game: score.game,
            player_name: score.playerName,
            score: score.score,
          }),
        });
      } catch (err) {
        console.warn("Gagal simpan skor ke Supabase:", err);
      }
    }
  },
};
