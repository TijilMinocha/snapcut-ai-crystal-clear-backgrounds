-- ============================================================
-- SnapCut AI — persistent upload history
-- Run this in the Supabase SQL editor (or via `supabase db push`).
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS.
--
-- Images themselves live in Cloudinary; this table stores only the
-- metadata + Cloudinary URLs so History can render per-account, and
-- so /api/delete-upload can destroy the assets later by public_id.
-- ============================================================

create table if not exists public.uploads (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users (id) on delete cascade,
  original_name      text not null default 'image',
  size_bytes         bigint not null default 0,

  -- Cloudinary result (the transparent PNG shown in History)
  result_url         text not null,
  result_public_id   text,

  -- Cloudinary original (kept for before/after + re-processing; nullable)
  original_url       text,
  original_public_id text,

  created_at         timestamptz not null default now()
);

create index if not exists uploads_user_created_idx
  on public.uploads (user_id, created_at desc);

alter table public.uploads enable row level security;

-- Users may only see / create / delete their own rows.
-- Inserts happen inside /api/remove-bg, which forwards the signed-in
-- user's JWT, so auth.uid() resolves to that user and RLS still applies.
drop policy if exists uploads_select_own on public.uploads;
create policy uploads_select_own on public.uploads
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists uploads_insert_own on public.uploads;
create policy uploads_insert_own on public.uploads
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists uploads_delete_own on public.uploads;
create policy uploads_delete_own on public.uploads
  for delete to authenticated
  using (auth.uid() = user_id);
