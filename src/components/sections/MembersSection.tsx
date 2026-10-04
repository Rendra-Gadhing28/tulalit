"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import membersData from "@/data/members.json";
import type { Member } from "@/types";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PhotoCard } from "@/components/ui/PhotoCard";
import { ScrapbookSlot } from "@/components/custom/ScrapbookSlot";
import { CustomDecorationsMount } from "@/components/custom/CustomDecorations";
import { Search } from "lucide-react";
import { ScrollStaggerItem } from "@/components/ui/ScrollReveal";

const HolographicCardModal = dynamic(
  () =>
    import("@/components/three/HolographicCardModal").then(
      (m) => m.HolographicCardModal
    ),
  { ssr: false }
);

export function MembersSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("Semua");
  const [active3DMember, setActive3DMember] = useState<Member | null>(null);

  const roles = [
    "Semua",
    "Frontend",
    "Backend",
    "UI/UX",
    "Full Stack",
    "Game Dev",
    "Tester",
    "DevOps",
    "Penjaga Semangat",
  ];

  const filteredMembers = (membersData as Member[]).filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.quote.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      selectedRole === "Semua" ||
      member.role.toLowerCase().includes(selectedRole.toLowerCase());

    return matchesSearch && matchesRole;
  });

  return (
    <section
      id="members"
      className="relative py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <CustomDecorationsMount section="members" />

      <SectionTitle
        badge="Contributors"
        title="Wajah & Karakter XII PPLG 3"
        subtitle="Koleksi trading card seluruh punggawa kelas. Temukan rarity kartu, hobi begadang, dan balik kartu untuk melihat bio lengkap!"
      />

      {/* Search & Filter Bar */}
      <div className="mb-10 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            aria-label="Cari nama, panggilan, atau quote anggota"
            placeholder="Cari nama, panggilan, atau quote..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-paper-light dark:bg-darkbg-card border-2 border-paper-lines dark:border-darkbg-border font-sans text-sm focus:outline-none focus:border-accent-coral text-ink-navy dark:text-white shadow-xs"
          />
        </div>

        {/* Role Select */}
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          aria-label="Filter berdasarkan peran anggota"
          className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-paper-light dark:bg-darkbg-card border-2 border-paper-lines dark:border-darkbg-border font-sans text-sm text-ink-navy dark:text-white focus:outline-none focus:border-accent-coral shadow-xs"
        >
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
        {filteredMembers.map((member, idx) => (
          <ScrollStaggerItem key={member.id} index={idx} columns={4}>
            <PhotoCard
              member={member}
              onOpen3D={(m) => setActive3DMember(m)}
            />
          </ScrollStaggerItem>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-16">
          <p className="font-hand text-2xl text-ink-muted">
            Oops! Anggota dengan kata kunci tersebut belum terdaftar di git commit.
          </p>
        </div>
      )}

      {/* 3D Holographic Card Modal */}
      <HolographicCardModal
        member={active3DMember}
        onClose={() => setActive3DMember(null)}
      />

      {/* Reserved Slot Ruang Kosong */}
      <ScrapbookSlot id="members-custom-slot" hint="Ruang Kosong untuk Tambahan Kartu Profil Kustom Kamu" />
    </section>
  );
}
