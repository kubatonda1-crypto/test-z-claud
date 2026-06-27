import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            M
          </span>
          <span>MůjWeb</span>
        </Link>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm font-medium text-slate-600 hover:text-brand-600"
            >
              Administrace
            </Link>
          )}

          {user ? (
            <button onClick={handleSignOut} className="btn-secondary">
              Odhlásit se
            </button>
          ) : (
            <Link to="/login" className="btn-primary">
              Přihlásit se
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
