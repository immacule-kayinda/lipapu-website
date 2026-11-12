import type fr from '../messages/fr.json';

declare module 'next-intl' {
  interface AppConfig {
    Locale: string;
    Messages: typeof fr;
  }
}
