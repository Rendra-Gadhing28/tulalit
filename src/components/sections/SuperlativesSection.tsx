"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import awardsData from "@/data/awards.json";
import membersData from "@/data/members.json";
import { awardsService } from "@/services/awardsService";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ScrapbookSlot } from "@/components/custom/ScrapbookSlot";
import { playSfx } from "@/lib/sound";
import { Award, Trophy, Check, Clock, Lock } from "lucide-react";

export function SuperlativesSection() {
  const [userVotes, setUserVotes] = useState<Record<string, string>>({});
  const [activeCategoryIdx, setActiveCategoryIdx] = useState<number>(0);
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [voteMessage, setVoteMessage] = useState<string | null>(null);

  const categories = awardsData.categories;
  const isVotingOpen = awardsData.votingOpen;
  const isRevealed = awardsService.isRevealed();
  const revealDateStr = awardsData.revealDate;

  const [liveResults, setLiveResults] = useState<Record<string, { memberId: string; voteCount: number }[]> | null>(null);

  useEffect(() => {
    setUserVotes(awardsService.getUserVotes());
    awardsService.fetchResults().then((cloudResults) => {
      if (cloudResults) setLiveResults(cloudResults);
    });
  }, []);

  const currentCategory = categories[activeCategoryIdx] || categories[0];
  const userVotedCandidateId = userVotes[currentCategory.id];
  const results = liveResults || awardsService.getResults();

  const handleVoteSubmit = async () => {
    if (!selectedCandidate) return;

    playSfx("flip");
    // Dual burst confetti from left and right as documented in animationtransition.md
    try {
      confetti({
        particleCount: 35,
        angle: 60,
        spread: 55,
        origin: { x: 0.25, y: 0.7 },
        colors: ["#F59E0B", "#EF4444", "#3B82F6", "#10B981"],
      });
      confetti({
        particleCount: 35,
        angle: 120,
        spread: 55,
        origin: { x: 0.75, y: 0.7 },
        colors: ["#F59E0B", "#EF4444", "#3B82F6", "#10B981"],
      });
    } catch {}

    const res = await awardsService.vote(currentCategory.id, selectedCandidate);
    if (res.success) {
      setUserVotes(awardsService.getUserVotes());
      awardsService.fetchResults().then((cloudResults) => {
        if (cloudResults) setLiveResults(cloudResults);
      });
      setVoteMessage("Suara berhasil disimpan! Terima kasih sudah berpartisipasi.");
      setSelectedCandidate("");
      setTimeout(() => setVoteMessage(null), 3500);
    } else {
      setVoteMessage(res.message || "Gagal menyimpan suara.");
    }
  };

  const currentPodium = results[currentCategory.id] || [];

  return (
    <section
      id="superlatives"
      className="relative py-16 md:py-24 px-4 md:px-8 max-w-6xl mx-auto overflow-hidden"
    >
      <SectionTitle
        badge="Class Awards"
        title="Dinding Gelar Superlatif"
        subtitle="Penghargaan kocak dan bergengsi untuk warga XII PPLG 3. Beri suaramu untuk menentukan siapa sang juara!"
      />

      {/* Category Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8 justify-start md:justify-center">
        {categories.map((cat, idx) => {
          const isActive = idx === activeCategoryIdx;
          const hasVoted = Boolean(userVotes[cat.id]);

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                playSfx("click");
                setActiveCategoryIdx(idx);
                setSelectedCandidate("");
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-accent-coral text-white shadow-md scale-105"
                  : "bg-paper-light dark:bg-darkbg-card text-ink-muted dark:text-gray-400 border border-paper-lines hover:text-ink-navy dark:hover:text-white"
              }`}
            >
              {hasVoted && <Check className="w-3 h-3 text-emerald-300" />}
              <span>{cat.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Award Card with 3D Flip feel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCategory.id}
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="bg-paper-light dark:bg-darkbg-card p-6 md:p-10 border-2 border-paper-lines dark:border-darkbg-border shadow-scrapbook paper-texture"
          style={{ borderRadius: "4px" }}
        >
          <div className="text-center max-w-xl mx-auto mb-8">
            <div
              className="w-14 h-14 mx-auto mb-3 bg-amber-400 text-ink-navy flex items-center justify-center shadow-md"
              style={{ borderRadius: "4px", transform: "rotate(-4deg)" }}
            >
              <Award className="w-8 h-8" />
            </div>

            <h3 className="font-hand text-3xl md:text-4xl font-bold text-ink-navy dark:text-white">
              {currentCategory.title}
            </h3>

            <p className="mt-2 font-sans text-sm text-ink-brown dark:text-gray-300">
              {currentCategory.description}
            </p>
          </div>

          {/* Voting Form / Voted Status */}
          <div className="max-w-md mx-auto mb-10 p-5 rounded-2xl bg-paper-base dark:bg-darkbg-base border-2 border-paper-lines dark:border-white/10 text-center">
            {userVotedCandidateId ? (
              <div className="text-center py-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-bold border border-emerald-300 mb-2">
                  <Check className="w-3.5 h-3.5" /> Pilihanmu Tersimpan
                </span>
                <p className="font-sans text-sm text-ink-navy dark:text-white mt-1">
                  Kamu telah memilih:{" "}
                  <strong>
                    {membersData.find((m) => m.id === userVotedCandidateId)?.name || userVotedCandidateId}
                  </strong>
                </p>
                <span className="block text-[11px] font-mono text-ink-muted mt-1">
                  (Satu suara per perangkat untuk kategori ini)
                </span>
              </div>
            ) : isVotingOpen ? (
              <div>
                <label
                  htmlFor="candidate-select"
                  className="block text-xs font-mono font-bold text-ink-muted uppercase mb-2"
                >
                  Pilih Kandidat Menurutmu:
                </label>

                <select
                  id="candidate-select"
                  value={selectedCandidate}
                  onChange={(e) => setSelectedCandidate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-darkbg-card border-2 border-paper-lines dark:border-white/10 text-sm font-sans text-ink-navy dark:text-white mb-3 outline-none focus:border-accent-coral"
                >
                  <option value="">-- Pilih Nama Teman --</option>
                  {membersData.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.nickname})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={!selectedCandidate}
                  onClick={handleVoteSubmit}
                  className="w-full py-2.5 bg-accent-coral hover:bg-rose-500 text-white font-bold font-sans text-sm shadow-md transition-all active:scale-95 disabled:opacity-40"
                  style={{ borderRadius: "3px" }}
                >
                  Kirim Suara
                </button>

                {voteMessage && (
                  <p className="mt-2 font-mono text-xs text-accent-coral font-bold">
                    {voteMessage}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-ink-muted text-xs font-mono">
                <Lock className="w-4 h-4" /> Voting untuk kategori ini telah ditutup.
              </div>
            )}
          </div>

          {/* Podium Juara 1, 2, 3 */}
          <div className="pt-6 border-t-2 border-dashed border-paper-lines dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h4 className="font-mono text-sm font-bold text-ink-navy dark:text-white uppercase tracking-wider">
                  Klasemen Sementara Podium
                </h4>
              </div>

              {!isRevealed && (
                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-300">
                  <Clock className="w-3.5 h-3.5" /> Pengumuman Resmi: {new Date(revealDateStr).toLocaleDateString("id-ID")}
                </span>
              )}
            </div>

            {/* 3 Step Podium */}
            <div className="grid grid-cols-3 gap-3 md:gap-6 items-end max-w-lg mx-auto pt-8 pb-4 text-center select-none">
              {/* Rank 2 (Silver) */}
              {currentPodium[1] && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 90, damping: 13, delay: 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className="mb-2">
                    <span className="font-hand text-base md:text-xl font-bold text-ink-navy dark:text-white block line-clamp-1">
                      {membersData.find((m) => m.id === currentPodium[1].memberId)?.nickname}
                    </span>
                    <span className="font-mono text-[10px] text-ink-muted">
                      {currentPodium[1].voteCount} Suara
                    </span>
                  </div>
                  <div
                    className="w-full h-24 md:h-32 flex flex-col items-center justify-center shadow-md podium-silver"
                    style={{ borderRadius: "3px 3px 0 0" }}
                  >
                    <span className="font-mono font-black text-2xl md:text-3xl text-slate-600 dark:text-slate-300">
                      2
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">
                      Silver
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Rank 1 (Gold) */}
              {currentPodium[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 90, damping: 13, delay: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="mb-2">
                    <span className="font-hand text-lg md:text-2xl font-bold text-accent-coral block line-clamp-1">
                      👑 {membersData.find((m) => m.id === currentPodium[0].memberId)?.nickname}
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                      {currentPodium[0].voteCount} Suara
                    </span>
                  </div>
                  <div
                    className="w-full h-32 md:h-44 flex flex-col items-center justify-center shadow-lg podium-gold border-t-2 border-amber-300"
                    style={{ borderRadius: "4px 4px 0 0" }}
                  >
                    <span className="font-mono font-black text-3xl md:text-4xl text-amber-900">
                      1
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-amber-800 font-bold">
                      Gold
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Rank 3 (Bronze) */}
              {currentPodium[2] && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 90, damping: 13, delay: 0.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="mb-2">
                    <span className="font-hand text-base md:text-xl font-bold text-ink-navy dark:text-white block line-clamp-1">
                      {membersData.find((m) => m.id === currentPodium[2].memberId)?.nickname}
                    </span>
                    <span className="font-mono text-[10px] text-ink-muted">
                      {currentPodium[2].voteCount} Suara
                    </span>
                  </div>
                  <div
                    className="w-full h-20 md:h-24 flex flex-col items-center justify-center shadow-md podium-bronze"
                    style={{ borderRadius: "3px 3px 0 0" }}
                  >
                    <span className="font-mono font-black text-2xl md:text-3xl text-amber-800 dark:text-amber-200">
                      3
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-amber-700">
                      Bronze
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <ScrapbookSlot id="superlatives-slot" hint="Ruang Kosong di Area Superlatif" />
    </section>
  );
}
