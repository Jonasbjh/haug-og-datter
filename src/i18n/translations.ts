/**
 * Oversettelses-tabell for chrome-strenger (alt utenom selve sideinnholdet).
 * Side-innholdet ligger inline i hver .astro-fil per språk. Denne filen er
 * kun for navigasjon, knapper, labels og lignende UI-tekst.
 *
 * Bruk: `t('en').appRail.personvern` → 'Privacy'
 *
 * Fire språk, men ikke for alle sider. `no` og `en` finnes overalt; `de` og
 * `ja` finnes foreløpig bare under /plantekn. Se EXTRA_LOCALE_PREFIXES —
 * legger du til flere oversatte apper, er det den ene lista som må utvides.
 */
export const LOCALES = ['no', 'en', 'de', 'ja'] as const;
export type Locale = (typeof LOCALES)[number];

/** Kort merkelapp i språkvelgeren. */
export const LOCALE_LABELS: Record<Locale, string> = {
  no: 'NO',
  en: 'EN',
  de: 'DE',
  ja: 'JA',
};

/** Språk som finnes for hver eneste side. */
const BASE_LOCALES: Locale[] = ['no', 'en'];
/** Stier som i tillegg er oversatt til språkene under. */
const EXTRA_LOCALE_PREFIXES = ['/plantekn'];
const EXTRA_LOCALES: Locale[] = ['de', 'ja'];

export const translations = {
  no: {
    nav: {
      hub: 'Hub',
      about: 'Om',
      aboutPath: '/om',
      verksted: 'Verksted',
      verkstedFra: 'Fra verkstedet',
    },
    atelier: {
      eyebrow: 'Atelieret',
      hint: 'Hold over en app',
      goTo: (name: string) => `Gå til ${name}`,
    },
    appRail: {
      oversikt: 'Oversikt',
      personvern: 'Personvern',
      vilkar: 'Vilkår',
      support: 'Support',
      pagesFor: 'Sider for denne appen',
      appStoreCta: 'LAST NED I',
      appStoreName: 'App Store',
      appStoreAria: (name: string) => `Last ned ${name} i App Store`,
      inDevelopment: 'Under utvikling. Ikke i App Store ennå.',
    },
    topbar: {
      back: 'Tilbake',
      contact: 'Kontakt',
    },
    prevNext: {
      prev: '← Forrige',
      next: 'Neste →',
      otherApps: 'Andre apper',
    },
    appMenu: {
      label: 'Hovedmeny',
    },
    kbdHint: {
      press: 'Trykk',
      forApp: 'for app',
      search: 'søk',
      home: 'hjem',
    },
    langSwitcher: {
      ariaLabel: 'Velg språk',
      switchTo: (name: string) => `Bytt til ${name}`,
    },
    htmlLang: 'nb',
    ogLocale: 'nb_NO',
  },
  en: {
    nav: {
      hub: 'Hub',
      about: 'About',
      aboutPath: '/en/about',
      verksted: 'Workshop',
      verkstedFra: 'From the workshop',
    },
    atelier: {
      eyebrow: 'The Studio',
      hint: 'Hover over an app',
      goTo: (name: string) => `Go to ${name}`,
    },
    appRail: {
      oversikt: 'Overview',
      personvern: 'Privacy',
      vilkar: 'Terms',
      support: 'Support',
      pagesFor: 'Pages for this app',
      appStoreCta: 'Download on the',
      appStoreName: 'App Store',
      appStoreAria: (name: string) => `Download ${name} on the App Store`,
      inDevelopment: 'In development. Not on the App Store yet.',
    },
    topbar: {
      back: 'Back',
      contact: 'Contact',
    },
    prevNext: {
      prev: '← Previous',
      next: 'Next →',
      otherApps: 'Other apps',
    },
    appMenu: {
      label: 'Main menu',
    },
    kbdHint: {
      press: 'Press',
      forApp: 'for app',
      search: 'search',
      home: 'home',
    },
    langSwitcher: {
      ariaLabel: 'Select language',
      switchTo: (name: string) => `Switch to ${name}`,
    },
    htmlLang: 'en',
    ogLocale: 'en_US',
  },
  de: {
    nav: {
      hub: 'Hub',
      // Die Hub- und Über-Seiten gibt es nur auf Norwegisch und Englisch.
      about: 'Über uns',
      aboutPath: '/en/about',
      verksted: 'Werkstatt',
      verkstedFra: 'Aus der Werkstatt',
    },
    atelier: {
      eyebrow: 'Das Atelier',
      hint: 'Auf eine App zeigen',
      goTo: (name: string) => `Zu ${name}`,
    },
    appRail: {
      oversikt: 'Übersicht',
      personvern: 'Datenschutz',
      vilkar: 'Nutzungsbedingungen',
      support: 'Support',
      pagesFor: 'Seiten zu dieser App',
      appStoreCta: 'Laden im',
      appStoreName: 'App Store',
      appStoreAria: (name: string) => `${name} im App Store laden`,
      inDevelopment: 'In Entwicklung. Noch nicht im App Store.',
    },
    topbar: {
      back: 'Zurück',
      contact: 'Kontakt',
    },
    prevNext: {
      prev: '← Vorherige',
      next: 'Nächste →',
      otherApps: 'Andere Apps',
    },
    appMenu: {
      label: 'Hauptmenü',
    },
    kbdHint: {
      press: 'Drücke',
      forApp: 'für App',
      search: 'Suche',
      home: 'Start',
    },
    langSwitcher: {
      ariaLabel: 'Sprache wählen',
      switchTo: (name: string) => `Wechseln zu ${name}`,
    },
    htmlLang: 'de',
    ogLocale: 'de_DE',
  },
  ja: {
    nav: {
      hub: 'ハブ',
      // ハブと運営者ページはノルウェー語と英語のみ。
      about: '運営者について',
      aboutPath: '/en/about',
      verksted: '工房',
      verkstedFra: '工房より',
    },
    atelier: {
      eyebrow: 'アトリエ',
      hint: 'アプリにカーソルを合わせる',
      goTo: (name: string) => `${name}へ`,
    },
    appRail: {
      oversikt: '概要',
      personvern: 'プライバシー',
      vilkar: '利用規約',
      support: 'サポート',
      pagesFor: 'このアプリのページ',
      appStoreCta: 'ダウンロード',
      appStoreName: 'App Store',
      appStoreAria: (name: string) => `${name}をApp Storeでダウンロード`,
      inDevelopment: '開発中。App Storeではまだ公開していません。',
    },
    topbar: {
      back: '戻る',
      contact: 'お問い合わせ',
    },
    prevNext: {
      prev: '← 前へ',
      next: '次へ →',
      otherApps: 'ほかのアプリ',
    },
    appMenu: {
      label: 'メインメニュー',
    },
    kbdHint: {
      press: 'キー',
      forApp: 'でアプリ',
      search: '検索',
      home: 'ホーム',
    },
    langSwitcher: {
      ariaLabel: '言語を選択',
      switchTo: (name: string) => `${name}に切り替える`,
    },
    htmlLang: 'ja',
    ogLocale: 'ja_JP',
  },
} as const;

/** Normaliser Astro.currentLocale til vår Locale-type. */
export function resolveLocale(locale: string | undefined): Locale {
  return (LOCALES as readonly string[]).includes(locale ?? '')
    ? (locale as Locale)
    : 'no';
}

/** Hent oversettelses-bundle for gjeldende locale. */
export function t(locale: Locale | string | undefined) {
  return translations[resolveLocale(locale)];
}

/**
 * Fjern locale-prefikset fra en sti, slik at vi står igjen med den
 * kanoniske (norske) stien.
 *   '/ja/plantekn/support' → '/plantekn/support'
 *   '/en'                  → '/'
 */
export function stripLocale(pathname: string): string {
  for (const l of LOCALES) {
    if (l === 'no') continue;
    if (pathname === `/${l}` || pathname === `/${l}/`) return '/';
    if (pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1);
  }
  return pathname;
}

/** Hvilke språk finnes for denne stien? */
export function localesForPath(pathname: string): Locale[] {
  const base = stripLocale(pathname);
  const hasExtra = EXTRA_LOCALE_PREFIXES.some(
    (p) => base === p || base.startsWith(`${p}/`),
  );
  return hasExtra ? [...BASE_LOCALES, ...EXTRA_LOCALES] : BASE_LOCALES;
}

/**
 * Bygg URL med riktig locale-prefiks.
 * - localizedPath('en', '/tenkt/personvern') → '/en/tenkt/personvern'
 * - localizedPath('no', '/tenkt/personvern') → '/tenkt/personvern'
 *
 * Ber man om et språk som ikke finnes for stien — for eksempel tysk på
 * /tenkt — faller vi tilbake til engelsk framfor å lenke til en 404.
 */
export function localizedPath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const target = localesForPath(clean).includes(locale) ? locale : 'en';
  if (target === 'no') return clean;
  return clean === '/' ? `/${target}` : `/${target}${clean}`;
}

/** Speil gjeldende URL over i et annet språk. Brukes av LanguageSwitcher. */
export function switchLocalePath(pathname: string, target: Locale): string {
  return localizedPath(target, stripLocale(pathname));
}
