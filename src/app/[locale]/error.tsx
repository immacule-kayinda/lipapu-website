'use client';

import { useTranslations } from 'next-intl';
import { StatusPage } from '@/components/StatusPage';
import { Link } from '@/i18n/navigation';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('error');
  const common = useTranslations('common');
  return (
    <StatusPage overline={t('overline')} title={t('title')} body={t('body')}>
      <button type="button" className="button" onClick={reset}>
        {t('retry')}
      </button>
      <Link href="/" className="button button-secondary">
        {common('backHome')}
      </Link>
    </StatusPage>
  );
}
