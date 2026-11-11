import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { StatusPage } from '@/components/StatusPage';
import { Link } from '@/i18n/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('notFound');
  return { title: t('meta.title'), robots: { index: false } };
}

export default async function NotFound() {
  const t = await getTranslations();
  return (
    <StatusPage
      overline={t('notFound.overline')}
      title={t('notFound.title')}
      body={t('notFound.body')}
    >
      <Link href="/" className="button">
        {t('common.backHome')}
      </Link>
    </StatusPage>
  );
}
