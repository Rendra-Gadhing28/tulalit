"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { timeCapsuleService } from "@/services/timeCapsuleService";
import type { TimeCapsuleMessage } from "@/types";
import { config } from "@/data/config";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ScrapbookSlot } from "@/components/custom/ScrapbookSlot";
import { playSfx } from "@/lib/sound";
import {
  Hourglass,
  Lock,
  Mail,
  Send,
  Calendar,
  Info,
  PenLine,
} from "lucide-react";

export function TimeCapsuleSection() {
  const [messages, setMessages] = useState<TimeCapsuleMessage[]>([]);
  const [lockedCount, setLockedCount] = useState<number>(0);
  const [authorName, setAuthorName] = useState("");
  const [message, setMessage] = useState("");
  const [prediction2031, setPrediction2031] = useState("");
  const [unlockChoice, setUnlockChoice] = useState<"1year" | "3years" | "5years">("1year");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const isCloud = timeCapsuleService.isCloudEnabled();

  const dates = {
    "1year": config.timeCapsuleDates?.oneYear || "2027-06-15T00:00:00+07:00",
    "3years": config.timeCapsuleDates?.threeYears || "2029-06-15T00:00:00+07:00",
    "5years": config.timeCapsuleDates?.fiveYears || "2031-06-15T00:00:00+07:00",
  };

  const loadData = async () => {
    const res = await timeCapsuleService.getMessages();
    setMessages(res.unlocked);
    setLockedCount(res.lockedCount);
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerWaxSealEffect = () => {
    playSfx("seal-break");
    try {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#F59E0B", "#D97706", "#FEF3C7", "#991B1B"],
      });
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !message.trim()) return;

    setIsSubmitting(true);
    triggerWaxSealEffect();

    const unlockAt = dates[unlockChoice];
    const res = await timeCapsuleService.addMessage({
      authorName: authorName.trim(),
      message: message.trim(),
      prediction2031: prediction2031.trim() || undefined,
      unlockAt,
    });

    setIsSubmitting(false);

    if (res.success) {
      setAuthorName("");
      setMessage("");
      setPrediction2031("");
      setStatusFeedback("Surat berhasil disegel ke dalam Time Capsule!");
      loadData();
      setTimeout(() => setStatusFeedback(null), 4000);
    } else {
      setStatusFeedback(res.message || "Gagal menyimpan surat.");
    }
  };

  return (
    <section
      id="timecapsule"
      className="relative py-16 md:py-24 px-4 md:px-8 max-w-6xl mx-auto overflow-hidden"
    >
      <SectionTitle
        badge="Surat Masa Depan"
        title="Time Capsule Angkatan"
        subtitle="Kunci pesan dan prediksimu untuk dibuka 1, 3, atau 5 tahun lagi. Apa kabarmu di masa depan?"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Capsule Chest & Stats */}
        <div
          className="lg:col-span-5 text-white p-6 md:p-8 border-2 border-amber-400/70 shadow-2xl relative overflow-hidden"
          style={{
            borderRadius: "4px",
            background: "linear-gradient(160deg, #1e1b4b 0%, #0f172a 50%, #1a1010 100%)",
          }}
        >
          <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-3 bg-amber-400/20 border border-amber-500/40 text-amber-400"
              style={{ borderRadius: "6px" }}
            >
              <Hourglass className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h3 className="font-hand text-2xl md:text-3xl font-bold">
                Peti Kapsul Waktu
              </h3>
              <p className="font-mono text-xs text-amber-200/80">
                Penyimpanan Pesan Tersegel
              </p>
            </div>

            {/* Interactive Wax seal with Idle Breathing & Burst Tap */}
            <motion.button
              type="button"
              onClick={triggerWaxSealEffect}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              className="ml-auto wax-seal w-12 h-12 flex-shrink-0 cursor-pointer shadow-lg active:ring-2 active:ring-amber-400"
              aria-label="Segel lilin interaktif"
              title="Ketuk untuk memecahkan segel"
            />
          </div>

          <div className="space-y-4 mb-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="font-sans text-xs text-gray-300">Pesan Terkunci Saat Ini:</span>
              <span className="font-mono font-bold text-xl text-amber-400 flex items-center gap-1.5">
                <Lock className="w-4 h-4" /> {lockedCount} Surat
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-300 mb-1">
                <Calendar className="w-3.5 h-3.5" /> Pembukaan Kapsul Terdekat:
              </div>
              <p className="font-sans font-bold text-sm text-white">
                15 Juni 2027 (1 Tahun Setelah Lulus)
              </p>
              <span className="text-[11px] font-mono text-gray-400">
                Reuni kecil & pembukaan batch pertama pesan
              </span>
            </div>
          </div>

          {/* Notice about local vs supabase mode */}
          <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-200 text-xs font-sans leading-relaxed">
            <div className="flex items-center gap-1 font-bold mb-1">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>{isCloud ? "Mode Cloud Terhubung" : "Mode Simulasi Lokal"}</span>
            </div>
            {isCloud
              ? "Pesan terkunci aman di database dengan enkripsi row-level security (RLS) dan hanya bisa dibaca setelah tanggal buka."
              : "Catatan: Mode lokal menyimpan pesan di browser ini untuk simulasi."}
          </div>
        </div>

        {/* Right: Message Form & Unlocked Letters */}
        <div className="lg:col-span-7 space-y-6">
          {/* Write Letter Form */}
          <form
            onSubmit={handleSubmit}
            className="p-6 md:p-8 bg-paper-light dark:bg-darkbg-card border-2 border-paper-lines dark:border-darkbg-border shadow-scrapbook paper-texture"
            style={{ borderRadius: "4px" }}
          >
            <h4 className="font-hand text-2xl font-bold text-ink-navy dark:text-white mb-2 flex items-center">
              <PenLine className="w-5 h-5 mr-2 inline text-accent-mustard" /> Tulis Surat Untuk Masa Depan
            </h4>
            <p className="font-sans text-xs text-ink-muted mb-4">
              Pesan ini akan dirahasiakan sampai tanggal pembukaan yang kamu pilih.
            </p>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="capsule-author"
                  className="block text-xs font-mono font-bold text-ink-navy dark:text-white uppercase mb-1"
                >
                  Nama / Samaran:
                </label>
                <input
                  id="capsule-author"
                  type="text"
                  required
                  maxLength={40}
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="misal: Ezar atau Anonim Lab"
                  className="w-full px-3.5 py-2 rounded-xl bg-paper-base dark:bg-darkbg-base border-2 border-paper-lines dark:border-white/10 text-sm font-sans text-ink-navy dark:text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-ink-navy dark:text-white uppercase mb-1">
                  Pilihan Waktu Buka:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "1year", label: "1 Tahun (2027)" },
                    { id: "3years", label: "3 Tahun (2029)" },
                    { id: "5years", label: "5 Tahun (2031)" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        playSfx("click");
                        setUnlockChoice(opt.id as "1year" | "3years" | "5years");
                      }}
                      className={`p-2 rounded-xl text-xs font-mono font-bold border transition-colors ${
                        unlockChoice === opt.id
                          ? "bg-amber-400 text-ink-navy border-amber-500 shadow-xs"
                          : "bg-paper-base dark:bg-darkbg-base text-ink-muted border-paper-lines hover:text-ink-navy dark:hover:text-white"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="capsule-prediction"
                  className="block text-xs font-mono font-bold text-ink-navy dark:text-white uppercase mb-1"
                >
                  Prediksi Tahun 2031 (Opsional):
                </label>
                <input
                  id="capsule-prediction"
                  type="text"
                  maxLength={100}
                  value={prediction2031}
                  onChange={(e) => setPrediction2031(e.target.value)}
                  placeholder="misal: Jadi tech lead atau bikin studio game"
                  className="w-full px-3.5 py-2 rounded-xl bg-paper-base dark:bg-darkbg-base border-2 border-paper-lines dark:border-white/10 text-sm font-sans text-ink-navy dark:text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label
                  htmlFor="capsule-message"
                  className="block text-xs font-mono font-bold text-ink-navy dark:text-white uppercase mb-1"
                >
                  Isi Surat (Maks 500 Karakter):
                </label>
                <textarea
                  id="capsule-message"
                  required
                  rows={3}
                  maxLength={500}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan harapan, permohonan maaf, atau kenangan paling gak terlupakan..."
                  className="w-full px-3.5 py-2 rounded-xl bg-paper-base dark:bg-darkbg-base border-2 border-paper-lines dark:border-white/10 text-sm font-sans text-ink-navy dark:text-white outline-none focus:border-amber-400"
                />
                <span className="block text-right text-[10px] font-mono text-ink-muted">
                  {message.length} / 500
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !authorName.trim() || !message.trim()}
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-ink-navy font-bold font-sans text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 disabled:opacity-40"
                style={{ borderRadius: "3px" }}
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Menyegel Surat..." : "Segel Surat ke Kapsul"}
              </button>

              {/* Toast Notification with y: 30 -> y: 0 -> y: -20 physics */}
              <AnimatePresence>
                {statusFeedback && (
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="text-center font-mono text-xs text-amber-600 dark:text-amber-400 font-bold"
                  >
                    {statusFeedback}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>

          {/* Unlocked Letters Showcase */}
          {messages.length > 0 && (
            <div className="p-6 rounded-3xl bg-paper-light dark:bg-darkbg-card border-2 border-dashed border-paper-lines dark:border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-4 h-4 text-emerald-500" />
                <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-navy dark:text-white">
                  Surat yang Sudah Terbuka (Demo)
                </h5>
              </div>

              <div className="space-y-3">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 90, damping: 13 }}
                    className="p-4 rounded-xl bg-paper-base dark:bg-darkbg-base border border-paper-lines dark:border-white/5 shadow-xs"
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="font-bold text-ink-navy dark:text-white">
                        {msg.authorName}
                      </span>
                      <span className="text-[10px] text-ink-muted">Terbuka</span>
                    </div>
                    <p className="font-sans text-sm text-ink-brown dark:text-gray-300">
                      &ldquo;{msg.message}&rdquo;
                    </p>
                    {msg.prediction2031 && (
                      <div className="mt-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                        🔮 Prediksi 2031: {msg.prediction2031}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ScrapbookSlot id="timecapsule-slot" hint="Ruang Kosong di Area Time Capsule" />
    </section>
  );
}
