import type { ConfigData } from "@/types";

export const siteConfig: ConfigData = {
  className: "XII PPLG 3",
  circleName: "Sogadev x Tulalit",
  tagline: "Git Push Kenangan, Sebelum Bel Terakhir",
  schoolName: "SMK 8 Semarang",
  academicYear: "2025 - 2027",
  // GANTI TANGGAL INI DENGAN TANGGAL KELULUSAN / WISUDA ASLI KELAS KALIAN
  graduationDate: "2027-06-15T08:00:00+07:00",
  musicEnabled: true,
  supabaseEnabled: Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
  ),
  socialLinks: {
    instagram: "https://instagram.com/sogadev.tulalit",
    tiktok: "https://tiktok.com/@xiipplg3",
    youtube: "https://youtube.com/@sogadevofficial",
  },
  credits: {
    devs: ["Arkamudya (Lead)", "Rendra (Frontend)", "Najwa (Backend)"],
    designers: ["Kalyca (UI/UX)", "Tasya (Art)"],
    specialThanks: [
      "Ibu Ratna, S.Kom (Wali Kelas Tercinta)",
      "Pak Joko (Guru Pemrograman Web)",
      "Kantin Mbak Sri (Penyelamat Begadang)",
    ],
  },
  timeCapsuleDates: {
    oneYear: "2027-06-15T00:00:00+07:00",
    threeYears: "2029-06-15T00:00:00+07:00",
    fiveYears: "2031-06-15T00:00:00+07:00",
  },
  adminEmails: (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "admin@tulalit.smk.id").split(","),
};

export const config = siteConfig;
