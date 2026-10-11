-- Projects schema for Supabase
-- Run this in the Supabase SQL editor.

begin;

create table if not exists public.projects (
  project_id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  area text not null,
  year integer not null,
  description text,
  image_path text,
  starred boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
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

drop trigger if exists trg_projects_set_updated_at on public.projects;

create trigger trg_projects_set_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

alter table public.projects enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'projects'
      and policyname = 'Public can read projects'
  ) then
    create policy "Public can read projects"
      on public.projects
      for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'projects'
      and policyname = 'Authenticated users can manage projects'
  ) then
    create policy "Authenticated users can manage projects"
      on public.projects
      for all
      to authenticated
      using (true)
      with check (true);
  end if;
end $$;


-- Seed inicial: proyectos que estaban hardcodeados en el frontend.
-- image_path queda en null; las imágenes se suben luego desde
-- Multimedia del CMS. Mientras tanto el frontend usa una imagen
-- de respaldo según la categoría.
insert into public.projects
  (slug, name, area, year, description, starred, sort_order)
values
  ('diagnostico-mypes', 'Diagnóstico logístico a mypes de Lima Norte', 'Consultoría', 2026, 'Consultoría gratuita de procesos logísticos para pequeñas empresas.', true, 1),
  ('supplydata', 'SupplyData: tablero de indicadores', 'Tecnología', 2026, 'Dashboard de KPIs logísticos para la gestión interna del centro.', true, 2),
  ('semana-supply-chain', 'Semana del Supply Chain UNI', 'Operaciones', 2025, 'Cinco días de charlas, talleres y visitas técnicas con empresas aliadas.', true, 3),
  ('ruta-contenedor', 'Ruta del Contenedor', 'Operaciones', 2025, 'Visita técnica al puerto del Callao y simulación de comercio exterior.', true, 4),
  ('cadena-abierta', 'Podcast: Cadena Abierta', 'Marketing', 2026, 'Conversaciones con profesionales líderes del Supply Chain peruano.', true, 5),
  ('mentoring', 'Mentoring SupplyMentum', 'Talento', 2025, 'Programa de mentoría entre egresados, seniors y nuevos miembros.', true, 6),
  ('reto-lean', 'Reto Lean UNI', 'Consultoría', 2025, 'Competencia interuniversitaria de mejora de procesos con casos reales.', false, 7),
  ('alianza-logistiperu', 'Alianza LogistiPerú', 'Corporativas', 2026, 'Convenio marco con el gremio logístico para prácticas y visitas.', false, 8),
  ('bootcamp-excel', 'Bootcamp de Excel y Power BI', 'Tecnología', 2025, 'Formación intensiva en herramientas de análisis para la cadena.', false, 9),
  ('feria-areas', 'Feria de Áreas 2026', 'Talento', 2026, 'Espacio de captación donde cada área muestra lo que hace.', false, 10),
  ('ultima-milla', 'Estudio de última milla en Lima', 'Consultoría', 2024, 'Investigación aplicada sobre distribución urbana y e-commerce.', false, 11),
  ('rebranding', 'Rebranding SupplyMentum 1.0', 'Marketing', 2024, 'Construcción del brandbook y nueva identidad visual del centro.', false, 12)
on conflict (slug) do nothing;

commit;
