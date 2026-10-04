# XII PPLG 3 — Sogadev × Tulalit: "Commit Terakhir"

> Website Kenangan Digital Scrapbook & Retro Yearbook Kelas XII PPLG 3 (Pengembangan Perangkat Lunak dan Gim).  
> **Tagline:** *"Git Push Kenangan, Sebelum Bel Terakhir."*

---

## 📖 Ringkasan Proyek

Website ini dibangun dengan gaya **Digital Scrapbook / Retro Yearbook + Bento Grid**, memadukan nuansa nostalgia kertas, polaroid, stiker die-cut, washi tape dengan budaya developer (terminal CLI, commit log, 3D interactive, trading card, achievement).

Dirancang khusus dengan **Adaptive Quality Engine 3-tier (`high`, `medium`, `low`)** agar tetap lancar di ponsel Android spek menengah ke bawah tanpa lag, dan bisa diakses offline berkat PWA terintegrasi.

---

## 🚀 Panduan Memulai Cepat

### Prasyarat
- [Bun](https://bun.sh/) (disarankan) atau Node.js 18+
- Modern Web Browser (Chrome, Safari, Firefox, Edge)

### Instalasi & Menjalankan Server Lokal
```bash
# 1. Masuk ke direktori proyek
cd /home/reren/website/tulalit

# 2. Pasang dependensi (sudah terpasang di workspace)
bun install

# 3. Jalankan development server
bun run dev

# 4. Buka di browser
# http://localhost:3000
```

### Build Produksi
```bash
bun run build
bun run start
```

---

## 🎨 Cara Kustomisasi Konten & Foto

### 1. Mengganti Tanggal Wisuda & Konfigurasi Global
Buka file `src/data/config.ts`:
```typescript
export const siteConfig = {
  className: "XII PPLG 3",
  circleName: "Sogadev × Tulalit",
  tagline: "Git Push Kenangan, Sebelum Bel Terakhir",
  graduationDate: "2026-06-15T08:00:00+07:00", // GANTI TANGGAL INI KE TANGGAL WISUDAMU
  academicYear: "2023 - 2026",
  // ...
};
```
*Catatan: Pada atau setelah tanggal `graduationDate`, Hero otomatis berganti menjadi ucapan **"Selamat Wisuda"**, animasi hujan toga/konfeti 3D otomatis meledak sekali, dan timer berubah menjadi hitung maju hari sejak kelulusan.*

### 2. Mengganti Foto Anggota & Galeri
- Foto anggota ditempatkan di folder `public/img/members/` (misal `001.webp`, `002.webp`, dst).
- Foto galeri kegiatan di folder `public/img/gallery/`.
- Foto placeholder SVG otomatis digunakan selama foto asli belum ditaruh.
- Untuk memperbarui data nama, peran, quote, hobi, dan akun sosial:
  - Anggota: `src/data/members.json`
  - Guru: `src/data/teachers.json`
  - Galeri: `src/data/gallery.json`
  - Timeline Git Log: `src/data/timeline.json`
  - Proyek: `src/data/projects.json`
  - Playlist Lagu: `src/data/playlist.json`
  - Quote & Guyonan: `src/data/quotes.json`
  - Gelar Superlatif: `src/data/awards.json`
  - Kilas Balik Wrapped: `src/data/wrapped.json`

---

## ☁️ Pengaturan Backend & Cloud (Supabase)

Website ini menggunakan **Dual Driver Adapter Pattern**:
- **Default (Zero-Config):** Berjalan 100% menggunakan `localStorage` di peramban pengguna. Tidak butuh koneksi server atau API key.
- **Mode Cloud (Supabase):** Aktif otomatis jika variabel lingkungan Supabase diisi.

### Langkah Setup Supabase:
1. Buat proyek baru di [Supabase Dashboard](https://supabase.com/).
2. Buka menu **SQL Editor**, lalu jalankan seluruh skrip dari file `supabase.sql`. Skrip ini membuat tabel `guestbook`, `time_capsule` (dengan RLS proteksi pesan terkunci), `awards_votes`, dan `arcade_scores`.
3. Salin file `.env.example` menjadi `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Masukkan URL dan Anon Key Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_ADMIN_EMAILS=admin@tulalit.smk.id
   ```

---

## 🛡️ Dasbor Moderasi Admin (`/admin`)

Halaman moderasi `/admin` digunakan oleh wali kelas atau tim developer untuk:
- Membaca dan menghapus pesan Buku Tamu yang tidak pantas.
- Memantau pesan Kapsul Waktu yang sudah terbuka.
- Mengaktifkan atau menutup voting Superlatif Class Awards.
- Mengunduh cadangan lengkap seluruh data situs ke file `.json`.

Akses admin dibatasi hanya untuk email yang didaftarkan pada variabel `NEXT_PUBLIC_ADMIN_EMAILS` atau `src/data/config.ts`.

---

## ⚡ Adaptive Quality Engine

Modul `src/lib/quality.tsx` mengelola 3 tingkat performa secara dinamis:
- **`high`**: Seluruh animasi GSAP, Lenis smooth scroll, 3D Hero Toga, efek konfeti/hujan toga instanced mesh, dan shader holografik aktif.
- **`medium`**: Efek 3D diringankan, partikel diminimalkan, Lenis tetap berjalan.
- **`low` (Mode Hemat)**: 3D nonaktif (diganti fallback 2D SVG/CSS), Lenis dinonaktifkan, animasi disederhanakan hanya `fade`/`slide`.
- Pengguna dapat mengaktifkan **Mode Hemat** secara manual kapan pun via tombol petir di navigasi mengambang atau Command Palette (`Ctrl+K`).

---

## 📱 PWA & Akses Offline

- Dilengkapi `manifest.ts` dan service worker `public/sw.js`.
- Pengguna ponsel dapat mengetuk prompt **"Pasang ke Layar Utama"** untuk menjadikan website sebagai aplikasi tersendiri di homescreen.
- Shell aplikasi, font, dan thumbnail tersimpan dalam cache sehingga halaman tetap bisa dibuka saat jaringan internet mati/offline.

---

## 🖨️ Buku Tahunan Cetak (`/yearbook`)

Kunjungi rute `/yearbook` untuk melihat versi cetak buku tahunan:
- Tata letak khusus media cetak (`@media print`) berstandar kertas **A4 / A5**.
- Lengkap dengan sampul, kata pengantar wali kelas, profil anggota per halaman, foto bapak/ibu guru, dan daftar penghargaan superlatif.
- Klik tombol **"Cetak / Simpan PDF"** di pojok kanan atas untuk mengekspor buku tahunan fisik berkualitas tinggi.

---

## 💾 Arsip Jangka Panjang & Cara Backup

Agar kenangan kelas ini tetap awet dan tidak hilang setelah puluhan tahun:
1. **Backup JSON Berkala:** Kunjungi `/admin` dan klik tombol **Ekspor Backup JSON**. Simpan file backup di Google Drive angkatan.
2. **Mirror Statis (GitHub Pages / Cloudflare Pages):**
   Next.js dikonfigurasi kompatibel dengan export statis (`bun run build`). Folder `out` dapat di-hosting gratis selamanya di GitHub Pages atau Cloudflare Pages tanpa biaya server.
3. **Domain & Hosting:**
   Proyek siap langsung di-deploy ke [Vercel](https://vercel.com/) dengan sekali klik (`vercel deploy`).

---

## 🕹️ Daftar Easter Egg Tersembunyi

1. **Konami Code:** Ketik `↑ ↑ ↓ ↓ ← → ← → B A` di keyboard untuk mengaktifkan Retro 8-bit Arcade Mode dan membuka pencapaian *Penemu Konami*.
2. **Terminal Footer:** Buka terminal di footer dan ketik perintah `sudo lulus` untuk melihat respon jenaka dan membuka pencapaian *Hacker Sejati*. Coba juga perintah `help`, `whoami`, `ls memories`, dan `clear`.
3. **Siput Tulalit:** Klik stiker logo siput 5 kali berturut-turut untuk membangunkan siput raksasa yang merayap di layar.
4. **Tiga Titik Terminal:** Klik bulatan merah/kuning/hijau di jendela terminal untuk memunculkan pesan error jenaka developer.
5. **Custom 404:** Buka rute sembarang yang tidak ada untuk melihat halaman *"404 — Kenangan ini belum di-commit"*.

---

*Dibuat dengan ❤️ & ☕ oleh Tim Pengembang Sogadev x Tulalit — XII PPLG 3 (2023 - 2026).*
