import { createClient } from '@supabase/supabase-js'

// Hodnoty se načítají z proměnných prostředí (Vite je injektuje při build/dev).
// V Cloudflare Pages je nastav v: Settings -> Environment variables.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Selže nahlas a hned, aby se chyba nezakecala v hloubi aplikace.
  throw new Error(
    'Chybí proměnné prostředí VITE_SUPABASE_URL a/nebo VITE_SUPABASE_ANON_KEY. ' +
      'Zkontroluj soubor .env (lokálně) nebo Environment Variables (Cloudflare Pages).',
  )
}

// anon key je veřejný a bezpečný pro použití na frontendu –
// veškerá reálná autorizace dat se řeší přes Row Level Security (RLS) v Supabase.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
