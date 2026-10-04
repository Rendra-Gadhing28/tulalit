"use client";

import React, { useState, useEffect } from "react";
import type { GuestbookEntry, GuestbookRelationship } from "@/types";
import { guestbookService } from "@/services/guestbookService";
import { containsBadWords, sanitizeText } from "@/data/badwords";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StickyNote } from "@/components/ui/StickyNote";
import { ScrapbookSlot } from "@/components/custom/ScrapbookSlot";
import { playSfx } from "@/lib/sound";
import { Send, Trash2, ShieldAlert, CheckCircle2, PenTool } from "lucide-react";

const RATE_LIMIT_KEY = "tulalit_guestbook_last_post";

export function GuestbookSection() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState<GuestbookRelationship>("teman");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState<"mustard" | "coral" | "sage" | "sky">("mustard");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load entries on mount
  useEffect(() => {
    guestbookService.getEntries().then(setEntries).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // 1. Validasi input
    if (name.trim().length < 2 || name.trim().length > 30) {
      setErrorMsg("Nama harus antara 2 hingga 30 karakter.");
      return;
    }

    if (message.trim().length < 3 || message.trim().length > 280) {
      setErrorMsg("Pesan harus antara 3 hingga 280 karakter.");
      return;
    }

    // 2. Filter kata kasar
    if (containsBadWords(name) || containsBadWords(message)) {
      setErrorMsg("Pesan atau nama terdeteksi mengandung kata yang tidak sopan. Harap gunakan bahasa yang santun.");
      return;
    }

    // 3. Rate limiting (1 pesan / 60 detik)
    try {
      const lastPost = localStorage.getItem(RATE_LIMIT_KEY);
      if (lastPost) {
        const diffSeconds = (Date.now() - Number(lastPost)) / 1000;
        if (diffSeconds < 60) {
          setErrorMsg(`Harap tunggu ${Math.ceil(60 - diffSeconds)} detik sebelum mengirim pesan berikutnya.`);
          return;
        }
      }
    } catch {}

    try {
      setIsSubmitting(true);
      playSfx("click");

      const sanitizedName = sanitizeText(name.trim());
      const sanitizedMessage = sanitizeText(message.trim());

      const res = await guestbookService.addEntry({
        name: sanitizedName,
        relationship,
        message: sanitizedMessage,
        color,
      });

      if (res.success && res.entry) {
        playSfx("pop");
        setEntries((prev) => [res.entry!, ...prev]);
        setMessage("");
        setName("");
        setSuccessMsg("Pesanmu berhasil tertempel di dinding kenangan!");
        try {
          localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
        } catch {}
      } else {
        setErrorMsg("Gagal mengirim pesan. Silakan coba lagi.");
      }
    } catch {
      setErrorMsg("Terjadi kendala saat mengirim ucapan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLocal = (id: string) => {
    if (confirm("Hapus pesan ini dari dinding lokal?")) {
      playSfx("click");
      guestbookService.deleteEntry(id);
      setEntries((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const relationshipLabels: Record<GuestbookRelationship, string> = {
    teman: "Teman Sekelas / Sekolah",
    guru: "Bapak / Ibu Guru",
    ortu: "Orang Tua / Wali",
    alumni: "Alumni",
    adik_kelas: "Adik Kelas",
  };

  return (
    <section
      id="guestbook"
      className="relative py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <SectionTitle
        badge="Buku Tamu"
        title="Dinding Ucapan & Pesan Terakhir"
        subtitle="Tinggalkan jejak, doa, atau pesan perpisahanmu untuk seluruh murid XII PPLG 3. Pesan akan tertempel selamanya!"
      />

      {/* Form Input Pesan */}
      <div className="max-w-2xl mx-auto mb-10 bg-paper-light dark:bg-darkbg-card p-6 md:p-8 border-2 border-paper-lines dark:border-darkbg-border shadow-xl paper-texture" style={{ borderRadius: "4px" }}>
        <h3 className="font-hand text-2xl md:text-3xl font-bold text-ink-navy dark:text-white mb-5 flex items-center">
          <PenTool className="w-5 h-5 mr-2 inline text-accent-mustard" /> Tulis di Sticky Note Baru
        </h3>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-300 text-rose-700 dark:text-rose-300 text-xs font-mono flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-700 dark:text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="guestbook-name"
                className="block text-xs font-mono font-bold text-ink-muted mb-1"
              >
                Nama Lengkap / Panggilan (Maks 30):
              </label>
              <input
                id="guestbook-name"
                type="text"
                required
                maxLength={30}
                placeholder="Contoh: Rendi / Bu Ani"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-paper-base dark:bg-darkbg-base border border-paper-lines dark:border-darkbg-border font-sans text-sm focus:outline-none focus:border-accent-coral text-ink-navy dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="guestbook-rel"
                className="block text-xs font-mono font-bold text-ink-muted mb-1"
              >
                Hubungan / Status:
              </label>
              <select
                id="guestbook-rel"
                value={relationship}
                onChange={(e) =>
                  setRelationship(e.target.value as GuestbookRelationship)
                }
                className="w-full px-3.5 py-2 rounded-lg bg-paper-base dark:bg-darkbg-base border border-paper-lines dark:border-darkbg-border font-sans text-sm text-ink-navy dark:text-white focus:outline-none focus:border-accent-coral"
              >
                {Object.entries(relationshipLabels).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="guestbook-message"
                className="block text-xs font-mono font-bold text-ink-muted"
              >
                Pesan & Kesan Terakhir:
              </label>
              <span
                className={`text-[11px] font-mono ${
                  message.length > 260 ? "text-accent-coral font-bold" : "text-ink-muted"
                }`}
              >
                {message.length} / 280
              </span>
            </div>
            <textarea
              id="guestbook-message"
              required
              rows={3}
              maxLength={280}
              placeholder="Tulis pesan atau doa terbaikmu di sini..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-paper-base dark:bg-darkbg-base border border-paper-lines dark:border-darkbg-border font-hand text-lg focus:outline-none focus:border-accent-coral text-ink-navy dark:text-white leading-relaxed resize-none"
            />
          </div>

          {/* Color Picker & Submit */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-ink-muted">Warna Kertas:</span>
              {(["mustard", "coral", "sage", "sky"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    c === "mustard"
                      ? "bg-amber-300"
                      : c === "coral"
                      ? "bg-rose-300"
                      : c === "sage"
                      ? "bg-emerald-300"
                      : "bg-sky-300"
                  } ${
                    color === c
                      ? "scale-125 border-ink-navy dark:border-white shadow-sm"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`Pilih warna ${c}`}
                />
              ))}
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-accent-coral hover:bg-rose-500 text-white font-bold font-sans text-sm flex items-center gap-2 shadow-md transition-transform active:scale-95 disabled:opacity-50" style={{ borderRadius: "3px" }}
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Menempelkan..." : "Tempelkan Ucapan"}
            </button>
          </div>
        </form>
      </div>

      {/* Dinding Pesan Tempel (Sticky Notes Wall) */}
      <div className="corkboard rounded-xl p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {entries.map((entry) => (
          <StickyNote key={entry.id} id={entry.id} color={entry.color}>
            <p className="font-hand text-xl text-ink-navy dark:text-gray-900 leading-snug">
              &ldquo;{entry.message}&rdquo;
            </p>

            <div className="mt-4 pt-2 border-t border-black/10 flex items-center justify-between font-mono text-xs">
              <div>
                <span className="block font-bold text-ink-brown">{entry.name}</span>
                <span className="text-[10px] text-ink-muted capitalize">
                  {entry.relationship.replace("_", " ")}
                </span>
              </div>

              {entry.isLocal && (
                <button
                  type="button"
                  onClick={() => handleDeleteLocal(entry.id)}
                  className="text-rose-600 hover:text-rose-800 p-1"
                  title="Hapus pesan buatan sendiri"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </StickyNote>
        ))}
      </div>

      {/* Reserved Slot Ruang Kosong */}
      <ScrapbookSlot id="guestbook-custom-slot" hint="Ruang Kosong di Area Buku Tamu" />
    </section>
  );
}
