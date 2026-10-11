-- CMS schema for Supabase
-- Run this in the Supabase SQL editor.

begin;

create extension if not exists pgcrypto;

create table if not exists public.cms_sections (
  section_key text primary key,
  title text,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_set_updated_at on public.cms_sections;

create trigger trg_set_updated_at
before update on public.cms_sections
for each row
execute function public.set_updated_at();

alter table public.cms_sections enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'cms_sections'
      and policyname = 'Public can read cms sections'
  ) then
    create policy "Public can read cms sections"
      on public.cms_sections
      for select
      using (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'cms_sections'
      and policyname = 'Authenticated users can manage cms sections'
  ) then
    create policy "Authenticated users can manage cms sections"
      on public.cms_sections
      for all
      to authenticated
      using (true)
      with check (true);
  end if;
end $$;

insert into storage.buckets (id, name, public)
values ('cms-assets', 'cms-assets', true)
on conflict (id) do update
set name = excluded.name,
    public = excluded.public;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public can read cms assets'
  ) then
    create policy "Public can read cms assets"
      on storage.objects
      for select
      using (bucket_id = 'cms-assets');
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can upload cms assets'
  ) then
    create policy "Authenticated users can upload cms assets"
      on storage.objects
      for insert
      to authenticated
      with check (bucket_id = 'cms-assets');
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can update cms assets'
  ) then
    create policy "Authenticated users can update cms assets"
      on storage.objects
      for update
      to authenticated
      using (bucket_id = 'cms-assets')
      with check (bucket_id = 'cms-assets');
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can delete cms assets'
  ) then
    create policy "Authenticated users can delete cms assets"
      on storage.objects
      for delete
      to authenticated
      using (bucket_id = 'cms-assets');
  end if;
end $$;

insert into public.cms_sections (section_key, title, payload)
values
  (
    'hero',
    'Hero principal',
    '{
      "headline": "Título principal",
      "subheadline": "Texto descriptivo",
      "ctaText": "Conoce más",
      "ctaUrl": "/contacto",
      "imageUrl": null
    }'::jsonb
  ),
  (
    'events',
    'Eventos',
    '{
      "items": []
    }'::jsonb
  ),
  (
    'projects',
    'Proyectos',
    '{
      "items": []
    }'::jsonb
  ),
  (
    'board_executives',
    'Directivos de la junta',
    '{
      "items": []
    }'::jsonb
  ),
  (
    'gallery',
    'Galería',
    '{
      "items": []
    }'::jsonb
  )
on conflict (section_key) do update
set title = excluded.title,
    payload = excluded.payload,
    updated_at = now();

commit;