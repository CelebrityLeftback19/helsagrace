-- HelsaGrace portfolio — content storage, owner allowlist, media bucket
-- Run this once in the Supabase SQL editor.

-- ─────────────────────────────────────────────────────────────
-- 1. Content
-- ─────────────────────────────────────────────────────────────

-- Single-row document holding the whole site content as JSON.
create table if not exists public.site_content (
  id integer primary key check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Append-only log of saved versions, for history and restore.
create table if not exists public.content_revisions (
  id bigint generated always as identity primary key,
  data jsonb not null,
  label text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- 2. Owner allowlist
-- ─────────────────────────────────────────────────────────────

-- Only emails in this table are treated as owners/admins.
create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
-- No policies on purpose: the table is only reachable through is_admin().

-- True when the signed-in user's email is on the allowlist.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

grant execute on function public.is_admin() to authenticated;

-- ─────────────────────────────────────────────────────────────
-- 3. Row-Level Security on content
-- ─────────────────────────────────────────────────────────────

alter table public.site_content enable row level security;
alter table public.content_revisions enable row level security;

-- Anyone may read the published content (it is a public website).
drop policy if exists "site_content public read" on public.site_content;
create policy "site_content public read"
  on public.site_content for select
  using (true);

-- Only allowlisted owners may write content.
drop policy if exists "site_content auth write" on public.site_content;
drop policy if exists "site_content admin write" on public.site_content;
create policy "site_content admin write"
  on public.site_content for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Revisions are private to owners.
drop policy if exists "revisions auth read" on public.content_revisions;
drop policy if exists "revisions admin read" on public.content_revisions;
create policy "revisions admin read"
  on public.content_revisions for select
  to authenticated
  using (public.is_admin());

drop policy if exists "revisions auth insert" on public.content_revisions;
drop policy if exists "revisions admin insert" on public.content_revisions;
create policy "revisions admin insert"
  on public.content_revisions for insert
  to authenticated
  with check (public.is_admin());

-- Seed the singleton row so reads and upserts always find it.
insert into public.site_content (id, data)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────
-- 4. Media bucket for screenshot uploads
-- ─────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- Public read (the bucket is public).
drop policy if exists "media public read" on storage.objects;
create policy "media public read"
  on storage.objects for select
  using (bucket_id = 'media');

-- Only owners may upload, replace or delete media.
drop policy if exists "media admin insert" on storage.objects;
create policy "media admin insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- ─────────────────────────────────────────────────────────────
-- 5. Contact messages
-- ─────────────────────────────────────────────────────────────

-- Every submission is stored here; emailing via Resend is best-effort on top.
create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text not null default 'new',
  emailed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- The public form may insert (validated + rate-limited in the API route).
drop policy if exists "contact insert" on public.contact_messages;
create policy "contact insert"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

-- Only owners may read, update or delete submissions.
drop policy if exists "contact admin read" on public.contact_messages;
create policy "contact admin read"
  on public.contact_messages for select
  to authenticated
  using (public.is_admin());

drop policy if exists "contact admin update" on public.contact_messages;
create policy "contact admin update"
  on public.contact_messages for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "contact admin delete" on public.contact_messages;
create policy "contact admin delete"
  on public.contact_messages for delete
  to authenticated
  using (public.is_admin());

-- ─────────────────────────────────────────────────────────────
-- 6. Add yourself as an owner
-- ─────────────────────────────────────────────────────────────
-- After creating your auth user (Authentication → Users), run:
--
--   insert into public.admin_users (email)
--   values ('you@example.com')
--   on conflict do nothing;
