"use client";

import React from "react";
import Link from "next/link";
import membersData from "@/data/members.json";
import teachersData from "@/data/teachers.json";
import galleryData from "@/data/gallery.json";
import awardsData from "@/data/awards.json";
import { config } from "@/data/config";
import { Printer, ArrowLeft } from "lucide-react";

export default function YearbookPrintPage() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans print:bg-white print:p-0">
      {/* Floating Action Bar (Hidden when printing) */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between print:hidden shadow-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-700 hover:text-slate-950"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Website Interaktif</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Ukuran Cetak: Standar A4 / Simpan ke PDF
          </span>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold font-sans text-xs flex items-center gap-2 shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Document Container */}
      <div className="max-w-[210mm] mx-auto my-8 bg-white shadow-2xl print:shadow-none print:m-0 print:w-full print:max-w-none">
        {/* ================= PAGE 1: COVER ================= */}
        <section className="min-h-[297mm] p-16 flex flex-col justify-between border-b-8 border-slate-900 break-after-page print:border-none">
          <div className="text-right font-mono text-sm uppercase tracking-widest text-slate-500">
            {config.schoolName} • {config.academicYear}
          </div>

          <div className="my-auto py-12 text-center">
            <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-800 font-mono text-xs font-bold uppercase tracking-wider mb-6 border border-slate-300">
              Dokumen Resmi Kenangan
            </div>
            <h1 className="font-serif text-6xl font-bold tracking-tight text-slate-950 mb-3">
              COMMIT TERAKHIR
            </h1>
            <p className="font-mono text-xl text-slate-600 mb-6">
              Buku Tahunan Angkatan XII PPLG 3
            </p>
            <div className="w-24 h-1 bg-amber-500 mx-auto mb-6" />
            <p className="font-serif italic text-lg text-slate-700 max-w-md mx-auto">
              &ldquo;{config.tagline}&rdquo;
            </p>
          </div>

          <div className="border-t-2 border-slate-200 pt-6 flex justify-between items-end font-mono text-xs text-slate-500">
            <div>
              <span className="block font-bold text-slate-800">{config.circleName}</span>
              <span>Pengembangan Perangkat Lunak dan Gim</span>
            </div>
            <div>
              <span>Tahun Kelulusan: 2027</span>
            </div>
          </div>
        </section>

        {/* ================= PAGE 2: KATA PENGANTAR ================= */}
        <section className="min-h-[297mm] p-16 flex flex-col justify-between break-after-page border-b border-slate-200 print:border-none">
          <div>
            <div className="font-mono text-xs text-slate-400 uppercase tracking-widest mb-2">
              Sambutan &amp; Refleksi
            </div>
            <h2 className="font-serif text-3xl font-bold text-slate-950 mb-6 pb-4 border-b-2 border-slate-900">
              Kata Pengantar Wali Kelas
            </h2>

            <div className="space-y-4 text-slate-700 leading-relaxed text-sm">
              <p>
                Tiga tahun di SMK bukanlah waktu yang singkat, namun terasa begitu cepat berlalu.
                Di ruang laboratorium komputer ini, ribuan baris kode telah kalian ketikkan, ratusan
                error telah kalian taklukkan bersama, dan tawa canda kalian telah menghidupkan
                setiap sudut ruangan.
              </p>
              <p>
                Circle <strong>Sogadev x Tulalit</strong> membuktikan bahwa kalian bukan hanya
                calon pengembang perangkat lunak yang kompeten dan tekun, namun juga sahabat yang
                saling mendukung, saling memaafkan keterlambatan (tulalit), dan menjaga solidaritas
                tanpa syarat.
              </p>
              <p>
                Jadikan buku tahunan ini sebagai pengingat abadi bahwa kalian pernah berjuang
                bersama dari nol. Raihlah masa depan kalian dengan kepala tegak, dan jangan pernah
                lupa tempat kalian berakar.
              </p>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-600">
                Foto
              </div>
              <div>
                <span className="font-bold text-base text-slate-950 block">
                  Ibu Ratna, S.Kom
                </span>
                <span className="font-mono text-xs text-slate-500">
                  Wali Kelas XII PPLG 3
                </span>
              </div>
            </div>
          </div>

          <div className="text-center font-mono text-xs text-slate-400 border-t border-slate-100 pt-4">
            Halaman 02 • XII PPLG 3 Yearbook
          </div>
        </section>

        {/* ================= PAGE 3 & 4: PROFIL ANGGOTA ================= */}
        <section className="min-h-[297mm] p-16 flex flex-col justify-between break-after-page border-b border-slate-200 print:border-none">
          <div>
            <div className="font-mono text-xs text-slate-400 uppercase tracking-widest mb-2">
              Daftar Kontributor Kelas
            </div>
            <h2 className="font-serif text-3xl font-bold text-slate-950 mb-6 pb-4 border-b-2 border-slate-900">
              Profil Anggota Kelas (Bagian 1)
            </h2>

            <div className="grid grid-cols-2 gap-6">
              {membersData.slice(0, 5).map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex gap-4"
                >
                  <div className="w-20 h-24 bg-slate-800 text-white rounded-md flex flex-col items-center justify-center shrink-0">
                    <span className="text-2xl font-bold">{m.nickname[0]}</span>
                    <span className="text-[10px] font-mono text-slate-400 mt-1">
                      {m.rarity}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-slate-950 truncate">
                      {m.name}
                    </h3>
                    <div className="font-mono text-xs text-amber-700 font-semibold mb-2">
                      &ldquo;{m.nickname}&rdquo; • {m.role}
                    </div>
                    <p className="text-xs italic text-slate-600 line-clamp-2 mb-2">
                      &ldquo;{m.quote}&rdquo;
                    </p>
                    <div className="font-mono text-[10px] text-slate-500">
                      Tech: {m.favoriteLang}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center font-mono text-xs text-slate-400 border-t border-slate-100 pt-4">
            Halaman 03 • Anggota Kelas
          </div>
        </section>

        <section className="min-h-[297mm] p-16 flex flex-col justify-between break-after-page border-b border-slate-200 print:border-none">
          <div>
            <div className="font-mono text-xs text-slate-400 uppercase tracking-widest mb-2">
              Daftar Kontributor Kelas
            </div>
            <h2 className="font-serif text-3xl font-bold text-slate-950 mb-6 pb-4 border-b-2 border-slate-900">
              Profil Anggota Kelas (Bagian 2)
            </h2>

            <div className="grid grid-cols-2 gap-6">
              {membersData.slice(5, 10).map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex gap-4"
                >
                  <div className="w-20 h-24 bg-slate-800 text-white rounded-md flex flex-col items-center justify-center shrink-0">
                    <span className="text-2xl font-bold">{m.nickname[0]}</span>
                    <span className="text-[10px] font-mono text-slate-400 mt-1">
                      {m.rarity}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-slate-950 truncate">
                      {m.name}
                    </h3>
                    <div className="font-mono text-xs text-amber-700 font-semibold mb-2">
                      &ldquo;{m.nickname}&rdquo; • {m.role}
                    </div>
                    <p className="text-xs italic text-slate-600 line-clamp-2 mb-2">
                      &ldquo;{m.quote}&rdquo;
                    </p>
                    <div className="font-mono text-[10px] text-slate-500">
                      Tech: {m.favoriteLang}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center font-mono text-xs text-slate-400 border-t border-slate-100 pt-4">
            Halaman 04 • Anggota Kelas
          </div>
        </section>

        {/* ================= PAGE 5: GURU & SUPERLATIF ================= */}
        <section className="min-h-[297mm] p-16 flex flex-col justify-between break-after-page print:border-none">
          <div>
            <div className="font-mono text-xs text-slate-400 uppercase tracking-widest mb-2">
              Bapak &amp; Ibu Guru
            </div>
            <h2 className="font-serif text-3xl font-bold text-slate-950 mb-6 pb-4 border-b-2 border-slate-900">
              Guru Pembimbing &amp; Wali Kelas
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-10">
              {teachersData.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white"
                >
                  <div className="font-bold text-sm text-slate-950">{t.name}</div>
                  <div className="font-mono text-xs text-slate-500 mb-1">{t.subject}</div>
                  <p className="text-xs italic text-slate-600">&ldquo;{t.message}&rdquo;</p>
                </div>
              ))}
            </div>

            <div className="font-mono text-xs text-slate-400 uppercase tracking-widest mb-2">
              Class Awards
            </div>
            <h3 className="font-serif text-2xl font-bold text-slate-950 mb-4 pb-2 border-b border-slate-300">
              Gelar Superlatif Angkatan
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {awardsData.categories.map((cat) => (
                <div key={cat.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block">{cat.title}</span>
                  <span className="text-slate-600 text-[11px]">{cat.description}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center font-mono text-xs text-slate-400 border-t border-slate-100 pt-4">
            Halaman 05 • Guru &amp; Penghargaan • Akhir Buku Tahunan
          </div>
        </section>
      </div>
    </div>
  );
}
