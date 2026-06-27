export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-slate-500">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p>© {new Date().getFullYear()} MůjWeb. Všechna práva vyhrazena.</p>
          <p>Postaveno s React, Vite, Tailwind CSS a Supabase.</p>
        </div>
      </div>
    </footer>
  )
}
