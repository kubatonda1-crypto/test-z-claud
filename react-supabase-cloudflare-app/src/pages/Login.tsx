import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface LocationState {
  from?: { pathname: string }
}

export default function Login() {
  const { user, signInWithPassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Pokud je uživatel už přihlášen, nemá co dělat na /login.
  if (user) {
    const state = location.state as LocationState | undefined
    const redirectTo = state?.from?.pathname ?? '/'
    return <Navigate to={redirectTo} replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const { error: signInError } = await signInWithPassword(email, password)

    setSubmitting(false)

    if (signInError) {
      setError(signInError)
      return
    }

    const state = location.state as LocationState | undefined
    const redirectTo = state?.from?.pathname ?? '/admin'
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 font-bold text-white"
          >
            M
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            Přihlášení do administrace
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Zadejte své přihlašovací údaje pro pokračování.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vas@email.cz"
              className="input-field"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Heslo
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full"
          >
            {submitting ? 'Přihlašuji…' : 'Přihlásit se'}
          </button>

          <p className="text-center text-sm text-slate-500">
            <Link to="/" className="font-medium text-brand-600 hover:underline">
              ← Zpět na úvodní stránku
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
