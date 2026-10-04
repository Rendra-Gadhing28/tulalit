"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import projectsData from "@/data/projects.json";
import type { Project, ProjectCategory } from "@/types";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { ScrapbookSlot } from "@/components/custom/ScrapbookSlot";
import { CustomDecorationsMount } from "@/components/custom/CustomDecorations";
import { playSfx } from "@/lib/sound";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star, Users, Layers, Flame } from "lucide-react";

const CATEGORIES: ProjectCategory[] = ["Semua", "Web", "Mobile", "Game", "UI/UX"];

const CATEGORY_EMOJI: Record<string, string> = {
  Web: "🍟",
  Game: "🎭",
  Mobile: "🌙",
  "UI/UX": "💧",
  Semua: "🏫",
};

const CATEGORY_LABEL: Record<string, string> = {
  Web: "Kantin",
  Game: "Pensi & Seni",
  Mobile: "Study Tour",
  "UI/UX": "Kelas & Lab",
  Semua: "Semua Momen",
};

function MomentCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-60, 60], [8, -8]), { stiffness: 160, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-60, 60], [-8, 8]), { stiffness: 160, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const emoji = CATEGORY_EMOJI[project.category] ?? "📌";
  const catLabel = CATEGORY_LABEL[project.category] ?? project.category;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 48, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.09, type: "spring", stiffness: 120, damping: 16 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.97 }}
      className="group bg-paper-light dark:bg-darkbg-card rounded-2xl border-2 border-paper-lines dark:border-darkbg-border shadow-scrapbook flex flex-col justify-between overflow-hidden cursor-default"
    >
      {/* Card image area */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-amber-50 dark:bg-darkbg-base border-b-2 border-paper-lines dark:border-white/10">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-106 opacity-90 group-hover:opacity-100"
          />
        ) : (
          <ImagePlaceholder
            label={project.title}
            category={project.category}
            aspect="landscape"
          />
        )}

        {/* Floating emoji badge */}
        <motion.div
          className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 dark:bg-darkbg-card/90 backdrop-blur-sm font-mono text-xs font-bold border border-amber-300/60 flex items-center gap-1.5 shadow-sm"
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
        >
          <span className="text-base">{emoji}</span>
          <span className="text-ink-navy dark:text-white">{catLabel}</span>
        </motion.div>

        {/* Shining badge on hover */}
        <motion.div
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ rotate: -10 }}
          animate={{ rotate: ["-10deg", "10deg", "-10deg"] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent-mustard text-ink-navy text-[10px] font-mono font-black shadow-md">
            <Flame className="w-3 h-3" />
            LEGENDARIS
          </div>
        </motion.div>
      </div>

      {/* Card content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-hand font-bold text-xl md:text-2xl text-ink-navy dark:text-white group-hover:text-accent-coral transition-colors leading-snug">
            {project.title}
          </h3>

          <p className="mt-2 font-sans text-sm text-ink-brown dark:text-gray-300 leading-relaxed">
            {project.description}
          </p>

          {/* "Vibes" badges (repurposed from techStack) */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.techStack.map((item, i) => (
              <motion.span
                key={i}
                whileHover={{ scale: 1.08, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/40 font-mono text-xs text-amber-900 dark:text-amber-300 cursor-default"
              >
                {item}
              </motion.span>
            ))}
          </div>

          {/* Authors */}
          <div className="mt-4 pt-3 border-t border-paper-lines dark:border-white/10 flex items-center gap-1.5 text-xs font-mono text-ink-muted">
            <Users className="w-3.5 h-3.5 text-accent-coral" />
            <span>Pelaku: {project.authors.join(", ")}</span>
          </div>
        </div>

        {/* Star rating row – decorative nostalgia meter */}
        <div className="mt-4 pt-3 border-t border-paper-lines dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.09 + i * 0.06, type: "spring", stiffness: 300 }}
              >
                <Star className="w-4 h-4 fill-accent-mustard text-accent-mustard" />
              </motion.div>
            ))}
          </div>
          <span className="font-hand text-sm text-ink-muted italic">nostalgia 100%</span>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>("Semua");

  const filteredProjects =
    selectedCategory === "Semua"
      ? (projectsData as Project[])
      : (projectsData as Project[]).filter((p) => p.category === selectedCategory);

  return (
    <section
      id="projects"
      className="relative py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <CustomDecorationsMount section="projects" />

      <SectionTitle
        badge="Momen Legendaris"
        title="Kisah & Kenangan Angkatan"
        subtitle="Bukan portofolio, ini arsip kejadian nyata—momen-momen kocak, menegangkan, dan penuh baper yang bikin XII PPLG 3 selalu dikenang."
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <motion.button
              key={cat}
              type="button"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playSfx("pop");
                setSelectedCategory(cat);
              }}
              className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-accent-mustard text-ink-navy shadow-md font-bold"
                  : "bg-paper-light dark:bg-darkbg-card text-ink-muted dark:text-gray-400 border border-paper-lines hover:text-ink-navy dark:hover:text-white"
              }`}
            >
              <span>{CATEGORY_EMOJI[cat]}</span>
              {CATEGORY_LABEL[cat]}
            </motion.button>
          );
        })}
      </div>

      {/* Moment Cards Grid */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={selectedCategory}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {filteredProjects.map((project, i) => (
            <MomentCard key={project.id} project={project} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Reserved Slot Ruang Kosong */}
      <ScrapbookSlot id="projects-custom-slot" hint="Ruang Kosong untuk Momen Legendaris Tambahan" />
    </section>
  );
}
