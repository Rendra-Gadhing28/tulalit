import Link from "next/link";
import { Sticker } from "@/components/ui/Sticker";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-paper-base dark:bg-darkbg-base select-none">
      {/* Snail Sticker */}
      <div className="mb-6 -scale-x-100">
        <Sticker id="ekspresi-siput" size={96} decorative />
      </div>

      <div className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-mono font-bold uppercase tracking-wider mb-4 border border-rose-300">
        Error 404
      </div>

      <h1 className="font-hand text-5xl md:text-7xl font-bold text-ink-navy dark:text-white max-w-xl leading-tight">
        404 — Kenangan ini belum di-commit.
      </h1>

      <p className="mt-4 font-sans text-sm md:text-base text-ink-muted max-w-md mx-auto leading-relaxed">
        Halaman yang kamu tuju mungkin belum di-push ke branch utama, atau memorinya tertinggal di lab komputer.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <Link
          href="/"
          className="px-6 py-2.5 rounded-full bg-accent-coral hover:bg-rose-500 text-white font-bold font-sans text-sm shadow-md flex items-center gap-2 transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Home className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>

      <div className="mt-12 font-mono text-xs text-ink-muted/60">
        git checkout main &amp;&amp; git pull kenangan
      </div>
    </div>
  );
}
