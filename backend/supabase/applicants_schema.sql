-- Applicants schema for Supabase
-- Run this in the Supabase SQL editor.
--
-- La tabla applicants ya existe en el proyecto del equipo. Los ALTER
-- de abajo agregan de forma idempotente las columnas que el backend
-- necesita y que la tabla original no tenía.

begin;

create extension if not exists pgcrypto;

create table if not exists public.applicants (
  applicant_id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  career text not null,
  codigo_uni text,
  university_semester text not null,
  application_reason text not null,
  first_choice_area_id bigint not null references public.areas (area_id),
  second_choice_area_id bigint references public.areas (area_id),
  created_at timestamptz not null default now()
);

-- Columnas faltantes en instalaciones existentes.
alter table public.applicants
  add column if not exists codigo_uni text;

alter table public.applicants enable row level security;

-- Sin policies: la tabla solo se accede con el service role key
-- que usa el backend.

commit;
