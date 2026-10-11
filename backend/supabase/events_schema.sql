-- Events schema for Supabase
-- Run this in the Supabase SQL editor.

begin;

create table if not exists public.events (
  event_id bigint generated always as identity primary key,
  title text not null,
  description text not null,
  location text not null,
  image_path text,
  registration_link text,
  summary_link text,
  start_date_time timestamptz not null,
  is_active boolean not null default false,
  starred boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
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

drop trigger if exists trg_events_set_updated_at on public.events;

create trigger trg_events_set_updated_at
before update on public.events
for each row
execute function public.set_updated_at();

alter table public.events enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'events'
      and policyname = 'Public can read events'
  ) then
    create policy "Public can read events"
      on public.events
      for select
      using (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'events'
      and policyname = 'Authenticated users can manage events'
  ) then
    create policy "Authenticated users can manage events"
      on public.events
      for all
      to authenticated
      using (true)
      with check (true);
  end if;
end $$;

commit;
