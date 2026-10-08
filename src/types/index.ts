export type QualityLevel = "high" | "medium" | "low";

export type Theme = "light" | "dark";

export type Rarity = "Common" | "Rare" | "Epic" | "Legendary";

export interface Member {
  id: string;
  name: string;
  nickname: string;
  role: string;
  rarity: Rarity;
  quote: string;
  favoriteLang: string;
  hobby: string;
  photo: string;
  photoPosition?: string;
  stickers: string[];
  social?: {
    instagram?: string;
    github?: string;
    linkedin?: string;
  };
}

export interface TimelineItem {
  id: string;
  hash: string;
  title: string;
  date: string;
  story: string;
  tag: string;
  photos?: string[];
}

export type GalleryCategory =
  | "Semua"
  | "Kelas"
  | "Nongski"
  | "Outingclass"
  | "Outing Class"
  | "Nyawit";

export interface GalleryItem {
  id: string;
  src: string;
  caption: string;
  category: Exclude<GalleryCategory, "Semua">;
  date: string;
  aspect?: "square" | "portrait" | "landscape";
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  message: string;
  photo: string;
  isHomeroom?: boolean;
}

export type ProjectCategory = "Semua" | "Web" | "Mobile" | "Game" | "UI/UX";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: Exclude<ProjectCategory, "Semua">;
  techStack: string[];
  authors: string[];
  image: string;
  demoUrl?: string | null;
  repoUrl?: string | null;
}

export interface QuoteItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  color: "mustard" | "coral" | "sage" | "sky";
}

export interface MemeItem {
  id: string;
  title: string;
  image: string;
  initialLikes: number;
  caption: string;
}

export interface PlaylistItem {
  id: string;
  title: string;
  artist: string;
  duration: string;
  cover: string;
  spotifyUri?: string;
}

export interface StickerBoardElement {
  id: string;
  stickerId: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  zIndex: number;
}

export type GuestbookRelationship =
  | "teman"
  | "guru"
  | "ortu"
  | "alumni"
  | "adik_kelas"
  | "hts"
  | "temen_lv_2"
  | "crush"
  | "ridwan";

export interface GuestbookEntry {
  id: string;
  name: string;
  relationship: GuestbookRelationship;
  message: string;
  color: "mustard" | "coral" | "sage" | "sky";
  createdAt: string;
  isLocal?: boolean;
}

export interface ConfigData {
  className: string;
  circleName: string;
  tagline: string;
  schoolName: string;
  academicYear: string;
  graduationDate: string; // ISO 8601
  musicEnabled: boolean;
  supabaseEnabled: boolean;
  socialLinks: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  credits: {
    devs: string[];
    designers: string[];
    specialThanks: string[];
  };
  timeCapsuleDates?: {
    oneYear: string;
    threeYears: string;
    fiveYears: string;
  };
  adminEmails?: string[];
}

export interface AwardCategory {
  id: string;
  title: string;
  description: string;
  icon?: string;
  candidates: "all" | string[];
}

export interface AwardVote {
  categoryId: string;
  voterDeviceId: string;
  candidateId: string;
  createdAt: string;
}

export interface AwardResult {
  categoryId: string;
  rankings: {
    memberId: string;
    voteCount: number;
  }[];
}

export interface WrappedSlide {
  id: string;
  title: string;
  subtitle: string;
  metric: string;
  metricLabel: string;
  description: string;
  bgColor: string;
  accentColor: string;
  stickerId?: string;
  extraList?: string[];
}

export interface TimeCapsuleMessage {
  id: string;
  authorName: string;
  message: string;
  prediction2031?: string;
  unlockAt: string; // ISO 8601
  createdAt: string;
  isUnlocked: boolean;
  isLocal?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface ArcadeScore {
  game: "memory" | "bug_catcher";
  playerName: string;
  score: number;
  playedAt: string;
}
