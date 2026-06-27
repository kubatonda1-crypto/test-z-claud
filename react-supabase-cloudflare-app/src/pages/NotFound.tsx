import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <p className="text-sm font-semibold text-brand-600">404</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">
        Stránka nenalezena
      </h1>
      <p className="mt-3 max-w-md text-slate-500">
        Stránka, kterou hledáte, neexistuje nebo byla přesunuta.
      </p>
      <Link to="/" className="btn-primary mt-8">
        Zpět na úvodní stránku
      </Link>
    </div>
  )
}
