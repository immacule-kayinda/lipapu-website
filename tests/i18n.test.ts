import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ALL_LOCALES, ENABLED_LOCALES } from '@/i18n/routing';

type Messages = { [key: string]: string | Messages };

function load(locale: string): Messages {
  return JSON.parse(readFileSync(resolve(__dirname, `../messages/${locale}.json`), 'utf8'));
}

/** Aplatit les messages en `a.b.c -> texte`, en ignorant les clés d'annotation `_*`. */
function flatten(messages: Messages, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(messages)) {
    if (key.startsWith('_')) continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') out[path] = value;
    else Object.assign(out, flatten(value, path));
  }
  return out;
}

const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

describe('messages i18n', () => {
  const reference = flatten(load('fr'));

  it('le français contient des clés', () => {
    expect(Object.keys(reference).length).toBeGreaterThan(50);
  });

  it.each(ALL_LOCALES.filter((l) => l !== 'fr'))(
    '%s a exactement les mêmes clés que fr',
    (locale) => {
      const other = flatten(load(locale));
      expect(Object.keys(other).sort()).toEqual(Object.keys(reference).sort());
    },
  );

  it.each(ALL_LOCALES)("%s n'a aucun message vide et les mêmes variables que fr", (locale) => {
    const messages = flatten(load(locale));
    for (const [key, text] of Object.entries(messages)) {
      expect(text.trim(), `${locale}:${key} vide`).not.toBe('');
      expect(placeholders(text), `${locale}:${key} variables`).toEqual(
        placeholders(reference[key] ?? ''),
      );
    }
  });

  it('les langues non traduites sont marquées TODO', () => {
    for (const locale of ALL_LOCALES.filter((l) => l !== 'fr')) {
      expect(JSON.stringify(load(locale))).toContain('TODO');
    }
  });

  it('les langues publiées ont un fichier de messages', () => {
    for (const locale of ENABLED_LOCALES) {
      expect(() => load(locale)).not.toThrow();
    }
  });

  it('aucun emoji dans les messages', () => {
    const emoji = /(?![©®])\p{Extended_Pictographic}/u;
    for (const [key, text] of Object.entries(reference)) {
      expect(emoji.test(text), key).toBe(false);
    }
  });
});
