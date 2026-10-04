-- ====================================================================
-- Skema Database Supabase Lengkap untuk "Commit Terakhir"
-- XII PPLG 3 — Sogadev x Tulalit
-- ====================================================================

-- 1. TABEL BUKU TAMU (GUESTBOOK)
create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 40),
  relationship text not null check (relationship in ('teman', 'guru', 'ortu', 'alumni', 'adik_kelas')),
  message text not null check (char_length(message) between 3 and 280),
  color text not null default 'mustard',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.guestbook enable row level security;

-- Publik bisa membaca semua pesan buku tamu
create policy "Publik dapat membaca ucapan buku tamu"
  on public.guestbook
  for select
  to anon, authenticated
  using (true);

-- Publik bisa mengirim pesan baru
create policy "Publik dapat mengirim ucapan buku tamu"
  on public.guestbook
  for insert
  to anon, authenticated
  with check (
    char_length(name) <= 40 and
    char_length(message) <= 280
  );

create index if not exists idx_guestbook_created_at on public.guestbook (created_at desc);

-- 2. TABEL TIME CAPSULE (KAPSUL WAKTU)
-- RLS Ketat: Pesan terkunci TIDAK BISA dibaca anonim sebelum unlock_at tiba!
create table if not exists public.time_capsule (
  id uuid primary key default gen_random_uuid(),
  author_name text not null check (char_length(author_name) between 2 and 50),
  message text not null check (char_length(message) between 3 and 500),
  prediction_2031 text,
  unlock_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.time_capsule enable row level security;

-- Hanya pesan yang sudah melewati unlock_at yang bisa dibaca publik
create policy "Publik hanya dapat membaca pesan kapsul yang sudah terbuka"
  on public.time_capsule
  for select
  to anon, authenticated
  using (unlock_at <= now());

-- Publik bisa memasukkan surat terkunci ke kapsul
create policy "Publik dapat mengirim pesan ke kapsul waktu"
  on public.time_capsule
  for insert
  to anon, authenticated
  with check (
    char_length(author_name) <= 50 and
    char_length(message) <= 500
  );

create index if not exists idx_time_capsule_unlock on public.time_capsule (unlock_at);

-- 3. TABEL VOTING SUPERLATIF (CLASS AWARDS)
create table if not exists public.awards_votes (
  id uuid primary key default gen_random_uuid(),
  category_id text not null,
  voter_device_id text not null,
  candidate_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (category_id, voter_device_id)
);

alter table public.awards_votes enable row level security;

create policy "Publik dapat membaca suara voting"
  on public.awards_votes
  for select
  to anon, authenticated
  using (true);

create policy "Publik dapat memberikan suara satu kali per perangkat per kategori"
  on public.awards_votes
  for insert
  to anon, authenticated
  with check (true);

create index if not exists idx_awards_category on public.awards_votes (category_id);

-- 4. TABEL PAPAN SKOR ARCADE (LEADERBOARD)
create table if not exists public.arcade_scores (
  id uuid primary key default gen_random_uuid(),
  game text not null check (game in ('memory', 'bug_catcher')),
  player_name text not null check (char_length(player_name) between 2 and 30),
  score integer not null check (score >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.arcade_scores enable row level security;

create policy "Publik dapat membaca skor arcade"
  on public.arcade_scores
  for select
  to anon, authenticated
  using (true);

create policy "Publik dapat menyimpan skor arcade"
  on public.arcade_scores
  for insert
  to anon, authenticated
  with check (true);

create index if not exists idx_arcade_scores on public.arcade_scores (game, score desc);
