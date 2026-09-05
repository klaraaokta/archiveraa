-- ===========================================================
-- SETUP DATABASE — website ulang tahun Frio
-- Cara pakai: copy semua isi file ini, paste di Supabase
-- (SQL Editor -> New query), lalu klik Run.
-- ===========================================================

-- 1. Teks umum (nama, tanggal, PIN referensi, dll) — key/value
create table if not exists site_text (
  key text primary key,
  value text not null
);

-- 2. Surat (surat utama & "kalau aku jadi kamu")
create table if not exists letters (
  key text primary key,
  title text not null,
  body text not null   -- pisahkan paragraf dengan baris baru kosong
);

-- 3. Foto galeri
create table if not exists photos (
  id bigint generated always as identity primary key,
  caption text not null,
  image_url text,
  sort_order int not null default 0
);

-- 4. Timeline cerita
create table if not exists timeline_events (
  id bigint generated always as identity primary key,
  event_date text not null,
  title text not null,
  description text not null,
  sort_order int not null default 0
);

-- 5. Our Little Things
create table if not exists little_things (
  id bigint generated always as identity primary key,
  icon text not null,
  title text not null,
  back_text text not null,
  sort_order int not null default 0
);

-- 6. 19 Reasons
create table if not exists reasons (
  id bigint generated always as identity primary key,
  reason_text text not null,
  sort_order int not null default 0
);

-- 7. Titik peta kenangan
create table if not exists map_points (
  id bigint generated always as identity primary key,
  event_date text not null,
  title text not null,
  description text not null,
  pos_x int not null default 100,
  pos_y int not null default 100,
  sort_order int not null default 0
);

-- 8. Lagu playlist
create table if not exists tracks (
  id bigint generated always as identity primary key,
  title text not null,
  artist text not null default '-',
  audio_url text,
  cover_url text,
  reason text,
  sort_order int not null default 0
);

-- 9. Guestbook (pesan pengunjung)
create table if not exists guestbook_messages (
  id bigint generated always as identity primary key,
  name text not null default 'seseorang',
  message text not null,
  created_at timestamptz not null default now()
);

-- 10. Wish jar
create table if not exists wishes (
  id bigint generated always as identity primary key,
  message text not null,
  created_at timestamptz not null default now()
);

-- Jaga-jaga kalau tabel tracks sudah pernah dibuat sebelum kolom
-- cover_url ada (aman dijalankan berkali-kali).
alter table tracks add column if not exists cover_url text;

-- ===========================================================
-- Izin akses (biar web bisa baca & tulis lewat anon key)
-- ===========================================================
alter table site_text enable row level security;
alter table letters enable row level security;
alter table photos enable row level security;
alter table timeline_events enable row level security;
alter table little_things enable row level security;
alter table reasons enable row level security;
alter table map_points enable row level security;
alter table tracks enable row level security;
alter table guestbook_messages enable row level security;
alter table wishes enable row level security;

drop policy if exists "public read" on site_text;
drop policy if exists "public read" on letters;
drop policy if exists "public read" on photos;
drop policy if exists "public read" on timeline_events;
drop policy if exists "public read" on little_things;
drop policy if exists "public read" on reasons;
drop policy if exists "public read" on map_points;
drop policy if exists "public read" on tracks;
drop policy if exists "public read" on guestbook_messages;
drop policy if exists "public read" on wishes;
drop policy if exists "public write" on site_text;
drop policy if exists "public write" on letters;
drop policy if exists "public write" on photos;
drop policy if exists "public write" on timeline_events;
drop policy if exists "public write" on little_things;
drop policy if exists "public write" on reasons;
drop policy if exists "public write" on map_points;
drop policy if exists "public write" on tracks;
drop policy if exists "public write" on guestbook_messages;
drop policy if exists "public write" on wishes;
drop policy if exists "admin write" on site_text;
drop policy if exists "admin write" on letters;
drop policy if exists "admin write" on photos;
drop policy if exists "admin write" on timeline_events;
drop policy if exists "admin write" on little_things;
drop policy if exists "admin write" on reasons;
drop policy if exists "admin write" on map_points;
drop policy if exists "admin write" on tracks;
drop policy if exists "admin write" on guestbook_messages;
drop policy if exists "admin write" on wishes;

create policy "public read" on site_text for select using (true);
create policy "public read" on letters for select using (true);
create policy "public read" on photos for select using (true);
create policy "public read" on timeline_events for select using (true);
create policy "public read" on little_things for select using (true);
create policy "public read" on reasons for select using (true);
create policy "public read" on map_points for select using (true);
create policy "public read" on tracks for select using (true);
create policy "public read" on guestbook_messages for select using (true);
create policy "public read" on wishes for select using (true);

create policy "public write" on guestbook_messages for insert with check (true);
create policy "public write" on wishes for insert with check (true);

-- Tabel-tabel ini HANYA boleh diubah oleh admin yang sudah login
-- (lewat Supabase Auth), bukan sembarang pengunjung website.
-- Ini penting supaya orang lain yang kebetulan tau link website
-- gak bisa hapus/ubah foto, surat, playlist, dsb lewat console browser.
create policy "admin write" on site_text for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write" on letters for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write" on photos for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write" on timeline_events for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write" on little_things for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write" on reasons for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write" on map_points for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write" on tracks for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write" on guestbook_messages for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write" on guestbook_messages for delete using (auth.role() = 'authenticated');
create policy "admin write" on wishes for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write" on wishes for delete using (auth.role() = 'authenticated');

-- ===========================================================
-- Data awal (boleh diedit lewat halaman admin nanti)
-- ===========================================================
insert into site_text (key, value) values
  ('full_name', 'Frio Defrianto'),
  ('age', '19')
on conflict (key) do nothing;

insert into letters (key, title, body) values
  ('surat_utama', 'untuk Frio,', 'aku nggak pernah nyangka reconnect random di Telegram bisa berakhir sejauh ini. dari sekadar say hi, pindah ke WhatsApp, sampai akhirnya jadian tanggal 15 Juni kemarin — semuanya berasa cepat tapi juga pas banget.

hari ini kamu genap 19 tahun. aku pengen kamu tau, di antara semua orang yang kenal kamu, aku bersyukur banget bisa jadi salah satu yang paling deket sama kamu sekarang.

makasih udah selalu ada, udah dateng ke acara Sweet Seventeen aku, udah sabar walau kadang aku ngeselin. semoga tahun ini bawa lebih banyak hal baik buat kamu — dan buat kita.

selamat ulang tahun, sayang. 🤍'),
  ('surat_kedua', 'kalau aku jadi kamu,', 'mungkin hari ini rasanya biasa aja — bangun, ngobrol sama orang rumah, buka HP kayak biasa. tapi aku pengen kamu tau, hari ini nggak biasa buat aku.

kalau aku jadi kamu, aku bakal bangga — udah ngelewatin 19 tahun dengan segala usaha, jatuh bangun, dan hal-hal kecil yang bikin kamu jadi kamu yang sekarang.

dan kalau aku jadi kamu, aku bakal tau ada orang yang diem-diem selalu doain yang terbaik. itu aku. selalu.')
on conflict (key) do nothing;
