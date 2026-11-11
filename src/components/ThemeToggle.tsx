'use client';

import { useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { THEME_STORAGE_KEY, type ThemeChoice } from '@/lib/theme';
import styles from './ThemeToggle.module.css';

const CHOICES: ThemeChoice[] = ['system', 'light', 'dark'];
const EVENT = 'joga-theme-change';

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

function getSnapshot(): ThemeChoice {
  const attr = document.documentElement.getAttribute('data-theme');
  return attr === 'light' || attr === 'dark' ? attr : 'system';
}

function getServerSnapshot(): ThemeChoice {
  return 'system';
}

function applyTheme(choice: ThemeChoice) {
  const root = document.documentElement;
  if (choice === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', choice);
  try {
    if (choice === 'system') localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, choice);
  } catch {
    // Stockage indisponible : le choix vaut pour la page en cours seulement.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function ThemeToggle() {
  const t = useTranslations('theme');
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div role="group" aria-label={t('label')} className={styles.group}>
      {CHOICES.map((choice) => (
        <button
          key={choice}
          type="button"
          className={styles.option}
          aria-pressed={current === choice}
          onClick={() => applyTheme(choice)}
        >
          {t(choice)}
        </button>
      ))}
    </div>
  );
}
