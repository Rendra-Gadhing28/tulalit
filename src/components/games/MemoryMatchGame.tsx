"use client";

import React, { useState, useEffect } from "react";
import membersData from "@/data/members.json";
import { leaderboardService } from "@/services/leaderboardService";
import { playSfx } from "@/lib/sound";
import { RotateCcw, Trophy, Timer } from "lucide-react";

interface CardItem {
  uid: number;
  memberId: string;
  nickname: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function MemoryMatchGame() {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedUids, setFlippedUids] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [bestTime, setBestTime] = useState<number | null>(null);

  // Load top score
  useEffect(() => {
    const scores = leaderboardService.getTopScores("memory");
    if (scores[0]) {
      setBestTime(scores[0].score);
    }
    leaderboardService.fetchTopScores("memory").then((cloudScores) => {
      if (cloudScores[0]) {
        setBestTime(cloudScores[0].score);
      }
    });
  }, []);

  const initGame = () => {
    playSfx("click");
    // Pick 6 members -> 12 cards
    const picked = [...membersData].sort(() => 0.5 - Math.random()).slice(0, 6);
    const doubled = [...picked, ...picked];
    const shuffled = doubled
      .sort(() => 0.5 - Math.random())
      .map((m, idx) => ({
        uid: idx,
        memberId: m.id,
        nickname: m.nickname,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffled);
    setFlippedUids([]);
    setMatchedCount(0);
    setSeconds(0);
    setIsPlaying(true);
  };

  // Timer tick
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Card click
  const handleCardClick = (uid: number) => {
    if (!isPlaying) return;
    if (flippedUids.length >= 2) return;
    const clicked = cards.find((c) => c.uid === uid);
    if (!clicked || clicked.isFlipped || clicked.isMatched) return;

    playSfx("paper");
    const nextFlipped = [...flippedUids, uid];
    setFlippedUids(nextFlipped);

    setCards((prev) =>
      prev.map((c) => (c.uid === uid ? { ...c, isFlipped: true } : c))
    );

    if (nextFlipped.length === 2) {
      const first = cards.find((c) => c.uid === nextFlipped[0]);
      const second = cards.find((c) => c.uid === nextFlipped[1]);

      if (first && second && first.memberId === second.memberId) {
        // MATCH!
        playSfx("pop");
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.memberId === first.memberId ? { ...c, isMatched: true } : c
            )
          );
          setFlippedUids([]);
          setMatchedCount((m) => {
            const next = m + 1;
            if (next === 6) {
              // Game Won!
              setIsPlaying(false);
              playSfx("konami");
              leaderboardService.saveScore({
                game: "memory",
                playerName: "Player",
                score: seconds,
                playedAt: new Date().toISOString(),
              });
              if (!bestTime || seconds < bestTime) {
                setBestTime(seconds);
              }
            }
            return next;
          });
        }, 500);
      } else {
        // NO MATCH
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              nextFlipped.includes(c.uid) ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedUids([]);
        }, 800);
      }
    }
  };

  return (
    <div className="bg-paper-light dark:bg-darkbg-card p-6 rounded-2xl border-2 border-paper-lines dark:border-darkbg-border select-none max-w-xl mx-auto">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-paper-lines dark:border-white/10">
        <div>
          <h4 className="font-mono font-bold text-base text-ink-navy dark:text-white">
            Merge Conflict (Memory Match)
          </h4>
          <p className="font-sans text-xs text-ink-muted">
            Pasangkan kartu nama teman sekelas sebelum timer habis!
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1 text-accent-coral font-bold">
            <Timer className="w-4 h-4" />
            <span>{seconds}s</span>
          </div>

          {bestTime !== null && (
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Trophy className="w-4 h-4" />
              <span>Rekor: {bestTime}s</span>
            </div>
          )}
        </div>
      </div>

      {!isPlaying && cards.length === 0 ? (
        <div className="py-12 text-center">
          <p className="font-hand text-2xl text-ink-navy dark:text-white mb-4">
            Uji ingatanmu tentang circle XII PPLG 3!
          </p>
          <button
            type="button"
            onClick={initGame}
            className="px-6 py-2.5 rounded-full bg-accent-mustard hover:bg-amber-400 text-ink-navy font-bold font-mono text-xs uppercase shadow-md transition-transform active:scale-95"
          >
            Mulai Permainan
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 my-4">
            {cards.map((card) => (
              <button
                key={card.uid}
                type="button"
                onClick={() => handleCardClick(card.uid)}
                className={`aspect-square rounded-xl border-2 text-center flex flex-col items-center justify-center p-2 font-mono text-xs transition-all duration-300 ${
                  card.isMatched
                    ? "bg-emerald-100 dark:bg-emerald-950/60 border-emerald-400 text-emerald-800 dark:text-emerald-300 opacity-90 scale-95"
                    : card.isFlipped
                    ? "bg-white dark:bg-darkbg-card border-accent-coral text-ink-navy dark:text-white shadow-md rotate-0"
                    : "bg-paper-base dark:bg-darkbg-base border-paper-lines text-ink-muted hover:border-accent-mustard"
                }`}
              >
                {card.isFlipped || card.isMatched ? (
                  <div>
                    <span className="block text-lg mb-1">🧑‍💻</span>
                    <span className="font-hand font-bold text-sm block leading-none">
                      {card.nickname}
                    </span>
                  </div>
                ) : (
                  <span className="font-mono font-bold text-accent-terminal">&lt;?&gt;</span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between pt-2 border-t border-paper-lines dark:border-white/10">
            <span className="font-mono text-xs text-ink-muted">
              Cocok: {matchedCount} / 6 Pasang
            </span>

            <button
              type="button"
              onClick={initGame}
              className="px-3 py-1.5 rounded-lg bg-paper-base dark:bg-darkbg-base border border-paper-lines text-xs font-mono text-ink-navy dark:text-white flex items-center gap-1 hover:bg-paper-dark"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Ulang
            </button>
          </div>
        </>
      )}
    </div>
  );
}
