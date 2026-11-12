import { defineRouting } from 'next-intl/routing';

/** Langues dont les messages existent (voir messages/). */
export const ALL_LOCALES = ['fr', 'ln', 'en'] as const;

/**
 * Langues publiées. Seul le français est livré : pour activer le lingala ou l'anglais,
 * ajouter la langue ici une fois les traductions relues.
 */
export const ENABLED_LOCALES = ['fr'] as const;

export type AppLocale = (typeof ENABLED_LOCALES)[number];

export const routing = defineRouting({
  locales: ENABLED_LOCALES,
  defaultLocale: 'fr',
  // Le français n'a pas de préfixe d'URL.
  localePrefix: 'as-needed',
  // Aucun cookie, aucune détection : la langue vient de l'URL.
  localeCookie: false,
  localeDetection: false,
});
