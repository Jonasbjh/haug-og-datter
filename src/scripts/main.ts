/**
 * haugogdatter.no — klient-script
 * Portert fra preview.html og delt opp i logiske blokker. Kjør på alle
 * sider via <Layout> sin <script>-tag. Selektorene no-op-er stille
 * hvis et element ikke finnes på den aktuelle siden.
 */

// ---- App-katalog ----
// Avledet fra den sentrale kilden (src/data/apps.ts) så palett, sweep og
// tastatur-nav aldri går ut av sync med vifta og menyen. Vite bundler dette
// inn i klient-scriptet. Hidden-apper er allerede filtrert ut av visibleApps.
import { visibleApps, getTagline } from '../data/apps';

type App = { slug: string; name: string; tagline: string; accent: string };

const APPS: Record<string, App> = Object.fromEntries(
  visibleApps.map((a) => [
    a.slug,
    { slug: a.slug, name: a.name, tagline: getTagline(a, 'no'), accent: a.accent },
  ])
);
const ORDER: string[] = visibleApps.map((a) => a.slug);

function reduce(): boolean {
  return matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ---- Live klokke ----
function startClock() {
  const tick = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const txt = `${hh}:${mm}:${ss}`;
    document.querySelectorAll<HTMLElement>('[data-clock]').forEach((n) => {
      n.textContent = txt;
    });
  };
  tick();
  setInterval(tick, 1000);
}

// ---- Lese-progresjon ----
function startProgress() {
  const bar = document.querySelector<HTMLElement>('.progress');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight || 1;
    const pct = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
    bar.style.width = pct + '%';
  };
  document.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

// ---- Reveal-on-scroll ----
function startReveals() {
  const targets = document.querySelectorAll('.reveal, .stagger');
  if (!targets.length) return;
  if (!('IntersectionObserver' in window) || reduce()) {
    targets.forEach((n) => n.classList.add('is-in'));
    return;
  }
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          obs.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
  );
  targets.forEach((n) => obs.observe(n));
}

// ---- Mus-følgende lysflekk (kun hub) ----
function startSpotlight() {
  const sp = document.querySelector<HTMLElement>('.spotlight');
  if (!sp) return;
  // Hub-en har data-spotlight på theme-root så vi vet at vi er der.
  const isHub = !!document.querySelector('.theme-root[data-spotlight]');
  if (!isHub) return;
  if (matchMedia('(hover: none), (pointer: coarse)').matches) return;
  sp.classList.add('is-on');
  document.addEventListener(
    'mousemove',
    (e) => {
      sp.style.setProperty('--mx', e.clientX + 'px');
      sp.style.setProperty('--my', e.clientY + 'px');
    },
    { passive: true }
  );
}

// ---- Letter-parallax på hero-tittel (kun hub) ----
function startParallaxTitle() {
  if (matchMedia('(hover: none), (pointer: coarse)').matches) return;
  if (reduce()) return;
  const title = document.querySelector<HTMLElement>('[data-parallax-title]');
  if (!title) return;
  const letters = title.querySelectorAll<HTMLElement>('.ltr, .amp');
  if (!letters.length) return;
  let raf = 0;
  let tx = 0;
  let ty = 0;
  const apply = () => {
    raf = 0;
    letters.forEach((l, i) => {
      const phase = i / letters.length - 0.5;
      const dx = tx * (4 + phase * 6);
      const dy = ty * (3 + phase * 4);
      const rz = tx * (phase * 2);
      l.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${rz}deg)`;
    });
  };
  const onMove = (e: MouseEvent) => {
    const r = title.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    tx = (e.clientX - cx) / r.width;
    ty = (e.clientY - cy) / r.height;
    if (!raf) raf = requestAnimationFrame(apply);
  };
  document.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener('mouseleave', () => {
    letters.forEach((l) => {
      l.style.transform = '';
    });
  });
}

// ---- Route-svep i appens accent ved navigering ----
function navWithSweep(href: string, accent: string) {
  if (reduce()) {
    location.href = href;
    return;
  }
  const sweep = document.querySelector<HTMLElement>('.sweep');
  if (!sweep) {
    location.href = href;
    return;
  }
  sweep.style.background = accent || 'var(--accent)';
  sweep.classList.remove('out');
  void sweep.offsetWidth;
  sweep.classList.add('in');
  setTimeout(() => {
    location.href = href;
  }, 280);
}

// ---- Klikk-interceptor for accent-svep på app-lenker ----
function startSweepLinks() {
  document.addEventListener('click', (e) => {
    const me = e as MouseEvent;
    if (me.metaKey || me.ctrlKey || me.shiftKey || me.altKey) return;
    if (me.button !== 0) return;
    const target = me.target as HTMLElement | null;
    if (!target) return;
    const link = target.closest<HTMLAnchorElement>('a[href]');
    if (!link) return;
    if (link.target === '_blank') return;
    const inSweepable = link.closest('.verket__row, .siblings, .atelier__phone');
    if (!inSweepable) return;
    const href = link.getAttribute('href') || '';
    // Kun /<slug> eller /<slug>/... matches
    const m = href.match(/^\/([^/]+)/);
    if (!m || !APPS[m[1]]) return;
    e.preventDefault();
    navWithSweep(href, APPS[m[1]].accent);
  });
}

// ---- Tastatur-snarveier (1–5, ←/→, Esc) ----
function startKeys() {
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (e.target as HTMLElement | null)?.tagName ?? '';
    if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
    if (e.key >= '1' && e.key <= '9') {
      const slug = ORDER[parseInt(e.key, 10) - 1];
      if (slug) navWithSweep(`/${slug}`, APPS[slug].accent);
    } else if (e.key === 'Escape') {
      // Naviger til hub
      if (location.pathname !== '/') location.href = '/';
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const m = location.pathname.match(/^\/([^/]+)/);
      if (m && APPS[m[1]]) {
        const i = ORDER.indexOf(m[1]);
        const n = e.key === 'ArrowLeft' ? (i - 1 + ORDER.length) % ORDER.length : (i + 1) % ORDER.length;
        const slug = ORDER[n];
        navWithSweep(`/${slug}`, APPS[slug].accent);
      }
    }
  });
}

// ---- Tastatur-hint-pille (vises 2.2s etter sideload) ----
function showKbdHint() {
  const hint = document.querySelector<HTMLElement>('.kbd-hint');
  if (!hint) return;
  hint.classList.add('is-on');
  setTimeout(() => hint.classList.remove('is-on'), 2200);
}

// ---- ⌘K Kommandopalett ----
type Item = {
  label: string;
  sub: string;
  href: string;
  hex: string;
  sw: string | null;
  slug?: string;
};

function startPalette() {
  const root = document.createElement('div');
  root.className = 'palette';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-label', 'Kommandopalett');
  root.innerHTML = `
    <div class="palette__bd"></div>
    <div class="palette__panel">
      <div class="palette__head">
        <span class="palette__sigil">⌘K</span>
        <input class="palette__input" type="text" placeholder="Hopp til … (apper, personvern, vilkår, support)" autocomplete="off" spellcheck="false" />
      </div>
      <ul class="palette__list" role="listbox"></ul>
      <div class="palette__foot">
        <span><kbd>↑↓</kbd>Naviger</span>
        <span><kbd>⏎</kbd>Åpne</span>
        <span><kbd>esc</kbd>Lukk</span>
      </div>
    </div>
  `;
  document.body.appendChild(root);
  const input = root.querySelector('.palette__input') as HTMLInputElement;
  const list = root.querySelector('.palette__list') as HTMLElement;
  const bd = root.querySelector('.palette__bd') as HTMLElement;

  const items: Item[] = [];
  items.push({ label: 'Forsiden', sub: 'Hub', href: '/', hex: '', sw: null });
  ORDER.forEach((slug) => {
    const a = APPS[slug];
    items.push({ label: a.name, sub: a.tagline, href: `/${slug}`, hex: a.accent.toUpperCase(), sw: a.accent, slug });
    (
      [
        ['personvern', 'Personvern'],
        ['vilkar', 'Vilkår'],
        ['support', 'Support'],
      ] as const
    ).forEach(([id, lab]) => {
      items.push({
        label: `${a.name} · ${lab}`,
        sub: lab,
        href: `/${slug}/${id}`,
        hex: a.accent.toUpperCase(),
        sw: a.accent,
        slug,
      });
    });
  });

  let active = 0;
  let filtered = items.slice();

  const fmtItem = (it: Item, i: number) => {
    const sw = it.sw
      ? `<span class="palette__sw" style="background:${it.sw}"></span>`
      : `<span class="palette__sw" style="background:transparent;box-shadow:inset 0 0 0 1px var(--line);"></span>`;
    return `
      <li class="palette__item${i === active ? ' is-active' : ''}" role="option" data-i="${i}">
        ${sw}
        <span class="palette__nm">${it.label}</span>
        <span class="palette__sub">${it.sub || ''}</span>
        <span class="palette__hex">${it.hex || ''}</span>
      </li>`;
  };
  const render = () => {
    list.innerHTML = filtered.map(fmtItem).join('');
    const cur = list.querySelector('.is-active');
    if (cur) cur.scrollIntoView({ block: 'nearest' });
  };
  const open = () => {
    root.classList.add('is-open');
    input.value = '';
    filtered = items.slice();
    active = 0;
    render();
    setTimeout(() => input.focus(), 30);
  };
  const close = () => root.classList.remove('is-open');
  const go = (i: number) => {
    const it = filtered[i];
    if (!it) return;
    close();
    const accent = it.slug && APPS[it.slug] ? APPS[it.slug].accent : null;
    if (accent) navWithSweep(it.href, accent);
    else location.href = it.href;
  };

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    filtered = q
      ? items.filter((it) => `${it.label} ${it.sub || ''}`.toLowerCase().includes(q))
      : items.slice();
    active = 0;
    render();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      active = Math.min(active + 1, filtered.length - 1);
      render();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      active = Math.max(active - 1, 0);
      render();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(active);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  });
  list.addEventListener('click', (e) => {
    const li = (e.target as HTMLElement | null)?.closest<HTMLElement>('.palette__item');
    if (!li) return;
    go(parseInt(li.dataset.i || '0', 10));
  });
  list.addEventListener('mousemove', (e) => {
    const li = (e.target as HTMLElement | null)?.closest<HTMLElement>('.palette__item');
    if (!li) return;
    const i = parseInt(li.dataset.i || '0', 10);
    if (i === active) return;
    active = i;
    list.querySelectorAll<HTMLElement>('.palette__item').forEach((n, j) => {
      n.classList.toggle('is-active', j === active);
    });
  });
  bd.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (root.classList.contains('is-open')) close();
      else open();
    }
  });
}

// ---- Boot ----
function boot() {
  startClock();
  startProgress();
  startReveals();
  startSpotlight();
  startParallaxTitle();
  startSweepLinks();
  startKeys();
  startPalette();
  showKbdHint();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
