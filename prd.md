# Product Requirement Document (PRD)
## Website Kenangan Kelas "XII PPLG 3 — Sogadev x Tulalit"

- **Nama Proyek:** Commit Terakhir
- **Tagline:** "Git Push Kenangan, Sebelum Bel Terakhir"
- **Kelas:** XII PPLG 3 (Pengembangan Perangkat Lunak dan Gim)
- **Target Platform:** Web (Mobile-First Android Responsive 360px–1440px, Desktop)
- **Deploy Target:** Vercel

---

## 1. Executive Summary & Visi Produk
Website kenangan kelas interaktif bergaya **Digital Scrapbook / Retro Yearbook + Bento Grid** dengan sentuhan kultur developer dan game dev. Website ini memadukan dualitas circle kelas:
- **Sogadev:** Representasi sisi developer, komitmen, kreativitas teknis, dan kerja keras.
- **Tulalit:** Representasi sisi santai, kelambatan yang menjadi bahan humor, humor hangat, dan kekompakan.

**Prinsip Utama:**
- Nostalgia, hangat, humoris, sedikit chaotic namun tetap terstruktur dan rapi.
- *Performance-First*: "Berat" secara visual dan detail diizinkan, tetapi **pantang lag**.
- 75% traffic diperkirakan dari perangkat Android kelas menengah ke bawah, sehingga sistem **Adaptive Quality Engine** menjadi pilar vital.

---

## 2. Target Pengguna & Persona
1. **Siswa XII PPLG 3 (Core):** Bernostalgia, melihat kartu profil mereka, mencoba 3D cards, bermain di Sticker Board, dan mengisi Buku Tamu.
2. **Guru & Wali Kelas:** Membaca pesan dedikasi, melihat kembali perjalanan 3 tahun siswa mereka, menerima ucapan terima kasih.
3. **Orang Tua & Keluarga:** Melihat dokumentasi karya dan perjalanan belajar anak-anak mereka.
4. **Adik Kelas & Alumni:** Terinspirasi oleh karya, kultur kelas, dan kebersamaan XII PPLG 3.

---

## 3. Arsitektur Teknis & Tech Stack

| Layer | Pilihan Teknologi | Alasan / Catatan |
|---|---|---|
| **Framework** | Next.js (App Router) + TypeScript Strict | SSR/SSG, Metadata API, dynamic imports, zero-config deployment. |
| **Styling** | Tailwind CSS + CSS Variables | Desain token dinamis, light/dark theme, zero runtime CSS overhead. |
| **Animasi UI** | Framer Motion (`motion`) | Layout animations, gestures, polaroid shared-element transition. |
| **Scroll Storytelling** | GSAP + ScrollTrigger | Presisi timeline Git Log, parallax, pinned sections. Bersihkan via `gsap.context()`. |
| **Smooth Scroll** | Lenis | Sinkronisasi dengan ScrollTrigger. Wajib dinonaktifkan di Mode Hemat/reduced motion. |
| **Grafis 3D** | React Three Fiber (R3F) + `@react-three/drei` + `three` | Toga 3D hero, kartu holografik, selebrasi wisuda. Wajib lazy import, fallback 2D. |
| **Guestbook Engine** | Adapter Pattern (`guestbookService`) | Dual driver: `LocalStorageDriver` (default) & `SupabaseDriver` (RLS secure). |
| **Interaktivitas Tambahan** | `canvas-confetti`, `html-to-image`, `lucide-react`, Web Audio / `howler` | Stiker kustom Pointer Events, sound effects (default MUTE). |

---

## 4. Adaptive Quality Engine (`lib/quality.ts`)

Sistem adaptif 3-tingkat untuk menjamin kelancaran di ponsel murah:
```
           [Deteksi Perangkat / Benchmark Awal]
                          │
       ┌──────────────────┼──────────────────┐
       ▼                  ▼                  ▼
   [High Tier]       [Medium Tier]       [Low Tier / Mode Hemat]
  • 3D Canvas Lengkap • 3D Hanya Hero    • Tanpa 3D (Fallback 2D/CSS)
  • Parallax & Pin    • Parallax Sedang  • Tanpa Lenis / Smooth Scroll
  • Lenis Aktif       • Tanpa Partikel   • Tanpa Pin GSAP (Simple Reveal)
  • Partikel 3D       • dpr [1, 1.25]    • Animasi Dasar (Fade/Slide)
```

### Parameter Heuristik:
- `navigator.hardwareConcurrency` (< 4 -> Medium/Low)
- `navigator.deviceMemory` (< 4GB -> Low, < 8GB -> Medium)
- `navigator.connection.saveData` === true -> Auto Low
- `prefers-reduced-motion` -> Auto Low
- Runtime FPS Benchmark: Uji performa 1 detik saat loading awal, jika < 40 FPS otomatis downgrade ke tier di bawahnya.
- Manual Override: Toggle "Mode Hemat" & "Kurangi Animasi" yang disimpan di `localStorage`.

---

## 5. Design System & Tokens

### 5.1 Skema Warna (WCAG AA Compliant)
- **Tema Terang (Scrapbook Kertas):**
  - Background: Kertas `#FFF8E7`, `#F7F1E3` dengan tekstur subtle CSS lines/grid.
  - Teks: Navy Gelap `#1F2937`, Coklat Tua `#6B4F3A`.
  - Aksen: Mustard `#F4B942`, Coral `#FF6B6B`, Sage `#9DC08B`, Sky `#7DD3FC`.
  - Aksen Dev: Emerald Terminal `#34D399` (dibatasi pada blok terminal/commit).
- **Tema Gelap ("Malam Begadang Ngoding"):**
  - Background: Deep Navy `#0F172A`, `#1E293B`.
  - Teks: Off-White `#F8FAFC`, Muted Slate `#94A3B8`.
  - Aksen tetap hangat dan kontras tinggi.

### 5.2 Tipografi
- **Headings / Hand-drawn:** `Caveat` (Google Font via `next/font`)
- **Body / Interface:** `Plus Jakarta Sans`
- **Code / Commits / Stats:** `JetBrains Mono`
- **Pixel / Badges / Achievements:** `Press Start 2P`

### 5.3 Komponen UI Reusable
1. `Polaroid`: Frame putih, rotasi deterministik (hash id, bebas hydration mismatch), washi tape SVG dekoratif.
2. `StickyNote`: Catatan tempel dengan 4 varian warna, bayangan kertas terangkat, pin/tape.
3. `PhotoCard`: Trading card siswa dengan flip animasi 3D CSS, badge rarity, stats hobi, dan tombol download PNG.
4. `TerminalWindow`: Jendela terminal Linux/macOS dengan 3 dots interaktif dan command parser.
5. `Sticker`: Die-cut sticker outline putih tebal + drop shadow (`pointer-events: none` jika dekoratif).
6. `BentoGrid & BentoCell`: Layout grid modular responsif (1 kolom mobile -> 4 kolom desktop).
7. `FloatingNav`: Pill bar terapung (bottom mobile, top desktop) dengan status indikator section aktif.

### 5.4 Arsitektur Ruang Kosong & Slot Komponen Kustom (Breathing Room & Decoration Slots)
Menjawab kebutuhan penambahan foto dan hiasan kustom dari user:
1. **Breathing Spacing Budget:** Setiap section memiliki padding lega (`py-16 md:py-24`, margin kontainer lebar, grid gap `gap-6 md:gap-10`) agar penambahan elemen baru tidak terasa sesak (*cluttered*).
2. **Anchor Slots (`ScrapbookSlot`):** Menyediakan titik penempatan dekorasi siap pakai di sudut-sudut grid dan sela-sela paragraf (`data-slot="user-decoration"`) dengan `pointer-events: none` agar tidak menghalangi klik/baca.
3. **Pluggable Photo Containers:** Komponen polaroid dan kartu mendukung prop kustom `customBadge`, `overlaySticker`, dan `additionalAssets` sehingga aset foto atau stiker tambahan dapat disuntikkan dengan mudah tanpa merombak struktur layout.

---

## 6. Spesifikasi Fitur & Section (12 Modul)

### 6.1 Loading Screen & Hero
- **Loading:** Teks "Loading kenangan... 99% (Tulalit)" dengan joke freeze sejenak, lalu animasi sobekan kertas. Sekaligus melakukan FPS benchmark kilat.
- **Hero Banner:** Typo heading Caveat besar, foto polaroid kelas miring, 3D Hero Toga melayang dengan stiker 3D tipis (`</>`, bintang, controller).
- **Subjudul:** Typewriter effect dengan kursor berkedip.
- **Countdown Wisuda:** LED/Pixel timer countdown. Saat 0: memicu efek wisuda (konfeti + toga rain).

### 6.2 Tentang Kita ("About Sogadev x Tulalit")
- Cerita asal-usul persilangan kultur developer dan humor tulalit.
- Logo interaktif: Stiker `</>` dan Siput/Spinner saling bertabrakan dengan pegas physics saat scroll into view.
- Bento Counter Stats: Jumlah Siswa, Proyek Selesai, Baris Kode, "Bug yang Dimaafkan".

### 6.3 Timeline "Git Log"
- Visualisasi commit tree dengan garis cabang SVG yang ter-render dinamis mengikuti scroll (GSAP ScrollTrigger).
- Node commit menyala ketika mencapai checkpoint:
  1. `feat(mpls): commit perdana, masih saling jaim`
  2. `feat(kelas-x): kenal algoritma & pascal/c++ pertama`
  3. `feat(kelas-xi): full stack begadang & game engine`
  4. `feat(pkl): deploy ke dunia industri nyata`
  5. `feat(ujikom): drama sertifikasi kompetensi`
  6. `feat(study-tour): refreshing sebelum masa kritis`
  7. `feat(final-project): commit begadang 7 hari 7 malam`
  8. `release(v1.0): wisuda kelulusan XII PPLG 3`
- Modal detail commit foto + cerita arsip.

### 6.4 Galeri Scrapbook & Lightbox
- Masonry polaroid layout dengan filter kategori: *Semua, Kelas, PKL, Study Tour, Lomba, Candid, Praktikum*.
- Animasi relayout instan via Framer Motion `layout`.
- Lightbox Modal: Shared-element transition dari polaroid ke layar penuh, navigasi keyboard (Esc, panah), swipe gesture mobile, double tap / pinch zoom.

### 6.5 Contributors / Anggota Kelas
- Trading card grid untuk seluruh anggota kelas (Common, Rare, Epic, Legendary).
- Kartu Epic & Legendary dilengkapi aksen iridescent holographic foil.
- Interaksi:
  - Klik flip untuk melihat bagian belakang (bio, hobi, bahasa favorit, link portofolio).
  - Tombol "Download Kartu" (menghasilkan kartu 2x resolution PNG via `html-to-image`).
  - Tombol "Lihat 3D" (hanya Epic/Legendary): Membuka viewer 3D Canvas modal interaktif (drag/rotate).

### 6.6 Guru & Wali Kelas ("The Mentors")
- Amplop surat interaktif yang terbuka saat diklik menampilkan foto dan pesan guru.
- Spotlight khusus untuk Wali Kelas.
- Tombol aksi: "Kirim Ucapan Terima Kasih" yang otomatis mengisi template di form Buku Tamu.

### 6.7 Karya Kita (Showcase Portofolio)
- Grid kartu proyek: Web App, Mobile App, Game 2D/3D, UI/UX Design.
- Tech stack badge, deskripsi singkat, tombol Live Demo dan GitHub Repo.

### 6.8 Dinding Quote & Meme
- Dinding sticky notes dengan quote ikonik siswa/guru.
- Galeri meme kelas dengan tombol like/emoji reaction lokal.
- Mesin Gacha "Quote Acak": Animasi tuas/kapsul yang mengeluarkan quote tak terduga.

### 6.9 Playlist "Radio Tulalit"
- Visual kaset pita / piringan hitam berputar saat lagu aktif.
- Kontrol audio: Play/Pause, Next/Prev, Mute toggle di navbar global.
- Web Audio Synth / audio player tanpa autoplay (kebijakan anti-annoying).

### 6.10 Sticker Board ("Papan Gabus Interaktif")
- Kanvas papan gabus bebas tempel.
- Laci stiker (min 30 SVG die-cut stickers: kategori Dev, Game, Sekolah, Ekspresi).
- Interaksi sentuh/mouse murni via Pointer Events (Drag, Rotate, Resize, Delete, Z-index bring to front).
- Ekspor papan gabus menjadi file gambar PNG.

### 6.11 Buku Tamu ("Guestbook Commit")
- Form input: Nama, Hubungan (Teman, Guru, Ortu, Alumni), Pesan (maks 280 char), Warna Sticky Note.
- Sanitasi input XSS, filter kata kasar lokal (`badwords.ts`), rate-limit (1 pesan / 60 detik per device, maks 5 per hari).
- Dual Storage Adapter:
  - Driver Default: LocalStorage.
  - Driver Cloud: Supabase Database dengan skema RLS (anon insert & select only).

### 6.12 Footer & Easter Eggs
- Kredit pembuat, build stack, release hash.
- **Terminal Tersembunyi:** CLI interaktif (`help`, `whoami`, `sudo lulus`, `ls memories`, `cat quote`, `clear`).
- **Konami Code:** Mode 8-bit retro + audio beep chiptune.
- **Siput Tulalit:** Klik logo 5x memunculkan siput berjalan lambat melintasi layar.
- **Terminal Dot Trick:** Klik tombol dot window terminal menghasilkan error report konyol.
- **Halaman 404 Kustom:** "404: Kenangan Ini Belum Di-Commit".

---

## 7. Rencana Data & Skema (`src/data/`)
Semua konten bersifat modular dan terpisah dari komponen:
- `config.ts`: Metadata sekolah, tanggal wisuda, konfigurasi feature flags.
- `members.json`: Array biodata 12+ anggota contoh lengkap dengan atribut rarity dan stiker.
- `timeline.json`: Milestone bersejarah kelas.
- `gallery.json`: Koleksi foto dengan metadata tag dan rasio.
- `teachers.json`: Data guru pembimbing & wali kelas.
- `projects.json`: Arsip aplikasi dan game buatan siswa.
- `quotes.json` & `memes.json`: Koleksi quote & meme kelas.
- `playlist.json`: Daftar lagu nostalgia.
- `stickers.ts`: Registry stiker SVG inline berbobot ringan.
- `badwords.ts`: Daftar filter kata kasar untuk perlindungan buku tamu.

---

## 8. Non-Functional Requirements & Performance Budget
1. **LCP & FCP:** LCP < 2.5s pada koneksi 4G mobile.
2. **Bundle Size:** Initial JS < 350KB gzip. Semua modul berat (Three.js, html-to-image, canvas-confetti) di-chunk dan di-lazy load dinamis (`next/dynamic` ssr: false).
3. **Accessibility:** WCAG AA Contrast, aria-labels lengkap, focus trap pada modal, full keyboard navigation, respektif terhadap `prefers-reduced-motion`.
4. **Resilience:** WebGL context loss graceful recovery ke fallback 2D SVG/CSS.

---

## 9. Phased Execution Roadmap
- **Fase 1:** Setup pondasi, design tokens, Quality Engine, Hero & Navigation, Lenis.
- **Fase 2:** Galeri Lightbox, Contributors Card & Download PNG, Timeline GSAP, Mentors.
- **Fase 3:** Buku Tamu Adapter (Local + Supabase), Showcase Karya, Quote & Meme Gacha, Radio Playlist, Sticker Board.
- **Fase 4:** 3D Holographic Card Viewer, Wisuda 3D Celebration, Easter Eggs CLI & Konami, Polishing & Lighthouse Audit.
