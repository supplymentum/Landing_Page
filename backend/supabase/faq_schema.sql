-- FAQ schema for Supabase
-- Run this in the Supabase SQL editor.

begin;

create table if not exists public.faq (
  faq_id bigint generated always as identity primary key,
  pregunta text not null,
  respuesta text not null,
  orden integer not null default 1,
  created_at timestamptz not null default now()
);

alter table public.faq enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'faq'
      and policyname = 'Public can read faq'
  ) then
    create policy "Public can read faq"
      on public.faq
      for select
      using (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'faq'
      and policyname = 'Authenticated users can manage faq'
  ) then
    create policy "Authenticated users can manage faq"
      on public.faq
      for all
      to authenticated
      using (true)
      with check (true);
  end if;
end $$;

commit;
