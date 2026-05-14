/**
 * Oversettelses-tabell for chrome-strenger (alt utenom selve sideinnholdet).
 * Side-innholdet ligger inline i hver .astro-fil per språk. Denne filen er
 * kun for navigasjon, knapper, labels og lignende UI-tekst.
 *
 * Bruk: `t('en').appRail.personvern` → 'Privacy'
 */
export type Locale = 'no' | 'en';

export const translations = {
  no: {
    nav: {
      hub: 'Hub',
      about: 'Om',
      aboutPath: '/om',
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
      toEn: 'Switch to English',
      toNo: 'Bytt til norsk',
      ariaLabel: 'Velg språk',
    },
    htmlLang: 'nb',
  },
  en: {
    nav: {
      hub: 'Hub',
      about: 'About',
      aboutPath: '/en/about',
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
      toEn: 'Switch to English',
      toNo: 'Bytt til norsk',
      ariaLabel: 'Select language',
    },
    htmlLang: 'en',
  },
} as const;

/** Hent oversettelses-bundle for gjeldende locale. */
export function t(locale: Locale | string | undefined) {
  return locale === 'en' ? translations.en : translations.no;
}

/** Normaliser Astro.currentLocale til vår Locale-type. */
export function resolveLocale(locale: string | undefined): Locale {
  return locale === 'en' ? 'en' : 'no';
}

/**
 * Bygg URL med riktig locale-prefix.
 * - localizedPath('en', '/tenkt/personvern') → '/en/tenkt/personvern'
 * - localizedPath('no', '/tenkt/personvern') → '/tenkt/personvern'
 */
export function localizedPath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'en') {
    return clean === '/' ? '/en' : `/en${clean}`;
  }
  return clean;
}

/**
 * Bytt språk på gjeldende URL. Hvis pathname starter med /en, fjern det;
 * ellers legg til /en-prefiks. Brukes av LanguageSwitcher.
 */
export function toggleLocalePath(pathname: string): string {
  if (pathname === '/en' || pathname === '/en/') return '/';
  if (pathname.startsWith('/en/')) return pathname.slice(3);
  if (pathname === '/') return '/en';
  return `/en${pathname}`;
}
