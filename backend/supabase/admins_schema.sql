-- Admins schema for Supabase
-- Run this in the Supabase SQL editor.
--
-- La tabla admins ya existe en el proyecto de Supabase del equipo
-- (columna admin_id como PK), creada fuera del control de versiones.
-- Este script queda como referencia por si se necesita recrear el
-- esquema desde cero en un proyecto nuevo.

begin;

create table if not exists public.admins (
  admin_id bigint generated always as identity primary key,
  username text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- No se define ninguna policy: la tabla solo es accesible
-- mediante el service role key que usa el backend.

commit;
