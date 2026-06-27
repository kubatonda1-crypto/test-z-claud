-- Spusť v Supabase: SQL Editor -> New query
-- Tabulka pro jednoduchou správu obsahu webu (např. texty sekcí, novinky, apod.)

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null default '',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Automatická aktualizace updated_at při každé změně řádku
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
  before update on public.site_content
  for each row
  execute function public.set_updated_at();

-- Zapnutí Row Level Security (RLS) - povinné pro produkční nasazení
alter table public.site_content enable row level security;

-- Veřejné čtení pouze publikovaného obsahu (např. pro budoucí veřejné zobrazení)
create policy "Public can read published content"
  on public.site_content
  for select
  using (is_published = true);

-- Pouze přihlášený administrátor může číst/měnit VŠECHEN obsah.
-- Nahraď 'admin@mujweb.cz' za reálný e-mail administrátora.
create policy "Admin full access"
  on public.site_content
  for all
  using (auth.jwt() ->> 'email' = 'admin@mujweb.cz')
  with check (auth.jwt() ->> 'email' = 'admin@mujweb.cz');
