-- Tabla para configuraciones globales
CREATE TABLE public.settings (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insertar configuraciones por defecto
INSERT INTO public.settings (key, value) VALUES (
    'convocatoria',
    '{
        "is_active": true,
        "deadline": "2026-08-15T23:59:59.000Z",
        "title": "Únete a SupplyMentum UNI",
        "description": "La convocatoria está abierta. El tiempo corre."
    }'::jsonb
);

-- Habilitar RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura
-- Cualquiera puede leer la configuración de la convocatoria
CREATE POLICY "Allow public read access on settings"
ON public.settings FOR SELECT
TO public
USING (true);

-- Políticas de escritura (Solo admin)
CREATE POLICY "Allow admin to update settings"
ON public.settings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
