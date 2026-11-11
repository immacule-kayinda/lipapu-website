import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '..');
const tokens = JSON.parse(readFileSync(join(root, 'design/tokens.json'), 'utf8')) as {
  color: Record<string, { light: string; dark: string }>;
};

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

describe('contrastes des tokens (WCAG AA)', () => {
  const textPairs: [string, string][] = [
    ['text', 'bg'],
    ['text', 'surface'],
    ['text', 'surface-2'],
    ['text-2', 'bg'],
    ['text-2', 'surface'],
    ['text-2', 'surface-2'],
    ['on-primary', 'primary'],
    ['danger', 'bg'],
    ['danger', 'surface'],
    ['success', 'bg'],
  ];
  const uiPairs: [string, string][] = [
    ['border-strong', 'bg'],
    ['danger', 'bg'],
    ['text', 'bg'],
  ];

  for (const mode of ['light', 'dark'] as const) {
    it.each(textPairs)(`${mode} : texte %s sur %s >= 4,5`, (fg, bg) => {
      const ratio = contrast(tokens.color[fg]![mode], tokens.color[bg]![mode]);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
    it.each(uiPairs)(`${mode} : élément %s sur %s >= 3`, (fg, bg) => {
      const ratio = contrast(tokens.color[fg]![mode], tokens.color[bg]![mode]);
      expect(ratio).toBeGreaterThanOrEqual(3);
    });
  }
});

describe('tokens.css', () => {
  it('est à jour par rapport à design/tokens.json', () => {
    expect(() =>
      execFileSync('node', ['scripts/generate-tokens.mjs', '--check'], {
        cwd: root,
        stdio: 'pipe',
      }),
    ).not.toThrow();
  });

  it('définit le thème sombre par préférence système et par attribut', () => {
    const css = readFileSync(join(root, 'src/styles/tokens.css'), 'utf8');
    expect(css).toContain('@media (prefers-color-scheme: dark)');
    expect(css).toContain(':root:not([data-theme="light"])');
    expect(css).toContain(':root[data-theme="dark"]');
  });
});

describe('aucune valeur de design en dur', () => {
  function walk(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
      const full = join(dir, name);
      return statSync(full).isDirectory() ? walk(full) : [full];
    });
  }
  const files = walk(join(root, 'src')).filter(
    (f) =>
      /\.(css|tsx?)$/.test(f) &&
      !f.endsWith('styles/tokens.css') &&
      !f.endsWith('opengraph-image.tsx') && // image provisoire rendue hors navigateur
      !f.endsWith('layout.tsx'), // themeColor des métadonnées (attribut HTML, pas du CSS)
  );

  it.each(files.map((f) => f.replace(root + '/', '')))('%s : pas de couleur littérale', (file) => {
    const content = readFileSync(join(root, file), 'utf8');
    expect(content).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(content).not.toMatch(/\brgba?\(/);
  });
});
