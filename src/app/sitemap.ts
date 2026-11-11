import type { MetadataRoute } from 'next';
import { PUBLIC_PATHS, SITE_URL } from '@/config/site';
import { routing } from '@/i18n/routing';
import { localizedPath } from '@/lib/metadata';

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    PUBLIC_PATHS.map((path) => ({
      url: `${SITE_URL}${localizedPath(locale, path)}`,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE_URL}${localizedPath(l, path)}`]),
        ),
      },
    })),
  );
}
