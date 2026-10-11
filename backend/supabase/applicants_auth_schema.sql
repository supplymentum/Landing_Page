-- Postulantes: estado de revisión + vínculo con la cuenta de Google
-- Run this in the Supabase SQL editor.

begin;

-- Estado de revisión de cada postulación.
alter table public.applicants
  add column if not exists status text not null default 'pendiente';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'applicants_status_check'
  ) then
    alter table public.applicants
      add constraint applicants_status_check
      check (status in ('pendiente', 'aceptado', 'rechazado'));
  end if;
end $$;

-- Cuenta de Supabase Auth (login con Google) que envió la postulación.
alter table public.applicants
  add column if not exists user_id uuid;

-- Una postulación por cuenta. Si el admin elimina la postulación,
-- la persona puede volver a postular; si la rechaza, no.
create unique index if not exists applicants_user_id_key
  on public.applicants (user_id)
  where user_id is not null;

commit;
