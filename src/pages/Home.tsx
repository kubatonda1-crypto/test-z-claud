import { Link } from 'react-router-dom'

const features = [
  {
    title: 'Rychlost',
    description:
      'Postaveno na Vite a nasazeno na globální CDN síti Cloudflare Pages pro maximální rychlost načítání.',
    icon: '⚡',
  },
  {
    title: 'Bezpečnost',
    description:
      'Autentizace a databáze běží na Supabase s Row Level Security, takže data jsou v bezpečí.',
    icon: '🔒',
  },
  {
    title: 'Škálovatelnost',
    description:
      'Architektura je modulární a připravená růst spolu s vaším projektem bez zbytečných komplikací.',
    icon: '📈',
  },
]

export default function Home() {
  return (
    <div>
      {/* Hero sekce */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center sm:py-32">
          <span className="mb-4 inline-block rounded-full bg-brand-100 px-4 py-1 text-sm font-medium text-brand-700">
            Nová generace webových aplikací
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Postavte svůj projekt{' '}
            <span className="text-brand-600">rychle a moderně</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Kombinace Reactu, Vite, Tailwind CSS a Supabase vám dává pevný
            základ pro tvorbu rychlých, bezpečných a snadno udržovatelných
            webových aplikací.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link to="/login" className="btn-primary px-6 py-3 text-base">
              Začít nyní
            </Link>
            <a
              href="#funkce"
              className="btn-secondary px-6 py-3 text-base"
            >
              Zjistit více
            </a>
          </div>
        </div>
      </section>

      {/* Sekce funkcí */}
      <section id="funkce" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Proč zvolit tuto technologii?
          </h2>
          <p className="mt-3 text-slate-600">
            Tři pilíře, na kterých stojí spokojenost uživatelů i vývojářů.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="card">
              <div className="mb-4 text-3xl">{feature.icon}</div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA sekce */}
      <section className="bg-slate-900">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Připraveni vyzkoušet administraci?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Přihlaste se a vyzkoušejte si jednoduchý dashboard pro správu
            obsahu vašeho webu.
          </p>
          <div className="mt-8">
            <Link to="/login" className="btn-primary px-6 py-3 text-base">
              Přejít na přihlášení
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
