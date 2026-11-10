/** URL publique du site (SITE_URL). Valeur locale par défaut tant que le domaine n'est pas choisi. */
export const SITE_URL = (process.env.SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

/** Liens des stores. `null` tant que l'application n'est pas publiée : les boutons restent désactivés. */
export const STORE_LINKS = {
  ios: null as string | null,
  android: null as string | null,
};

export type Store = keyof typeof STORE_LINKS;

/** Pages indexables (chemins sans préfixe de langue). */
export const PUBLIC_PATHS = [
  '/',
  '/securite',
  '/blog',
  '/a-propos',
  '/legal/cgu',
  '/legal/confidentialite',
  '/legal/cookies',
  '/suppression-de-compte',
] as const;
