import React from "react";

export interface StickerDefinition {
  id: string;
  name: string;
  category: "dev" | "gim" | "sekolah" | "momen" | "ekspresi";
  render: () => React.ReactNode;
}

export const stickersRegistry: StickerDefinition[] = [
  // --- KATEGORI DEV (6 stiker) ---
  {
    id: "dev-code-tag",
    name: "Tag Kode",
    category: "dev",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <rect x="10" y="20" width="80" height="60" rx="12" fill="#1F2937" stroke="#ffffff" strokeWidth="5" />
        <path d="M35 38 L22 50 L35 62" stroke="#34D399" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M65 38 L78 50 L65 62" stroke="#34D399" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <line x1="56" y1="36" x2="44" y2="64" stroke="#F4B942" strokeWidth="5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "dev-bug",
    name: "Kumbang Bug",
    category: "dev",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <ellipse cx="50" cy="55" rx="24" ry="28" fill="#FF6B6B" stroke="#ffffff" strokeWidth="5" />
        <circle cx="50" cy="30" r="14" fill="#1F2937" stroke="#ffffff" strokeWidth="4" />
        <circle cx="44" cy="28" r="3" fill="#ffffff" />
        <circle cx="56" cy="28" r="3" fill="#ffffff" />
        <line x1="50" y1="35" x2="50" y2="80" stroke="#1F2937" strokeWidth="4" />
        <circle cx="38" cy="50" r="4" fill="#1F2937" />
        <circle cx="62" cy="62" r="4" fill="#1F2937" />
        <path d="M26 45 L10 40 M26 55 L8 55 M26 68 L12 75" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" />
        <path d="M74 45 L90 40 M74 55 L92 55 M74 68 L88 75" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "dev-coffee",
    name: "Kopi Begadang",
    category: "dev",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <rect x="25" y="35" width="46" height="48" rx="8" fill="#6B4F3A" stroke="#ffffff" strokeWidth="5" />
        <path d="M71 45 C85 45 85 65 71 65" fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
        <path d="M71 45 C85 45 85 65 71 65" fill="none" stroke="#F4B942" strokeWidth="4" strokeLinecap="round" />
        <path d="M36 28 Q40 20 36 14" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M48 28 Q52 20 48 14" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M60 28 Q64 20 60 14" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
        <text x="36" y="65" fill="#FFF8E7" fontSize="16" fontWeight="bold" fontFamily="sans-serif">JS</text>
      </svg>
    ),
  },
  {
    id: "dev-terminal",
    name: "Terminal Mini",
    category: "dev",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <rect x="12" y="24" width="76" height="52" rx="6" fill="#111827" stroke="#ffffff" strokeWidth="5" />
        <circle cx="22" cy="32" r="3" fill="#FF6B6B" />
        <circle cx="30" cy="32" r="3" fill="#F4B942" />
        <circle cx="38" cy="32" r="3" fill="#34D399" />
        <text x="20" y="55" fill="#34D399" fontSize="16" fontFamily="monospace" fontWeight="bold">&gt;_</text>
      </svg>
    ),
  },
  {
    id: "dev-git-commit",
    name: "Git Node",
    category: "dev",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="50" cy="50" r="28" fill="#F05032" stroke="#ffffff" strokeWidth="6" />
        <circle cx="50" cy="50" r="14" fill="#ffffff" />
        <line x1="15" y1="50" x2="36" y2="50" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
        <line x1="64" y1="50" x2="85" y2="50" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "dev-react-atom",
    name: "Atom React",
    category: "dev",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="50" cy="50" r="8" fill="#61DAFB" stroke="#ffffff" strokeWidth="3" />
        <ellipse cx="50" cy="50" rx="36" ry="12" fill="none" stroke="#61DAFB" strokeWidth="4" transform="rotate(0 50 50)" />
        <ellipse cx="50" cy="50" rx="36" ry="12" fill="none" stroke="#61DAFB" strokeWidth="4" transform="rotate(60 50 50)" />
        <ellipse cx="50" cy="50" rx="36" ry="12" fill="none" stroke="#61DAFB" strokeWidth="4" transform="rotate(120 50 50)" />
      </svg>
    ),
  },

  // --- KATEGORI GIM (6 stiker) ---
  {
    id: "gim-controller",
    name: "Stik Game Retro",
    category: "gim",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <rect x="14" y="32" width="72" height="42" rx="14" fill="#3B82F6" stroke="#ffffff" strokeWidth="5" />
        <rect x="25" y="47" width="18" height="6" rx="2" fill="#1F2937" />
        <rect x="31" y="41" width="6" height="18" rx="2" fill="#1F2937" />
        <circle cx="68" cy="46" r="4.5" fill="#EF4444" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="76" cy="54" r="4.5" fill="#F59E0B" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="60" cy="54" r="4.5" fill="#10B981" stroke="#ffffff" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: "gim-heart",
    name: "Pixel Heart",
    category: "gim",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path
          d="M30 25 H45 V40 H55 V25 H70 V40 H80 V55 H70 V70 H55 V80 H45 V70 H30 V55 H20 V40 H30 Z"
          fill="#EF4444"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinejoin="miter"
        />
        <rect x="30" y="35" width="8" height="8" fill="#FCA5A5" />
      </svg>
    ),
  },
  {
    id: "gim-potion",
    name: "Ramuan Mana",
    category: "gim",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <rect x="42" y="16" width="16" height="8" rx="2" fill="#6B4F3A" stroke="#ffffff" strokeWidth="3" />
        <path d="M46 24 L46 36 L24 72 C22 78 26 84 34 84 L66 84 C74 84 78 78 76 72 L54 36 L54 24 Z" fill="#8B5CF6" stroke="#ffffff" strokeWidth="5" />
        <circle cx="44" cy="65" r="4" fill="#C4B5FD" />
        <circle cx="56" cy="55" r="3" fill="#C4B5FD" />
      </svg>
    ),
  },
  {
    id: "gim-sword",
    name: "Pedang Pixel",
    category: "gim",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <line x1="25" y1="75" x2="75" y2="25" stroke="#38BDF8" strokeWidth="10" strokeLinecap="square" />
        <line x1="75" y1="25" x2="82" y2="18" stroke="#ffffff" strokeWidth="6" strokeLinecap="square" />
        <line x1="28" y1="62" x2="42" y2="76" stroke="#F4B942" strokeWidth="8" strokeLinecap="square" />
        <rect x="18" y="76" width="10" height="10" fill="#6B4F3A" stroke="#ffffff" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "gim-coin",
    name: "Koin Emas",
    category: "gim",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="50" cy="50" r="32" fill="#F59E0B" stroke="#ffffff" strokeWidth="6" />
        <circle cx="50" cy="50" r="24" fill="#FCD34D" stroke="#D97706" strokeWidth="3" />
        <text x="45" y="58" fontSize="24" fontWeight="black" fill="#B45309" fontFamily="sans-serif">★</text>
      </svg>
    ),
  },
  {
    id: "gim-ghost",
    name: "Ghost 8-bit",
    category: "gim",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path d="M25 50 C25 32 75 32 75 50 L75 78 L65 70 L55 78 L45 70 L35 78 L25 70 Z" fill="#EC4899" stroke="#ffffff" strokeWidth="5" />
        <circle cx="40" cy="48" r="6" fill="#ffffff" />
        <circle cx="42" cy="48" r="3" fill="#1E3A8A" />
        <circle cx="60" cy="48" r="6" fill="#ffffff" />
        <circle cx="62" cy="48" r="3" fill="#1E3A8A" />
      </svg>
    ),
  },

  // --- KATEGORI SEKOLAH (6 stiker) ---
  {
    id: "sekolah-toga",
    name: "Topi Toga",
    category: "sekolah",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <polygon points="50,22 88,38 50,54 12,38" fill="#1E293B" stroke="#ffffff" strokeWidth="5" />
        <path d="M28 46 L28 62 C28 72 72 72 72 62 L72 46" fill="#1E293B" stroke="#ffffff" strokeWidth="4" />
        <path d="M50 38 L84 56 L84 72" fill="none" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
        <circle cx="84" cy="74" r="4" fill="#F59E0B" />
      </svg>
    ),
  },
  {
    id: "sekolah-ijazah",
    name: "Gulungan Ijazah",
    category: "sekolah",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <rect x="20" y="38" width="60" height="24" rx="4" fill="#FFFBEB" stroke="#ffffff" strokeWidth="5" />
        <ellipse cx="20" cy="50" rx="6" ry="12" fill="#FEF3C7" stroke="#ffffff" strokeWidth="3" />
        <ellipse cx="80" cy="50" rx="6" ry="12" fill="#FEF3C7" stroke="#ffffff" strokeWidth="3" />
        <rect x="46" y="36" width="8" height="28" fill="#EF4444" stroke="#ffffff" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "sekolah-bell",
    name: "Bel Pulang",
    category: "sekolah",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path d="M50 20 C38 20 32 32 32 54 L24 68 L76 68 L68 54 C68 32 62 20 50 20 Z" fill="#FBBF24" stroke="#ffffff" strokeWidth="5" />
        <circle cx="50" cy="76" r="6" fill="#B45309" stroke="#ffffff" strokeWidth="3" />
        <circle cx="50" cy="16" r="4" fill="#B45309" stroke="#ffffff" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "sekolah-pensil",
    name: "Pensil Kuning",
    category: "sekolah",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" transform="rotate(-30 50 50)">
        <polygon points="50,15 42,32 58,32" fill="#FDE68A" stroke="#ffffff" strokeWidth="3" />
        <polygon points="50,15 46,24 54,24" fill="#1F2937" />
        <rect x="42" y="32" width="16" height="42" fill="#F59E0B" stroke="#ffffff" strokeWidth="3" />
        <rect x="42" y="74" width="16" height="6" fill="#9CA3AF" stroke="#ffffff" strokeWidth="2" />
        <rect x="42" y="80" width="16" height="10" rx="3" fill="#F87171" stroke="#ffffff" strokeWidth="3" />
      </svg>
    ),
  },
  {
    id: "sekolah-buku",
    name: "Buku Catatan",
    category: "sekolah",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <rect x="22" y="24" width="56" height="56" rx="6" fill="#0284C7" stroke="#ffffff" strokeWidth="5" />
        <rect x="22" y="24" width="12" height="56" rx="2" fill="#0369A1" stroke="#ffffff" strokeWidth="3" />
        <line x1="42" y1="40" x2="68" y2="40" stroke="#BAE6FD" strokeWidth="4" strokeLinecap="round" />
        <line x1="42" y1="52" x2="68" y2="52" stroke="#BAE6FD" strokeWidth="4" strokeLinecap="round" />
        <line x1="42" y1="64" x2="60" y2="64" stroke="#BAE6FD" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "sekolah-badge",
    name: "Lencana Juara",
    category: "sekolah",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path d="M40 56 L30 84 L50 76 L70 84 L60 56" fill="#3B82F6" stroke="#ffffff" strokeWidth="4" />
        <circle cx="50" cy="42" r="24" fill="#F59E0B" stroke="#ffffff" strokeWidth="5" />
        <text x="44" y="50" fontSize="22" fontWeight="bold" fill="#78350F" fontFamily="sans-serif">1</text>
      </svg>
    ),
  },

  // --- KATEGORI MOMEN (6 stiker) ---
  {
    id: "momen-kamera",
    name: "Kamera Polaroid",
    category: "momen",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <rect x="18" y="28" width="64" height="52" rx="10" fill="#E2E8F0" stroke="#ffffff" strokeWidth="5" />
        <circle cx="50" cy="56" r="16" fill="#1E293B" stroke="#ffffff" strokeWidth="4" />
        <circle cx="50" cy="56" r="8" fill="#38BDF8" />
        <circle cx="70" cy="38" r="4" fill="#EF4444" />
        <line x1="26" y1="36" x2="44" y2="36" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "momen-tape",
    name: "Washi Tape Garis",
    category: "momen",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <polygon points="10,38 90,30 88,54 8,62" fill="#FDE047" stroke="#ffffff" strokeWidth="3" opacity="0.9" />
        <line x1="25" y1="36" x2="22" y2="58" stroke="#CA8A04" strokeWidth="3" strokeDasharray="3,3" />
        <line x1="45" y1="34" x2="42" y2="56" stroke="#CA8A04" strokeWidth="3" strokeDasharray="3,3" />
        <line x1="65" y1="32" x2="62" y2="54" stroke="#CA8A04" strokeWidth="3" strokeDasharray="3,3" />
      </svg>
    ),
  },
  {
    id: "momen-pin",
    name: "Paku Payung Merah",
    category: "momen",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="50" cy="40" r="16" fill="#EF4444" stroke="#ffffff" strokeWidth="4" />
        <circle cx="46" cy="36" r="5" fill="#FCA5A5" />
        <line x1="50" y1="56" x2="50" y2="80" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "momen-kaset",
    name: "Kaset Jadul",
    category: "momen",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <rect x="14" y="30" width="72" height="46" rx="6" fill="#334155" stroke="#ffffff" strokeWidth="5" />
        <rect x="26" y="40" width="48" height="26" rx="4" fill="#F1F5F9" />
        <circle cx="38" cy="53" r="6" fill="#334155" />
        <circle cx="62" cy="53" r="6" fill="#334155" />
      </svg>
    ),
  },
  {
    id: "momen-bintang",
    name: "Bintang Kemilau",
    category: "momen",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <polygon
          points="50,12 62,38 90,40 68,58 75,86 50,70 25,86 32,58 10,40 38,38"
          fill="#FBBF24"
          stroke="#ffffff"
          strokeWidth="6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "momen-confetti",
    name: "Letupan Pesta",
    category: "momen",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <polygon points="20,70 42,86 30,55" fill="#F43F5E" stroke="#ffffff" strokeWidth="3" />
        <circle cx="58" cy="30" r="5" fill="#3B82F6" stroke="#ffffff" strokeWidth="2" />
        <circle cx="78" cy="46" r="4" fill="#10B981" stroke="#ffffff" strokeWidth="2" />
        <rect x="62" y="60" width="8" height="8" rx="2" fill="#F59E0B" transform="rotate(25 66 64)" stroke="#ffffff" strokeWidth="2" />
        <line x1="38" y1="56" x2="68" y2="28" stroke="#EC4899" strokeWidth="3" strokeDasharray="3,3" />
      </svg>
    ),
  },

  // --- KATEGORI EKSPRESI (6 stiker) ---
  {
    id: "ekspresi-siput",
    name: "Siput Tulalit",
    category: "ekspresi",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        {/* Cangkang spiral siput */}
        <circle cx="44" cy="50" r="24" fill="#F59E0B" stroke="#ffffff" strokeWidth="5" />
        <path d="M44 50 m -16 0 a 16 16 0 1 0 32 0 a 16 16 0 1 0 -32 0" fill="none" stroke="#B45309" strokeWidth="3" />
        {/* Badan siput */}
        <path d="M20 74 C35 74 70 74 80 66 C86 60 84 46 80 44" fill="#34D399" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
        {/* Antena mata */}
        <line x1="80" y1="44" x2="86" y2="30" stroke="#34D399" strokeWidth="4" strokeLinecap="round" />
        <circle cx="88" cy="28" r="4" fill="#1F2937" stroke="#ffffff" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "ekspresi-loading",
    name: "Spinner Tulalit",
    category: "ekspresi",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md animate-spin" style={{ animationDuration: "6s" }}>
        <circle cx="50" cy="50" r="32" fill="none" stroke="#E2E8F0" strokeWidth="8" />
        <circle cx="50" cy="50" r="32" fill="none" stroke="#F59E0B" strokeWidth="8" strokeDasharray="60 140" strokeLinecap="round" />
        <text x="36" y="55" fontSize="14" fontWeight="bold" fill="#B45309" fontFamily="monospace">99%</text>
      </svg>
    ),
  },
  {
    id: "ekspresi-jempol",
    name: "Mantap Rek",
    category: "ekspresi",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path
          d="M32 50 L32 78 L20 78 L20 50 Z M34 50 L46 22 C48 18 54 18 56 22 L56 38 L76 38 C82 38 84 44 80 50 L72 74 C70 78 64 78 60 78 L34 78 Z"
          fill="#FBBF24"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "ekspresi-api",
    name: "Menyala Abangkuh",
    category: "ekspresi",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path
          d="M50 15 C55 35 75 40 75 60 C75 75 64 85 50 85 C36 85 25 75 25 60 C25 45 40 32 44 26 C44 32 48 36 52 36 C52 26 50 15 50 15 Z"
          fill="#EF4444"
          stroke="#ffffff"
          strokeWidth="5"
        />
        <path
          d="M50 48 C54 56 62 60 62 70 C62 76 56 80 50 80 C44 80 38 76 38 70 C38 62 46 56 48 52 Z"
          fill="#F59E0B"
        />
      </svg>
    ),
  },
  {
    id: "ekspresi-peace",
    name: "Peace & Chill",
    category: "ekspresi",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="50" cy="50" r="34" fill="#38BDF8" stroke="#ffffff" strokeWidth="5" />
        <circle cx="50" cy="50" r="34" fill="none" stroke="#ffffff" strokeWidth="4" />
        <line x1="50" y1="16" x2="50" y2="84" stroke="#ffffff" strokeWidth="6" />
        <line x1="50" y1="50" x2="26" y2="74" stroke="#ffffff" strokeWidth="6" />
        <line x1="50" y1="50" x2="74" y2="74" stroke="#ffffff" strokeWidth="6" />
      </svg>
    ),
  },
  {
    id: "ekspresi-nangis",
    name: "Bakal Kangen",
    category: "ekspresi",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="50" cy="50" r="34" fill="#FDE047" stroke="#ffffff" strokeWidth="5" />
        <ellipse cx="38" cy="42" rx="4" ry="6" fill="#1F2937" />
        <ellipse cx="62" cy="42" rx="4" ry="6" fill="#1F2937" />
        <path d="M40 68 Q50 56 60 68" stroke="#1F2937" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* Air mata */}
        <path d="M38 52 Q35 62 38 70 Q42 62 38 52" fill="#38BDF8" />
        <path d="M62 52 Q59 62 62 70 Q66 62 62 52" fill="#38BDF8" />
      </svg>
    ),
  },
];
