"use client";

import React, { useState, useEffect, useRef } from "react";
import { leaderboardService } from "@/services/leaderboardService";
import { playSfx } from "@/lib/sound";
import { Sticker } from "@/components/ui/Sticker";
import { Timer, Trophy, Play, RotateCcw } from "lucide-react";

interface TargetItem {
  id: number;
  type: "bug" | "snail";
  x: number; // percentage
  y: number; // percentage
}

export function BugCatcherGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<TargetItem[]>([]);
  const [bestScore, setBestScore] = useState<number>(0);
  const nextTargetId = useRef(0);

  useEffect(() => {
    const scores = leaderboardService.getTopScores("bug_catcher");
    if (scores[0]) setBestScore(scores[0].score);

    leaderboardService.fetchTopScores("bug_catcher").then((cloudScores) => {
      if (cloudScores[0]) setBestScore(cloudScores[0].score);
    });
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!isPlaying) return;

    if (timeLeft <= 0) {
      setIsPlaying(false);
      playSfx("konami");
      leaderboardService.saveScore({
        game: "bug_catcher",
        playerName: "Player",
        score,
        playedAt: new Date().toISOString(),
      });
      if (score > bestScore) setBestScore(score);
      setTargets([]);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, score, bestScore]);

  // Spawner
  useEffect(() => {
    if (!isPlaying) return;

    const spawnInterval = setInterval(() => {
      const isSnail = Math.random() < 0.25; // 25% chance of snail
      const newTarget: TargetItem = {
        id: nextTargetId.current++,
        type: isSnail ? "snail" : "bug",
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 75,
      };

      setTargets((prev) => [...prev.slice(-4), newTarget]);

      // Despawn after 2.5s for bug, 4.5s for snail
      setTimeout(() => {
        setTargets((prev) => prev.filter((t) => t.id !== newTarget.id));
      }, isSnail ? 4500 : 2500);
    }, 900);

    return () => clearInterval(spawnInterval);
  }, [isPlaying]);

  const startGame = () => {
    playSfx("click");
    setScore(0);
    setTimeLeft(30);
    setTargets([]);
    setIsPlaying(true);
  };

  const handleHit = (target: TargetItem) => {
    playSfx("pop");
    setScore((s) => s + (target.type === "snail" ? 5 : 1));
    setTargets((prev) => prev.filter((t) => t.id !== target.id));
  };

  return (
    <div className="bg-paper-light dark:bg-darkbg-card p-6 rounded-2xl border-2 border-paper-lines dark:border-darkbg-border select-none max-w-xl mx-auto">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-paper-lines dark:border-white/10">
        <div>
          <h4 className="font-mono font-bold text-base text-ink-navy dark:text-white">
            Tangkap Bug & Siput Tulalit
          </h4>
          <p className="font-sans text-xs text-ink-muted">
            Ketik atau tap serangga error (+1 poin) dan siput santai (+5 poin)!
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1 text-accent-coral font-bold">
            <Timer className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Trophy className="w-4 h-4" />
            <span>Skor: {score}</span>
          </div>
        </div>
      </div>

      {/* Game Canvas Box */}
      <div className="relative w-full h-[280px] bg-slate-900 rounded-xl overflow-hidden border-2 border-slate-800 touch-none">
        {!isPlaying ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
            <span className="text-3xl mb-2">🐛</span>
            <p className="font-mono text-sm text-emerald-400 mb-1 font-bold">
              Waktu: 30 Detik
            </p>
            {bestScore > 0 && (
              <span className="font-mono text-xs text-amber-400 mb-4">
                Skor Terbaikmu: {bestScore} poin
              </span>
            )}
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-2.5 rounded-full bg-accent-terminal hover:bg-emerald-400 text-ink-navy font-bold font-mono text-xs uppercase shadow-md flex items-center gap-2 transition-transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              Mulai Tangkap Bug
            </button>
          </div>
        ) : (
          targets.map((t) => (
            <button
              key={t.id}
              type="button"
              onPointerDown={() => handleHit(t)}
              style={{ left: `${t.x}%`, top: `${t.y}%` }}
              className="absolute p-1 cursor-pointer transition-transform hover:scale-125 active:scale-90 -translate-x-1/2 -translate-y-1/2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-coral rounded-full"
              title={t.type === "snail" ? "Siput Tulalit! (+5)" : "Bug! (+1)"}
            >
              {t.type === "snail" ? (
                <div className="relative">
                  <Sticker id="ekspresi-siput" size={44} decorative />
                  <span className="absolute -top-2 right-0 text-[10px] font-mono font-bold bg-amber-400 text-ink-navy px-1 rounded-full">
                    +5
                  </span>
                </div>
              ) : (
                <div className="relative">
                  <Sticker id="dev-bug" size={40} decorative />
                  <span className="absolute -top-2 right-0 text-[10px] font-mono font-bold bg-rose-500 text-white px-1 rounded-full">
                    +1
                  </span>
                </div>
              )}
            </button>
          ))
        )}
      </div>

      {isPlaying && (
        <div className="mt-3 flex items-center justify-between text-xs font-mono text-ink-muted">
          <span>Tap target sebelum menghilang!</span>
          <button
            type="button"
            onClick={startGame}
            className="flex items-center gap-1 hover:text-ink-navy dark:hover:text-white"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      )}
    </div>
  );
}
