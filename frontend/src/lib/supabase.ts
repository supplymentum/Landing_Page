import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Indica si el login con Google está configurado en este entorno.
 *
 * Si faltan las variables, la UI muestra un aviso en vez de romperse.
 */
export const isSupabaseAuthConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Cliente de Supabase usado únicamente para autenticar postulantes
 * con Google. El contenido del CMS sigue viniendo del backend.
 */
export const supabase = isSupabaseAuthConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Access token de la sesión actual, para enviarlo al backend.
 */
export async function getAccessToken(): Promise<string | null> {
  if (!supabase) {
    return null;
  }

  const { data } = await supabase.auth.getSession();

  return data.session?.access_token ?? null;
}
