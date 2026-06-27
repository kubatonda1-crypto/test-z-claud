# MůjWeb — React + Vite + Tailwind + Supabase + Cloudflare Pages

Kompletní startovací aplikace s veřejnou prezentační stránkou, přihlášením přes
Supabase Auth a chráněnou administrátorskou sekcí pro správu obsahu.

## 📁 Struktura projektu

```
react-supabase-app/
├── public/
│   ├── _redirects              # SPA routing fix pro Cloudflare Pages
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ContentFormModal.tsx  # Formulář pro vytvoření/editaci obsahu
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx    # Ochrana /admin (přesměrování na /login)
│   │   └── PublicLayout.tsx      # Layout pro veřejné stránky (Navbar+Footer)
│   ├── context/
│   │   └── AuthContext.tsx       # Globální správa Supabase session + isAdmin
│   ├── hooks/
│   │   └── useSiteContent.ts     # CRUD operace nad tabulkou site_content
│   ├── lib/
│   │   └── supabaseClient.ts     # Inicializace Supabase klienta
│   ├── pages/
│   │   ├── Admin.tsx             # Chráněný dashboard pro správu obsahu
│   │   ├── Home.tsx              # Veřejná prezentační stránka
│   │   ├── Login.tsx             # Přihlašovací stránka
│   │   └── NotFound.tsx          # 404 stránka
│   ├── types/
│   │   └── content.ts            # TS typy pro obsahové položky
│   ├── App.tsx                   # Definice routování
│   ├── main.tsx                  # Vstupní bod aplikace
│   ├── index.css                 # Tailwind direktivy + custom třídy
│   └── vite-env.d.ts              # Typy pro import.meta.env
├── supabase/
│   └── schema.sql                 # SQL pro vytvoření tabulky + RLS politik
├── .env.example                   # Vzor proměnných prostředí
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
└── package.json
```

## 🚀 Rychlý start

### 1. Instalace závislostí

```bash
npm install
```

### 2. Nastavení Supabase projektu

1. Vytvoř projekt na [supabase.com](https://supabase.com).
2. V **Project Settings → API** zkopíruj `Project URL` a `anon public` klíč.
3. V **SQL Editor** spusť obsah souboru `supabase/schema.sql` — vytvoří se
   tabulka `site_content` a politiky RLS (omezí zápis pouze na e-mail
   administrátora).
4. V **Authentication → Providers** ověř, že je zapnuté přihlašování
   e-mailem a heslem (Email provider).
5. V **Authentication → Users** vytvoř uživatele s e-mailem, který bude
   sloužit jako administrátorský účet (např. `admin@mujweb.cz`), a nastav mu
   heslo. Je potřeba mít e-mail potvrzený (buď přes ověřovací e-mail, nebo
   manuálně v dashboardu), jinak ho aplikace nepustí do administrace.

### 3. Proměnné prostředí

Zkopíruj `.env.example` do `.env` a vyplň skutečné hodnoty:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....
VITE_ADMIN_EMAIL=admin@mujweb.cz
```

> **Důležité:** `anon` klíč je veřejný a bezpečný pro frontend — skutečná
> autorizace dat je zajištěna pomocí RLS politik v Supabase (viz
> `supabase/schema.sql`), nikoliv tímto klíčem.

### 4. Spuštění vývojového serveru

```bash
npm run dev
```

Aplikace poběží na `http://localhost:5173`.

### 5. Produkční build

```bash
npm run build
```

Výstup se vygeneruje do složky `dist/`.

## ☁️ Nasazení na Cloudflare Pages

1. Nahraj projekt do Git repozitáře (GitHub/GitLab).
2. V Cloudflare Dashboard: **Workers & Pages → Create → Pages → Connect to
   Git** a vyber repozitář.
3. Nastav build konfiguraci:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. V **Settings → Environment variables** nastav (pro Production i Preview):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_EMAIL`
5. Ulož a nasaď. Soubor `public/_redirects` (obsahuje `/* /index.html 200`)
   se automaticky zkopíruje do `dist/` při buildu a zajistí, že obnovení
   stránky (F5) na libovolné cestě (např. `/admin`) funguje správně místo
   zobrazení Cloudflare 404 chyby.

## 🔐 Jak funguje zabezpečení /admin

- `AuthContext` sleduje aktuální Supabase session v reálném čase
  (`onAuthStateChange`) a odvozuje z ní příznak `isAdmin` porovnáním e-mailu
  přihlášeného uživatele s `VITE_ADMIN_EMAIL`.
- `ProtectedRoute` obaluje route `/admin`:
  - Nepřihlášený uživatel → přesměrování na `/login`.
  - Přihlášený, ale ne-administrátorský uživatel → přesměrování na `/`.
  - Administrátor → zobrazí se obsah.
- **Toto je ochrana na úrovni UI/UX.** Skutečné zabezpečení dat musí vždy
  zajišťovat **Row Level Security (RLS)** přímo v Supabase (viz politika
  `"Admin full access"` v `supabase/schema.sql`), protože klientský kód lze
  teoreticky obejít.

## 🧩 Použité technologie

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) — build nástroj
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [react-router-dom v6](https://reactrouter.com/) — routování
- [Supabase](https://supabase.com/) — autentizace + databáze (PostgreSQL)
- [Cloudflare Pages](https://pages.cloudflare.com/) — hosting
