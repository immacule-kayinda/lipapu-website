import type { Metadata } from 'next';
import { SITE_URL } from '@/config/site';
import { routing } from '@/i18n/routing';

/** Chemin public d'une page pour une langue (le français n'a pas de préfixe). */
export function localizedPath(locale: string, path: string): string {
  const clean = path === '/' ? '' : path;
  if (locale === routing.defaultLocale) return clean || '/';
  return `/${locale}${clean}`;
}

/** Image Open Graph provisoire (src/app/opengraph-image.tsx). */
const OG_IMAGE = { url: '/opengraph-image', width: 1200, height: 630 };

type PageMetadataInput = {
  locale: string;
  path: string;
  title: string;
  description: string;
  siteName: string;
};

export function pageMetadata({
  locale,
  path,
  title,
  description,
  siteName,
}: PageMetadataInput): Metadata {
  const url = localizedPath(locale, path);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(routing.locales.map((l) => [l, localizedPath(l, path)])),
    },
    openGraph: {
      type: 'website',
      siteName,
      title,
      description,
      url: `${SITE_URL}${url}`,
      locale,
      images: [OG_IMAGE],
    },
    twitter: { card: 'summary_large_image', title, description, images: [OG_IMAGE.url] },
  };
}
