# CLAUDE.md — haugogdatter.no

Nettsiden til Haug & Datter, et lite app-makeri i Drammen. Ni iOS-apper,
hver med fire sider (oversikt, personvern, vilkår, support), pluss forside,
om-side og Verkstedet (notater fra byggingen). Norsk og engelsk overalt,
tysk og japansk for Plantekn.

Dette dokumentet beskriver dagens tilstand. `HANDOFF.md` og `preview.html`
er historiske (mai 2026) og skal ikke brukes som fasit for noe.

## Stack og deploy

- Astro 4 (statisk), vanilla CSS i `src/styles/global.css`, litt TypeScript.
- Ingen backend, ingen analyse, ingen cookies.
- **Deploy: push til `main` bygger og publiserer automatisk via Cloudflare
  Pages.** Det finnes ingen gh-pages-gren; `npm run deploy` i package.json
  er dødt og skal ikke kjøres. Deploy tar et par minutter; verifiser med
  `curl` mot en ny route etterpå.
- Jonas ser normalt diffen selv før push. Push kun på eksplisitt beskjed.
- `public/_headers` styrer cache og sikkerhetsheadere (Cloudflare Pages-format).

## URL-form

`trailingSlash: 'always'`. Alle interne lenker, canonical, hreflang og
sitemap ender på `/`, fordi det er den formen Cloudflare serverer uten
omdirigering. Bruk `localizedPath(locale, '/sti/')` fra `src/i18n/translations.ts`
for lenker; den legger på skråstrek og språkprefiks. Om-siden har ulik slug
per språk (`/om/` og `/en/about/`), håndtert i `switchLocalePath`.

## Hvor ting bor

```
src/data/apps.ts            # Én kilde for alle apper: navn, tagline, accent,
                            # App Store-URL, ikon, schema-kategori. Rekkefølgen
                            # her er rekkefølgen i meny, tastatur og Verket-lista.
src/i18n/translations.ts    # UI-strenger (ikke sideinnhold) og sti-hjelpere.
src/content/verkstedet/     # Notater, én .md per notat. en/-undermappe for engelsk.
src/layouts/HubLayout.astro # Forside, om, verkstedet, 404.
src/layouts/AppLayout.astro # Alle app-sider. JSON-LD, Smart App Banner, OG.
src/components/             # AppFan (vifta), AppRail (venstrespalte), Chapter,
                            # ChapterShots, PrevNextApp (sluttblokk med App Store-
                            # knapp + verkstedslenke + forrige/neste), AppMenu.
src/scripts/main.ts         # Klientscript: klokke, reveal, sveip, ⌘K, tastatur,
                            # menyfade.
public/screenshots/<slug>/  # WebP i visningsstørrelse (640 px / 1280 px liggende).
public/icons/<slug>.png     # 512 px. <slug>-144.webp brukes i vifte og rail.
public/og/<slug>.png        # Delingskort, generert.
public/fonts/               # Selvhostede Newsreader + Inter (variable woff2).
originals/                  # Originalbilder, gitignored, deployes ikke.
scripts/                    # Se under.
```

## Scripts (kjør fra prosjektroten med `node`)

- `scripts/optimaliser-bilder.mjs` — nye skjermbilder/ikoner til WebP og
  512 px PNG. Flytter originalene til `originals/`.
- `scripts/lag-varianter.mjs` — lager `<slug>-144.webp` og plakat-WebP.
- `scripts/lag-og-kort.mjs` — regenererer OG-kortene (headless Chrome).
  Kjør når ikon, navn eller tagline endres, og bump `?v=` på OG-URL-ene i
  layoutene.
- `scripts/hent-fonter.mjs` — henter fontene på nytt og skriver `fonts.css`.

## Legge til en app

1. Ny oppføring i `apps.ts` (og i `FAN_ORDER` i `AppFan.astro` for
   fargesymmetri i vifta).
2. Ikon: `public/icons/<slug>.png`, kjør `lag-varianter.mjs` og `lag-og-kort.mjs`.
3. Skjermbilder i `public/screenshots/<slug>/`, kjør `optimaliser-bilder.mjs`.
4. Fire sider under `src/pages/<slug>/` og `src/pages/en/<slug>/`. Kopier en
   eksisterende app. Oversikt-siden bør ha et «Pris og personvern»-kapittel.
5. Kort menynavn i `SHORT` i `AppMenu.astro` hvis navnet er langt.

## Cache-fella

Cloudflare cacher `/icons`, `/screenshots`, `/video`, `/og` lenge. Bytter du
ut en fil på samme sti, bump `?v=N` på referansen (se `iconPath` i apps.ts),
ellers ser folk den gamle i opptil 30 dager.

## Skrivestil

Jonas bruker ikke tankestrek. Korte setninger, tørr tone, ingen
superlativer. Se notatene i `src/content/verkstedet/` for tonen.
