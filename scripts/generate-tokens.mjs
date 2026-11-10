#!/usr/bin/env node
/**
 * Génère src/styles/tokens.css depuis design/tokens.json (source unique).
 *
 *   node scripts/generate-tokens.mjs           écrit le fichier
 *   node scripts/generate-tokens.mjs --check   échoue si le fichier n'est pas à jour (CI)
 *
 * Les valeurs de design viennent uniquement de tokens.json. La section SITE_EXTRAS ne contient
 * que des mesures propres au web que tokens.json ne définit pas (largeur de lecture, épaisseur de
 * trait, breakpoints) : à remonter dans tokens.json si l'équipe le décide.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = resolve(root, 'design/tokens.json');
const TARGET = resolve(root, 'src/styles/tokens.css');

/** Mesures propres au site, absentes de tokens.json. */
const SITE_EXTRAS = {
  '--site-max-width': '72rem',
  '--site-measure': '40rem',
  '--site-card-min': '16rem',
  '--border-width': '1px',
  '--focus-width': '2px',
};

const tokens = JSON.parse(readFileSync(SOURCE, 'utf8'));

const rem = (px) => `${round(px / 16)}rem`;
const round = (n) => Number(n.toFixed(4));
const em = (n) => `${round(n)}em`;

/** Variables indépendantes du thème. */
function staticVars() {
  const out = {};
  for (const [k, v] of Object.entries(tokens.space)) out[`--space-${k}`] = rem(v);
  for (const [k, v] of Object.entries(tokens.layout)) out[`--layout-${kebab(k)}`] = rem(v);
  for (const [k, v] of Object.entries(tokens.radius))
    out[`--radius-${k}`] = k === 'pill' ? `${v}px` : rem(v);

  const serif = tokens.font.serif.family;
  const sans = tokens.font.sans.family;
  out['--font-serif'] =
    `var(--font-instrument-serif), "${serif}", Georgia, "Times New Roman", serif`;
  out['--font-sans'] =
    `var(--font-inter), "${sans}", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;

  for (const [name, t] of Object.entries(tokens.type)) {
    out[`--type-${name}-size`] = rem(t.size);
    out[`--type-${name}-line`] = String(round(t.lineHeight / t.size));
    out[`--type-${name}-tracking`] = em(t.letterSpacing);
    out[`--type-${name}-weight`] = String(t.weight);
  }

  for (const [k, v] of Object.entries(tokens.motion.duration))
    out[`--motion-duration-${k}`] = `${v}ms`;
  out['--motion-easing'] = tokens.motion.easing;
  out['--motion-like-scale'] = String(tokens.motion.likeScale);

  out['--icon-grid'] = String(tokens.icon.grid);
  out['--icon-stroke'] = String(tokens.icon.stroke);
  out['--photo-ratio'] = tokens.photo.ratio.replace(':', ' / ');

  out['--scrim-photo-from'] = tokens.scrim.photo.from;
  out['--scrim-photo-to'] = tokens.scrim.photo.to;
  out['--scrim-photo-height'] = rem(tokens.scrim.photo.height);

  Object.assign(out, SITE_EXTRAS);
  return out;
}

/** Variables dépendantes du thème. */
function themedVars(mode) {
  const out = {};
  for (const [k, v] of Object.entries(tokens.color)) out[`--color-${k}`] = v[mode];
  for (const [k, v] of Object.entries(tokens.elevation)) out[`--elevation-${k}`] = v[mode];
  return out;
}

function kebab(s) {
  return s.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function block(selector, vars, extra = []) {
  const lines = [...extra, ...Object.entries(vars).map(([k, v]) => `${k}: ${v};`)];
  return `${selector} {\n${lines.map((l) => `  ${l}`).join('\n')}\n}`;
}

function indent(text, n) {
  const pad = ' '.repeat(n);
  return text
    .split('\n')
    .map((l) => (l ? pad + l : l))
    .join('\n');
}

/** Classes utilitaires de typographie (une par style de type). */
function typeClasses() {
  return Object.entries(tokens.type)
    .map(([name, t]) => {
      const family = t.font === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)';
      const size =
        name === 'display'
          ? // Le display (96 px) se réduit sur petit écran sans descendre sous title-1.
            `min(var(--type-display-size), max(var(--type-title-1-size), 11vw))`
          : `var(--type-${name}-size)`;
      const lines = [
        `font-family: ${family};`,
        `font-size: ${size};`,
        `line-height: var(--type-${name}-line);`,
        `letter-spacing: var(--type-${name}-tracking);`,
        `font-weight: var(--type-${name}-weight);`,
      ];
      if (t.uppercase) lines.push('text-transform: uppercase;');
      return `.t-${name} {\n${lines.map((l) => `  ${l}`).join('\n')}\n}`;
    })
    .join('\n\n');
}

function build() {
  const light = themedVars('light');
  const dark = themedVars('dark');
  return [
    '/* GÉNÉRÉ par scripts/generate-tokens.mjs depuis design/tokens.json. Ne pas modifier à la main. */',
    '',
    block(':root', staticVars(), [
      'color-scheme: light;',
      ...Object.entries(light).map(([k, v]) => `${k}: ${v};`),
    ]),
    '',
    '@media (prefers-color-scheme: dark) {',
    indent(block(':root:not([data-theme="light"])', dark, ['color-scheme: dark;']), 2),
    '}',
    '',
    block(':root[data-theme="dark"]', dark, ['color-scheme: dark;']),
    '',
    typeClasses(),
    '',
  ].join('\n');
}

const css = build();

if (process.argv.includes('--check')) {
  let current = '';
  try {
    current = readFileSync(TARGET, 'utf8');
  } catch {}
  if (current !== css) {
    console.error("src/styles/tokens.css n'est pas à jour. Lancer : npm run tokens");
    process.exit(1);
  }
  console.log('tokens.css à jour.');
} else {
  mkdirSync(dirname(TARGET), { recursive: true });
  writeFileSync(TARGET, css);
  console.log('tokens.css généré.');
}
