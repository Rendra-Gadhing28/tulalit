import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Member } from "@/types";
import membersData from "@/data/members.json";
import { MemberDetailView } from "./MemberDetailView";

export function generateStaticParams() {
  return membersData.map((m) => ({ id: m.id }));
}

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const member = membersData.find((m) => m.id === id);

  if (!member) {
    return {
      title: "Anggota Tidak Ditemukan — XII PPLG 3",
    };
  }

  return {
    title: `${member.name} (${member.nickname}) — XII PPLG 3`,
    description: `Kartu kelulusan dan profil ${member.name} (${member.role}) dari circle Sogadev x Tulalit, XII PPLG 3.`,
    openGraph: {
      title: `${member.name} — Profil Anggota XII PPLG 3`,
      description: `"${member.quote}" — ${member.role}`,
    },
  };
}

export default async function MemberPage({ params }: Props) {
  const { id } = await params;
  const member = (membersData as Member[]).find((m) => m.id === id);

  if (!member) {
    notFound();
  }

  return <MemberDetailView member={member} />;
}
