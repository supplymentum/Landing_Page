-- Postulantes: reemplaza "universidad" por "código UNI".
-- Todas las postulaciones son de la UNI, así que ese dato sobraba;
-- lo que sí identifica al postulante es su código de estudiante.
-- Run this in the Supabase SQL editor.

begin;

alter table public.applicants
  add column if not exists codigo_uni text;

-- La columna university queda en la tabla (por si hay filas viejas)
-- pero el backend ya no la lee ni la escribe.

commit;
