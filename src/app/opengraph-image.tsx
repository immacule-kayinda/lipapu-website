import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

// Image Open Graph provisoire : noir et blanc, sans police personnalisée.
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const t = await getTranslations({ locale: routing.defaultLocale });
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 96,
        background: '#0A0A0A',
        color: '#FAFAFA',
      }}
    >
      <div style={{ fontSize: 40, opacity: 0.7, marginBottom: 32 }}>{t('common.siteName')}</div>
      <div style={{ fontSize: 96, lineHeight: 1.05, letterSpacing: -2 }}>
        {t('home.hero.title')}
      </div>
    </div>,
    size,
  );
}
