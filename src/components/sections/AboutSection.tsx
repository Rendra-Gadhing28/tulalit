"use client";

import React from "react";
import membersData from "@/data/members.json";
import galleryData from "@/data/gallery.json";
import projectsData from "@/data/projects.json";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { BentoGrid, BentoCell } from "@/components/ui/BentoGrid";
import { StickyNote } from "@/components/ui/StickyNote";
import { Sticker } from "@/components/ui/Sticker";
import { ScrapbookSlot } from "@/components/custom/ScrapbookSlot";
import { CustomDecorationsMount } from "@/components/custom/CustomDecorations";
import { motion } from "framer-motion";
import { HeartHandshake, Camera, Trophy, Laugh } from "lucide-react";

export function AboutSection() {
  const totalMembers = membersData.length;
  const totalGallery = galleryData.length;
  const totalProjects = projectsData.length;

  return (
    <section
      id="about"
      className="relative py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <CustomDecorationsMount section="about" />

      <SectionTitle
        badge="Tentang Kita"
        title="Dua Circle, Satu Cerita"
        subtitle="Bagaimana dua sisi yang bertolak belakang bisa bersatu jadi angkatan paling kompak di sekolah."
      />

      {/* Colliding Logo Animation */}
      <div className="relative my-8 flex items-center justify-center gap-4 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 140, damping: 16 }}
          className="flex items-center gap-2 md:gap-4 p-4 md:p-6 rounded-2xl bg-paper-light dark:bg-darkbg-card border-2 border-paper-lines dark:border-darkbg-border shadow-scrapbook"
        >
          {/* Sogadev Dev Logo */}
          <motion.div
            className="text-center group"
            animate={{ x: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
          >
            <Sticker id="dev-code-tag" size={72} decorative />
            <span className="block font-hand font-bold text-lg md:text-xl text-ink-navy dark:text-white mt-1">
              Sogadev
            </span>
            <span className="font-mono text-[10px] text-emerald-800 dark:text-accent-terminal font-bold">
              [Rajin &amp; Semangat]
            </span>
          </motion.div>

          {/* Collision Sign */}
          <motion.div
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="w-10 h-10 rounded-full bg-accent-mustard flex items-center justify-center text-ink-navy font-black text-xl font-mono shadow-md"
          >
            ×
          </motion.div>

          {/* Tulalit Snail Logo */}
          <motion.div
            className="text-center group"
            animate={{ x: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
          >
            <Sticker id="ekspresi-siput" size={72} decorative />
            <span className="block font-hand font-bold text-lg md:text-xl text-ink-navy dark:text-white mt-1">
              Tulalit
            </span>
            <span className="font-mono text-[10px] text-accent-coral font-bold">
              [Santai &amp; Ngakak]
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Bento Grid Stats & Story */}
      <BentoGrid className="mt-8">
        {/* Cell 1: Cerita Filosofi */}
        <BentoCell colSpan={2} delay={0} className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <HeartHandshake className="w-5 h-5 text-accent-coral" />
              <h3 className="font-sans font-bold text-xl text-ink-navy dark:text-white">
                Filosofi &amp; Asal Usul
              </h3>
            </div>
            <p className="font-sans text-sm md:text-base text-ink-brown dark:text-gray-300 leading-relaxed">
              <strong>Sogadev</strong> berakar dari semangat belajar keras, begadang ngerjain tugas, dan mimpi besar yang tulus. Sementara <strong>Tulalit</strong> adalah sisi yang bikin semua itu tetap fun: kelambatan yang jadi bahan tertawaan, candaan saat mati lampu, dan obrolan receh di kantin. Bersama, kami bukan cuma sekelas—kami keluarga yang saling merangkul.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-paper-lines dark:border-darkbg-border flex items-center gap-2 text-xs font-mono text-ink-muted">
            <Laugh className="w-4 h-4 text-accent-mustard" />
            <span>status: Kenangan abadi, selamanya</span>
          </div>
        </BentoCell>

        {/* Cell 2: Visi Kelas Sticky Note */}
        <BentoCell colSpan={2} delay={0.07}>
          <StickyNote id="visi-note" color="mustard" hasPin={true}>
            <h4 className="font-hand font-bold text-2xl text-amber-900 dark:text-amber-300 mb-2">
              📜 Visi XII PPLG 3
            </h4>
            <p className="font-hand text-lg md:text-xl text-amber-950 dark:text-amber-100 leading-snug">
              &ldquo;Lulus bareng, sukses bareng—di kampus, di industri, atau di mana pun! Dan jangan pernah lupa traktir teman lama kalau udah jadi orang besar.&rdquo;
            </p>
            <span className="block text-right font-hand text-sm text-amber-800 dark:text-amber-300 mt-3">
              — Seluruh Warga PPLG 3
            </span>
          </StickyNote>
        </BentoCell>

        {/* Cell 3: Stat Siswa */}
        <BentoCell colSpan={1} delay={0.14} className="text-center">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
          >
            <HeartHandshake className="w-8 h-8 mx-auto text-accent-mustard mb-2" />
          </motion.div>
          <span className="block font-mono font-black text-4xl md:text-5xl text-ink-navy dark:text-white">
            {totalMembers}
          </span>
          <span className="block font-sans text-xs md:text-sm font-bold text-ink-muted mt-1 uppercase tracking-wider">
            Murid Seperjuangan
          </span>
        </BentoCell>

        {/* Cell 4: Stat Momen */}
        <BentoCell colSpan={1} delay={0.19} className="text-center">
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <Trophy className="w-8 h-8 mx-auto text-accent-coral mb-2" />
          </motion.div>
          <span className="block font-mono font-black text-4xl md:text-5xl text-ink-navy dark:text-white">
            {totalProjects}
          </span>
          <span className="block font-sans text-xs md:text-sm font-bold text-ink-muted mt-1 uppercase tracking-wider">
            Momen Legendaris
          </span>
        </BentoCell>

        {/* Cell 5: Stat Foto */}
        <BentoCell colSpan={1} delay={0.24} className="text-center">
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          >
            <Camera className="w-8 h-8 mx-auto text-accent-sky mb-2" />
          </motion.div>
          <span className="block font-mono font-black text-4xl md:text-5xl text-ink-navy dark:text-white">
            {totalGallery}+
          </span>
          <span className="block font-sans text-xs md:text-sm font-bold text-ink-muted mt-1 uppercase tracking-wider">
            Momen Terabadikan
          </span>
        </BentoCell>

        {/* Cell 6: Tawa yang Dimaafkan */}
        <BentoCell colSpan={1} delay={0.29} className="text-center">
          <motion.div
            animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.9, ease: "easeInOut" }}
          >
            <Laugh className="w-8 h-8 mx-auto text-emerald-700 dark:text-accent-terminal mb-2" />
          </motion.div>
          <span className="block font-mono font-black text-4xl md:text-5xl text-emerald-800 dark:text-accent-terminal">
            999+
          </span>
          <span className="block font-sans text-xs md:text-sm font-bold text-ink-muted mt-1 uppercase tracking-wider">
            Tawa Legendaris
          </span>
        </BentoCell>
      </BentoGrid>

      {/* Reserved Slot Ruang Kosong */}
      <ScrapbookSlot id="about-custom-slot" hint="Ruang Kosong untuk Catatan / Stiker Tambahanmu" />
    </section>
  );
}
