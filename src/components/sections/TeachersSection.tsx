"use client";

import React, { useState } from "react";
import Image from "next/image";
import teachersData from "@/data/teachers.json";
import type { Teacher } from "@/types";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { ScrapbookSlot } from "@/components/custom/ScrapbookSlot";
import { CustomDecorationsMount } from "@/components/custom/CustomDecorations";
import { playSfx } from "@/lib/sound";
import { Mail, MailOpen, Send, GraduationCap } from "lucide-react";

export function TeachersSection() {
  const [openedEnvelopes, setOpenedEnvelopes] = useState<Record<string, boolean>>({
    "tch-01": true, // Wali kelas spotlight dibuka secara default
  });

  const toggleEnvelope = (id: string) => {
    playSfx("paper");
    setOpenedEnvelopes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSendThanks = (teacherName: string) => {
    playSfx("click");
    try {
      const stored = localStorage.getItem("tulalit_unlocked_achievements");
      const parsed = stored ? JSON.parse(stored) : {};
      if (!parsed["greet_teacher"]) {
        parsed["greet_teacher"] = new Date().toISOString();
        localStorage.setItem("tulalit_unlocked_achievements", JSON.stringify(parsed));
      }
    } catch {}

    const guestbookEl = document.getElementById("guestbook");
    if (guestbookEl) {
      guestbookEl.scrollIntoView({ behavior: "smooth" });
      const textarea = document.getElementById("guestbook-message") as HTMLTextAreaElement;
      if (textarea) {
        textarea.value = `Terima kasih yang sebesar-besarnya untuk ${teacherName} atas bimbingan dan kesabarannya mengajar kami di XII PPLG 3! 🙏`;
        textarea.focus();
      }
    }
  };

  const homeroomTeacher = (teachersData as Teacher[]).find((t) => t.isHomeroom);
  const otherTeachers = (teachersData as Teacher[]).filter((t) => !t.isHomeroom);

  return (
    <section
      id="teachers"
      className="relative py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <CustomDecorationsMount section="teachers" />

      <SectionTitle
        badge="Guru & Wali Kelas"
        title="Surat Apresiasi Para Mentor"
        subtitle="Sosok-sosok hebat di balik setiap baris logika, kesabaran menghadapi kami yang sering tulalit, dan doa tulus mereka."
      />

      {/* Wali Kelas Spotlight Card */}
      {homeroomTeacher && (
        <div className="mb-12 max-w-4xl mx-auto bg-gradient-to-br from-amber-50 to-orange-50 dark:from-darkbg-card dark:to-darkbg-base p-6 md:p-8 rounded-2xl border-4 border-accent-mustard shadow-xl relative overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-mustard text-ink-navy text-xs font-mono font-bold shadow-xs">
            <GraduationCap className="w-4 h-4" />
            Wali Kelas Tercinta
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Foto Wali Kelas */}
            <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-accent-mustard shadow-md max-w-[240px] mx-auto md:max-w-none w-full">
              {homeroomTeacher.photo ? (
                <Image
                  src={homeroomTeacher.photo}
                  alt={homeroomTeacher.name}
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              ) : (
                <ImagePlaceholder
                  label={homeroomTeacher.name}
                  category="Wali Kelas"
                  aspect="square"
                />
              )}
            </div>

            {/* Pesan Wali Kelas */}
            <div className="md:col-span-2">
              <h3 className="font-sans font-bold text-2xl text-ink-navy dark:text-white">
                {homeroomTeacher.name}
              </h3>
              <p className="font-mono text-xs text-accent-coral font-bold mt-1">
                {homeroomTeacher.subject}
              </p>

              <div className="mt-4 p-4 rounded-xl bg-white dark:bg-darkbg-subtle border border-paper-lines dark:border-white/10 shadow-xs">
                <p className="font-hand text-lg md:text-xl text-ink-brown dark:text-gray-200 leading-relaxed italic">
                  &ldquo;{homeroomTeacher.message}&rdquo;
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSendThanks(homeroomTeacher.name)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-coral hover:bg-rose-500 text-white font-bold text-xs font-mono shadow-sm transition-transform active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                Kirim Ucapan Terima Kasih
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid Guru Lainnya (Amplop Terbuka/Tutup) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {otherTeachers.map((teacher) => {
          const isOpen = openedEnvelopes[teacher.id];

          return (
            <div
              key={teacher.id}
              className="bg-paper-light dark:bg-darkbg-card p-5 rounded-xl border-2 border-paper-lines dark:border-darkbg-border shadow-scrapbook flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-accent-mustard shrink-0">
                    {teacher.photo ? (
                      <Image
                        src={teacher.photo}
                        alt={teacher.name}
                        fill
                        sizes="60px"
                        className="object-cover"
                      />
                    ) : (
                      <ImagePlaceholder label={teacher.name} category="Guru" aspect="square" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-base text-ink-navy dark:text-white line-clamp-1">
                      {teacher.name}
                    </h4>
                    <p className="font-mono text-[11px] text-ink-muted line-clamp-1">
                      {teacher.subject}
                    </p>
                  </div>
                </div>

                {/* Surat dalam amplop */}
                <div className="mt-4">
                  {isOpen ? (
                    <div className="p-3.5 rounded-lg bg-paper-base dark:bg-darkbg-base border border-paper-lines dark:border-white/10 animate-fade-in">
                      <p className="font-hand text-base md:text-lg text-ink-brown dark:text-gray-200 leading-snug">
                        &ldquo;{teacher.message}&rdquo;
                      </p>
                    </div>
                  ) : (
                    <div
                      onClick={() => toggleEnvelope(teacher.id)}
                      className="p-4 rounded-lg bg-amber-50/50 dark:bg-darkbg-base border-2 border-dashed border-accent-mustard/60 cursor-pointer text-center hover:bg-amber-100/50 transition-colors"
                    >
                      <Mail className="w-6 h-6 mx-auto text-accent-mustard mb-1" />
                      <span className="font-mono text-xs font-bold text-ink-navy dark:text-gray-300">
                        Klik untuk membuka surat & pesan
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-paper-lines dark:border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleEnvelope(teacher.id)}
                  className="font-mono text-xs text-ink-muted hover:text-ink-navy dark:hover:text-white flex items-center gap-1"
                >
                  {isOpen ? (
                    <>
                      <MailOpen className="w-3.5 h-3.5" /> Lipat Surat
                    </>
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5" /> Buka Surat
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSendThanks(teacher.name)}
                  className="font-mono text-xs text-accent-coral font-bold hover:underline flex items-center gap-1"
                >
                  <Send className="w-3 h-3" /> Balas
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reserved Slot Ruang Kosong */}
      <ScrapbookSlot id="teachers-custom-slot" hint="Ruang Kosong untuk Tambahan Pesan Guru Favoritmu" />
    </section>
  );
}
