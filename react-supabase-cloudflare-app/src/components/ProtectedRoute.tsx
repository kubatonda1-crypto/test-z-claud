import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
}

/**
 * Ochrana administrátorské sekce.
 *
 * Pravidla:
 * 1. Dokud se ještě ověřuje session (loading), zobrazí se loader –
 *    aby nedošlo k "bliknutí" obsahu před ověřením.
 * 2. Nepřihlášený uživatel -> přesměrování na /login,
 *    s uložením cílové cesty (aby ho šlo po přihlášení vrátit zpět).
 * 3. Přihlášený, ale NE-administrátorský uživatel -> přesměrování na /
 *    (nemá zde co dělat, ale je to jiný stav než "nepřihlášen").
 * 4. Přihlášený administrátor -> zobrazí se chráněný obsah.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { loading, user, isAdmin } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
          <p className="text-sm text-slate-500">Ověřuji přihlášení…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
