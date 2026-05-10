# Handoff: haugogdatter.no

Design og prosjektoppsett for **haugogdatter.no** — et lite iOS-studio fra Drammen. Hub-side + 5 apper × 4 undersider = 21 sider totalt.

---

## Hva dette er

Dette er en **handoff-pakke** klar for Claude Code. Pakken inneholder to ting:

1. **`preview.html`** — én selvstendig HTML-fil som er **fasiten på design og oppførsel**. Alt visuelt, all interaksjon, alle animasjoner, alle farger, all copy ligger her. Hub + 5 app-sider er klikkbare; én personvern-side viser doc-layouten.
2. **Astro-prosjekt** (`src/`, `public/`, `astro.config.mjs`, `package.json`, `tsconfig.json`) — skjelettet for det ferdige nettstedet, generert tidlig i prosessen. **Komponentene og stilene i `src/` er ikke lenger oppdatert** — de matcher første versjon av designet, ikke det `preview.html` viser nå.

**Oppgaven din (Claude Code):** Port designet og oppførselen fra `preview.html` inn i Astro-strukturen i `src/`, slik at hver av de 21 sidene blir en faktisk Astro-route. Alt er statisk — ingen API, ingen client-side rammeverk utenom JS som allerede finnes inline i `preview.html`.

---

## Fidelity

**High-fidelity, pixel-presist.** `preview.html` har endelige farger, typografi, spacing, animasjoner og kopiering. Mål direkte fra den filen — ikke fra `src/styles/global.css`, som er utdatert.

---

## Sluttmål

- Statisk site bygget av Astro (`astro build`) som deployes til **GitHub Pages** med custom domene `haugogdatter.no`.
- 21 ruter, alle SSG.
- Alt CSS og JS som er nødvendig for designet ligger inline i `preview.html` i dag — port det inn i Astro-komponenter / globalt CSS / et lite klient-script.
- Ingen tracking, ingen tredjeparts-script utenom Google Fonts.
- Ingen mørk modus, ingen modals (utenom kommandopaletten), ingen karuseller.

---

## Innhold i `preview.html` som må porteres

Les `preview.html` rett gjennom før du starter. Her er en oppsummering så du vet hva du skal lete etter.

### Designsystem (CSS-variabler)

```css
:root {
  --paper:      #DDD8CC;   /* hub-bakgrunn, varm pale stein */
  --paper-warm: #E3DED3;
  --card:       #E9E4D9;
  --ink:        #2A2520;
  --ink-soft:   #524841;
  --ink-quiet:  #87796E;
  --line:       #C9C2B2;   /* hairline */
  --accent:     #A8552B;   /* hub-default; overstyres per app */
  --accent-soft: rgba(168,85,43,0.32);
}
```

App-tema settes på en wrapper `<div class="theme-root" data-app="<slug>">` som overstyrer **kun** `--accent`, `--accent-soft` (utregnet) og en valgfri `--surface`. Resten arves.

Bakgrunns-tinting per app gjøres på `body`:

```css
body:has(.theme-root[data-app="bumle-bjorn"])     { background: color-mix(in oklab, #DDD8CC 90%, #A85436 10%); }
body:has(.theme-root[data-app="plantekn"])        { background: color-mix(in oklab, #DDD8CC 90%, #2C4A3A 10%); }
body:has(.theme-root[data-app="tenkt"])           { background: color-mix(in oklab, #DDD8CC 90%, #8B6F47 10%); }
body:has(.theme-root[data-app="kvitteringsvakt"]) { background: color-mix(in oklab, #DDD8CC 90%, #7A3A22 10%); }
body:has(.theme-root[data-app="inklings-journal"]){ background: color-mix(in oklab, #DDD8CC 90%, #1F3528 10%); }
```

App-accent-farger (eksakte, brukes som meta og i swatcher):

| Slug | Navn | Accent |
|---|---|---|
| `bumle-bjorn` | Bumle Bjørn | `#A85436` |
| `plantekn` | Plantekn | `#2C4A3A` |
| `tenkt` | Tenkt | `#8B6F47` |
| `kvitteringsvakt` | Kvitteringsvakt | `#7A3A22` |
| `inklings-journal` | Inklings Journal | `#1F3528` |

### Typografi

- **Display / titler:** Newsreader (Google Fonts), 400/500. Italic brukes på ampersand i logoer ("Haug *&* Datter").
- **Brødtekst:** Inter (Google Fonts), 400/500.
- **Mono (klokke, koordinater, hex-koder):** `ui-monospace, SFMono-Regular, Menlo, monospace`.
- OpenType-features globalt: `'kern','liga','dlig','calt','onum','ss01'`.
- Letterpress-skygge på display-tittler (én lys + én mørk skygge).
- Bokmål overalt. Norske «anførselstegn». Ingen em-dash i copy.

### Tekstur og atmosfære

- **SVG-noise overlay** (papirkorn) som ligger som `position: fixed` over hele siden i `mix-blend-mode: multiply` på ~32% opacity.
- **Tynn rutemønster-bakgrunn** (96×96px, 4% opacity, vignettert mot kantene).
- **Spotlight under musepekeren** — to lag (kald hovedglow + varmt høylys), følger pekeren med rAF.
- **Hjørne-vignett** veldig svakt mot midten.
- Per-app **glyph/backdrop** SVG bak hero-en på hver app-side — sakte flytende:
  - Bumle Bjørn: konsentriske sirkler
  - Plantekn: akselinjer + finmasket grid
  - Tenkt: 3×3 prikk-grid med uthevet senter
  - Kvitteringsvakt: horisontale streker med taggete bunn-kant
  - Inklings Journal: to flytende håndskriftsstreker
- Hver app-side har også et tema-bakgrunnsmønster (notatbok-linjer, prikk-grid, arkitektur-grid osv.) i 7-13% opacity som fader nedover.

### Live elementer

- **Live klokke** i topp-løperen og i footere — `HH:MM:SS` i mono, oppdaterer hvert sekund. Synkronisert.
- **GPS-koordinater** for Drammen i topp-løperen: `59°44′ N · 10°12′ E`.
- **Reading progress** — 2px aksent-linje i toppen som vokser med scroll.

### Interaksjon

- **Letter-level parallax** på "Haug & Datter" hero-tittel: hver bokstav er sin egen `<span>`, små translater + mikro-rotasjon ved musbevegelse. Slått av på touch og under `prefers-reduced-motion`.
- **Animert understreking** på lenker (drar seg fra venstre på hover).
- **Scroll-reveal:** seksjoner fader opp 14px når de kommer i view. Verket-radene har 60ms staggered delay.
- **Route-svep:** når man bytter til en app (klikk på rad eller "Forrige/Neste" eller via paletten), feier appens accent-farge inn fra venstre, dekker skjermen ~280ms, og feier ut til høyre.
- **Tastatur-snarveier:**
  - `1`–`5` → hopp til app i listen
  - `←` / `→` → forrige/neste app
  - `Esc` → hjem
  - `⌘K` / `Ctrl+K` → kommandopalett
  - Liten hint-pille nede til høyre i 2.4s etter navigasjon
- **Kommandopalett (⌘K):** modal med backdrop blur+saturate. Søk på alle apper og deres undersider + forsiden. ↑↓ navigerer, ↵ åpner, Esc lukker. Hver oppføring viser swatch + navn + sub-label + hex-kode i mono. Åpning trigger samme accent-svep.
- **Forrige / Neste-blokk** nederst på hver app-side (over footer) — to kort med romertall-segl i appens farge, navn og tagline. Loop-er sirkulært.

### Sidetyper

1. **Hub (`/`)**
   - Hero: "Haug & Datter" (med italic accent-amp), lede-tekst.
   - Verket-listen: 5 rader, hver med wax-segl (romertall I-V), navn (Newsreader 22px), tagline, swatch + hex-kode i mono.
   - Om-blokk (én linje uten test-narrativet).
   - Kontakt: `jonas@haugogdatter.no`.
   - Kolofon nederst: "Skrift: Newsreader & Inter", "Tegnsetting: Bokmål · «norske» anførselstegn", "Sporing: Ingen.", med skråstilt almanakk-stempel som viser dagens dato.
   - H&D monogram-segl (sentrert) over kolofonen.

2. **App-oversikt (`/<slug>`)** — 5 stk
   - Tilbake-link til "Haug & Datter".
   - Hero: app-ikon (96×96, rounded squircle), app-navn (h1), tagline, App Store-badge (eller "Kommer snart"-pille).
   - Eyebrow over hero: `■ #<hex> · 0X / 05` (swatch + hex i mono + nummer).
   - "Om <Navn>" — to korte avsnitt (placeholders med `[FYLL INN]`).
   - Screenshot-strip — 4 placeholders i 9:19.5 ratio. På mobil: snap-scroll, 70vw bredde, peek av neste til høyre.
   - "Hva den gjør" — 3 funksjoner som h3 + p (placeholders).
   - "Hvorfor den er bygget" — én avsnitt (placeholder).
   - Forrige / Neste-blokk.
   - App-sub-nav (Oversikt / Personvern / Vilkår / Support).

3. **Personvern (`/<slug>/personvern`)** — 5 stk
   - "Sist oppdatert: [DATO]"
   - Intro nevner Haug & Datter / Jonas Haug / Drammen.
   - Seksjoner: "Hvilke data samler vi inn?", "Tredjepartstjenester", "Kontakt".
   - **Bumle Bjørn har en ekstra "Barn"-seksjon** (COPPA / GDPR-K) — de fire andre har den ikke.

4. **Vilkår (`/<slug>/vilkar`)** — 5 stk
   - "Sist oppdatert: [DATO]"
   - Seksjoner: "Lisens", "Ansvarsfraskrivelse", "Endringer", "Kontakt".

5. **Support (`/<slug>/support`)** — 5 stk
   - Mailto-lenke til `jonas@haugogdatter.no`.
   - "Vanlige spørsmål" med [SPØRSMÅL]/[SVAR] placeholders.
   - "Send tilbakemelding"-blokk.

### Footer (alle sider)

- Hairline border-top.
- Live klokke til venstre (synkronisert med topbar).
- Tekst: "Drevet fra Drammen. Med hjelp fra Synne."

### Header (alle sider)

- Topbar med live klokke + koordinater + "Haug & Datter"-wordmark sentrert.
- På app-sider: tilbake-link "← Haug & Datter" under topbar.

### Responsiv oppførsel

- Testet på 320, 375, 390, 414, 430, 720, 960px+.
- "Haug & Datter" stabler over to linjer på mobil med kompakt italic ampersand i midten.
- "Kvitteringsvakt" har `clamp()` for navnet: 40px på 375px, 34px på 320px.
- Verket-rader på mobil: pilen droppes, segl mindre (28px), `:active`-state speiler hover.
- Cropmarks og hjørnemerker skjules under 720px.
- Preview-baren scroller horisontalt på smale skjermer.
- `prefers-reduced-motion` respektert: parallax, scroll-reveal og route-svep skrur seg av.

---

## Astro-prosjekt-strukturen som finnes

```
.
├── astro.config.mjs        # Astro-konfig (static, trailingSlash: 'never')
├── package.json            # astro@4 + gh-pages
├── tsconfig.json
├── .gitignore
├── README.md               # Bruksanvisning (oppdatert)
├── preview.html            # ⭐ DESIGN-FASIT — port herfra
├── public/
│   ├── CNAME               # haugogdatter.no
│   └── icons/              # 5 placeholder-ikoner (1024×1024 PNG, monogram-stil)
└── src/
    ├── data/apps.ts        # Sentral app-konfig (slug, navn, tagline, ikon, tema)
    ├── styles/global.css   # ⚠️ UTDATERT — bytt ut med CSS portert fra preview.html
    ├── components/         # ⚠️ UTDATERT — refaktorer mot preview.html
    │   ├── AppCard.astro
    │   ├── AppHero.astro
    │   ├── AppNav.astro
    │   ├── Footer.astro
    │   ├── Header.astro
    │   ├── PageShell.astro
    │   └── ScreenshotStrip.astro
    ├── layouts/            # ⚠️ UTDATERT — oppdater for å matche preview.html
    │   ├── HubLayout.astro
    │   └── AppLayout.astro
    └── pages/              # ✓ Riktig route-struktur (21 sider) med placeholders
        ├── index.astro
        ├── bumle-bjorn/{index,personvern,vilkar,support}.astro
        ├── plantekn/{index,personvern,vilkar,support}.astro
        ├── tenkt/{index,personvern,vilkar,support}.astro
        ├── kvitteringsvakt/{index,personvern,vilkar,support}.astro
        └── inklings-journal/{index,personvern,vilkar,support}.astro
```

`src/data/apps.ts` har riktig struktur og kan brukes som-er — eller utvides med flere felter (f.eks. `glyphType: 'circles' | 'grid' | 'dots' | 'lines' | 'script'`) hvis du vil pakke glyph-rendringen som data.

---

## Foreslått portingsrekkefølge

1. **Lag globale stiler** — kopier alle `<style>`-blokker fra `preview.html` inn i `src/styles/global.css`. Fjern preview-bar-CSS-en (`.preview-bar`). Behold alt annet.
2. **Lag globale klient-scripts** — del JS-en i `preview.html` i tre småfiler under `src/scripts/`:
   - `clock.ts` — live klokke + koordinater + scroll-progress + reduced-motion gate
   - `parallax.ts` — letter-parallax på hero + spotlight
   - `palette.ts` — kommandopalett + tastatur-snarveier + route-svep
   Last dem fra `<Layout>` med `<script>`-tags. Astro hash-er dem og inline-r ved behov.
3. **Refaktorer `HubLayout.astro` og `AppLayout.astro`** mot markupen i `preview.html`. App-tema settes via `data-app={app.slug}` på `theme-root`-wrapper og dynamisk `style="--accent: ..."`.
4. **Bygg om komponentene** for å matche `preview.html`:
   - `AppCard` — segl med romertall, navn, tagline, swatch + hex.
   - `AppHero` — eyebrow-meta-linje, ikon, navn, tagline, App Store-badge.
   - `AppNav` — sub-nav nederst.
   - Nye komponenter: `Glyph.astro` (per-app SVG), `Colophon.astro`, `Topbar.astro`, `PrevNextApp.astro`, `CommandPalette.astro`.
5. **Sider** — alle 21 finnes allerede med `[FYLL INN]`-placeholders. Bare rendre de oppdaterte komponentene; copy beholdes uendret.
6. **Test** med `npm run dev`. Verifiser at:
   - Hub viser 5 verket-rader.
   - Klikk på en rad gir route-svep og lander på `/<slug>`.
   - ⌘K åpner palett, ↵ navigerer.
   - Klokken tikker, koordinatene vises.
   - Letter-parallax fungerer på desktop, av på touch.
   - `prefers-reduced-motion` skrur av animasjoner.
   - Hver app har egen background-tint og glyph.
7. **Build** — `npm run build`. Kjør `npm run preview` lokalt.
8. **Deploy** — repo + GitHub Pages. `npm run deploy` pusher `dist/` til `gh-pages`-branch. Sett custom domain i repo-innstillinger (CNAME-fila finnes allerede i `public/`).

---

## Assets

- **Google Fonts:** Newsreader + Inter, lastes via `<link>` i layout-head.
- **App-ikoner:** `public/icons/<slug>.png` — placeholder-monogrammer i hver apps farge. Bytt ut med ekte 1024×1024 ikoner senere.
- **App Store-badge:** inline SVG i `AppHero.astro` (sort pille). Bytt til offisiell Apple-badge når appene er live.
- **Skjermbilder:** finnes ikke ennå. Komponenten `ScreenshotStrip` rendrer 4 tomme placeholders med "Skjermbilde 1–4" som figcaption. Slipp ekte iPhone-screenshots inn i `public/screenshots/<slug>/01.png` … `04.png` og pek `ScreenshotStrip` mot dem.

---

## Bygging og deploy

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # → ./dist
npm run preview      # serverer dist/ lokalt
npm run deploy       # bygger og pusher til gh-pages
```

GitHub Pages: Settings → Pages → Source = `gh-pages`, Custom domain = `haugogdatter.no`. La DNS peke A-records på GitHub Pages, eller CNAME til `<bruker>.github.io`.

---

## Regler (ufravikelige)

- Norsk bokmål overalt. Norske anførselstegn («…»). Ingen em-dash i copy.
- Ingen tracking, ingen analytics.
- Ingen tredjeparts-script utenom Google Fonts.
- Ingen mørk modus.
- Ingen modal-dialoger utenom kommandopaletten.
- Ingen karuseller.
- Engangskjøp framfor abonnement der det går.
- Lokale data framfor sky der det går.
- JavaScript kun der det gir innholdet en taktil eller funksjonell verdi (klokke, parallax, palett, route-svep). Ingen JS for sin egen skyld.

---

## Kontakt

`jonas@haugogdatter.no`
