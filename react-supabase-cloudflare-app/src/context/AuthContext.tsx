import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

interface AuthContextValue {
  session: Session | null
  user: User | null
  loading: boolean
  isAdmin: boolean
  signInWithPassword: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// E-mail administrátora – v produkci jde z env proměnné.
// Pozn.: jde o klientskou kontrolu pro UX (skrytí/redirect v UI).
// Skutečné zabezpečení dat musí vždy hlídat RLS politiky v Supabase.
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? 'admin@mujweb.cz'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Načtení aktuální session při startu aplikace.
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // Reakce na přihlášení / odhlášení / obnovu tokenu v reálném čase.
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession)
        setLoading(false)
      },
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const signInWithPassword: AuthContextValue['signInWithPassword'] = async (
    email,
    password,
  ) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error: error ? mapAuthError(error.message) : null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const user = session?.user ?? null
  const isAdmin =
    !!user?.email &&
    user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    !!user.email_confirmed_at

  const value: AuthContextValue = {
    session,
    user,
    loading,
    isAdmin,
    signInWithPassword,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Drobné přeložení nejčastějších chybových hlášek Supabase do češtiny.
function mapAuthError(message: string): string {
  const normalized = message.toLowerCase()
  if (normalized.includes('invalid login credentials')) {
    return 'Nesprávný e-mail nebo heslo.'
  }
  if (normalized.includes('email not confirmed')) {
    return 'E-mail ještě nebyl potvrzen. Zkontroluj svou schránku.'
  }
  if (normalized.includes('too many requests')) {
    return 'Příliš mnoho pokusů. Zkus to prosím později.'
  }
  return 'Přihlášení se nezdařilo. Zkus to znovu.'
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth musí být použito uvnitř <AuthProvider>.')
  }
  return ctx
}
