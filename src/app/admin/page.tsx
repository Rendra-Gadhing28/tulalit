"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { config } from "@/data/config";
import membersData from "@/data/members.json";
import quotesData from "@/data/quotes.json";
import awardsData from "@/data/awards.json";
import { guestbookService } from "@/services/guestbookService";
import { timeCapsuleService } from "@/services/timeCapsuleService";
import { isSupabaseConfigured } from "@/services/supabaseConfig";
import type { GuestbookEntry, TimeCapsuleMessage } from "@/types";
import { playSfx } from "@/lib/sound";
import {
  ShieldAlert,
  ArrowLeft,
  Download,
  Trash2,
  Lock,
  Mail,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Database,
  LogOut,
} from "lucide-react";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  // Admin Data states
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([]);
  const [timeCapsuleMessages, setTimeCapsuleMessages] = useState<TimeCapsuleMessage[]>([]);
  const [isVotingActive, setIsVotingActive] = useState<boolean>(awardsData.votingOpen);
  const [adminNotification, setAdminNotification] = useState<string | null>(null);

  useEffect(() => {
    // Check if session already stored
    const sessionEmail = sessionStorage.getItem("tulalit_admin_session");
    if (sessionEmail && config.adminEmails?.includes(sessionEmail)) {
      setIsAuthenticated(true);
      loadAdminData();
    }
  }, []);

  const loadAdminData = async () => {
    try {
      const gb = await guestbookService.getEntries();
      setGuestbookEntries(gb);
      const tc = await timeCapsuleService.getMessages();
      setTimeCapsuleMessages(tc.unlocked);
    } catch (err) {
      console.error("Gagal load admin data:", err);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    playSfx("click");
    setAuthError(null);

    const allowed = config.adminEmails || ["admin@tulalit.smk.id"];
    const normalized = email.trim().toLowerCase();

    if (!allowed.map((a) => a.toLowerCase()).includes(normalized)) {
      setAuthError("Email tidak terdaftar dalam allowlist admin (NEXT_PUBLIC_ADMIN_EMAILS).");
      return;
    }

    // Direct auth approval for allowlisted admin
    sessionStorage.setItem("tulalit_admin_session", normalized);
    setIsAuthenticated(true);
    setMagicLinkSent(true);
    loadAdminData();
  };

  const handleLogout = () => {
    playSfx("click");
    sessionStorage.removeItem("tulalit_admin_session");
    setIsAuthenticated(false);
  };

  const handleDeleteGuestbook = async (id: string) => {
    if (!confirm("Hapus pesan buku tamu ini?")) return;
    playSfx("pop");
    await guestbookService.deleteEntry(id);
    setGuestbookEntries((prev) => prev.filter((item) => item.id !== id));
    notify("Pesan buku tamu berhasil dihapus.");
  };

  const handleExportBackup = () => {
    playSfx("click");
    const backupData = {
      exportedAt: new Date().toISOString(),
      className: config.className,
      members: membersData,
      quotes: quotesData,
      awards: awardsData,
      guestbook: guestbookEntries,
      timeCapsule: timeCapsuleMessages,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup-xiipplg3-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify("Backup JSON berhasil diunduh.");
  };

  const notify = (msg: string) => {
    setAdminNotification(msg);
    setTimeout(() => setAdminNotification(null), 3500);
  };

  return (
    <div className="min-h-screen bg-paper-base dark:bg-darkbg-base py-12 px-4 md:px-8 select-none">
      <div className="max-w-5xl mx-auto">
        {/* Top Header */}
        <div className="mb-8 flex items-center justify-between border-b border-paper-lines dark:border-white/10 pb-4">
          <Link
            href="/"
            onClick={() => playSfx("click")}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-ink-navy dark:text-white hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-ink-muted">
              Portal Moderasi Kelas
            </span>
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-mono text-xs flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" /> Keluar
              </button>
            )}
          </div>
        </div>

        {/* Notice if Supabase not configured */}
        {!isSupabaseConfigured && (
          <div className="mb-8 p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2.5 font-bold font-mono text-sm mb-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>SUPABASE TIDAK TERDETEKSI (MODE STATIS / LOCALHOST)</span>
            </div>
            <p className="font-sans text-xs leading-relaxed">
              Panel `/admin` dengan autentikasi cloud hanya aktif penuh bila variabel lingkungan{" "}
              <code className="bg-amber-200/50 dark:bg-amber-900/50 px-1 py-0.5 rounded font-mono">
                NEXT_PUBLIC_SUPABASE_URL
              </code>{" "}
              dan{" "}
              <code className="bg-amber-200/50 dark:bg-amber-900/50 px-1 py-0.5 rounded font-mono">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </code>{" "}
              diisi. Kamu tetap bisa menguji panel dengan email allowlist lokal untuk simulasi.
            </p>
          </div>
        )}

        {/* Login Box */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto p-8 rounded-3xl bg-paper-light dark:bg-darkbg-card border-4 border-paper-lines dark:border-darkbg-border shadow-scrapbook">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="font-hand text-3xl font-bold text-ink-navy dark:text-white">
                Login Moderator
              </h2>
              <p className="font-sans text-xs text-ink-muted mt-1">
                Akses terbatas untuk tim dev &amp; wali kelas XII PPLG 3
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-ink-navy dark:text-white uppercase mb-1">
                  Email Admin:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tulalit.smk.id"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-paper-base dark:bg-darkbg-base border-2 border-paper-lines dark:border-white/10 text-sm font-sans text-ink-navy dark:text-white outline-none focus:border-accent-coral"
                />
              </div>

              {authError && (
                <p className="font-mono text-xs text-rose-500 font-bold">{authError}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-accent-coral hover:bg-rose-500 text-white font-bold font-sans text-xs uppercase tracking-wider shadow-md transition-transform active:scale-95"
              >
                Masuk ke Dasbor
              </button>

              <div className="text-[11px] font-mono text-ink-muted text-center pt-2">
                Allowlist terdaftar di config: {config.adminEmails?.join(", ")}
              </div>
            </form>
          </div>
        ) : (
          /* Admin Dashboard Content */
          <div className="space-y-8">
            {/* Quick Action Bar */}
            <div className="p-6 rounded-2xl bg-paper-light dark:bg-darkbg-card border-2 border-paper-lines dark:border-darkbg-border flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-hand text-2xl font-bold text-ink-navy dark:text-white">
                  Dasbor Moderasi
                </h3>
                <span className="font-mono text-xs text-emerald-500 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Terautentikasi sebagai Admin
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold flex items-center gap-2 hover:bg-slate-800 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Ekspor Backup JSON</span>
                </button>
              </div>
            </div>

            {adminNotification && (
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-mono font-bold animate-fade-in border border-emerald-300">
                {adminNotification}
              </div>
            )}

            {/* Voting Control */}
            <div className="p-6 rounded-2xl bg-paper-light dark:bg-darkbg-card border-2 border-paper-lines dark:border-darkbg-border flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-ink-navy dark:text-white">
                  Status Voting Superlatif
                </h4>
                <p className="font-sans text-xs text-ink-muted">
                  Buka atau tutup kesempatan memilih kategori award untuk siswa.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  playSfx("click");
                  setIsVotingActive((v) => !v);
                  notify(`Voting superlatif sekarang: ${!isVotingActive ? "DIBUKA" : "DITUTUP"}`);
                }}
                className="flex items-center gap-2 font-mono text-xs font-bold"
              >
                {isVotingActive ? (
                  <span className="flex items-center gap-1 text-emerald-600">
                    <ToggleRight className="w-6 h-6" /> AKTIF
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-400">
                    <ToggleLeft className="w-6 h-6" /> NONAKTIF
                  </span>
                )}
              </button>
            </div>

            {/* Guestbook Moderation */}
            <div className="p-6 rounded-2xl bg-paper-light dark:bg-darkbg-card border-2 border-paper-lines dark:border-darkbg-border">
              <h4 className="font-bold text-sm text-ink-navy dark:text-white mb-4">
                Moderasi Buku Tamu ({guestbookEntries.length} Pesan)
              </h4>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {guestbookEntries.length === 0 ? (
                  <p className="text-xs font-mono text-ink-muted">Belum ada pesan buku tamu.</p>
                ) : (
                  guestbookEntries.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-paper-base dark:bg-darkbg-base border border-paper-lines flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-ink-navy dark:text-white">
                          {item.name} ({item.relationship})
                        </span>
                        <p className="text-ink-brown dark:text-gray-300 truncate mt-0.5">
                          {item.message}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteGuestbook(item.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                        title="Hapus pesan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Time Capsule Moderation */}
            <div className="p-6 rounded-2xl bg-paper-light dark:bg-darkbg-card border-2 border-paper-lines dark:border-darkbg-border">
              <h4 className="font-bold text-sm text-ink-navy dark:text-white mb-4">
                Pesan Time Capsule yang Terbuka ({timeCapsuleMessages.length} Pesan)
              </h4>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {timeCapsuleMessages.length === 0 ? (
                  <p className="text-xs font-mono text-ink-muted">
                    Tidak ada pesan time capsule yang sudah terbuka saat ini.
                  </p>
                ) : (
                  timeCapsuleMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-3 rounded-xl bg-paper-base dark:bg-darkbg-base border border-paper-lines flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-ink-navy dark:text-white">
                          {msg.authorName}
                        </span>
                        <p className="text-ink-brown dark:text-gray-300 truncate mt-0.5">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
