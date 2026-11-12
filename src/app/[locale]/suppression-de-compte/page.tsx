import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageIntro } from '@/components/PageIntro';
import { ProvisionalNotice } from '@/components/ProvisionalNotice';
import { pageMetadata } from '@/lib/metadata';
import styles from './suppression.module.css';

type Props = { params: Promise<{ locale: string }> };

const STEPS = ['app', 'contact'] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata({
    locale,
    path: '/suppression-de-compte',
    title: t('deleteAccount.meta.title'),
    description: t('deleteAccount.meta.description'),
    siteName: t('common.siteName'),
  });
}

export default async function DeleteAccountPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const contact = t('common.contactPlaceholder');

  return (
    <div className="container">
      <PageIntro title={t('deleteAccount.title')} lead={t('deleteAccount.lead')} />
      <ProvisionalNotice>{t('common.legalProvisionalNotice')}</ProvisionalNotice>

      <section aria-labelledby="steps-title" className={styles.block}>
        <h2 id="steps-title" className="t-title-2">
          {t('deleteAccount.stepsTitle')}
        </h2>
        <ol className={styles.steps}>
          {STEPS.map((step) => (
            <li key={step}>
              <h3 className="t-headline">{t(`deleteAccount.steps.${step}.title`)}</h3>
              <p className="muted">{t(`deleteAccount.steps.${step}.body`, { contact })}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="what-title" className={styles.block}>
        <h2 id="what-title" className="t-title-2">
          {t('deleteAccount.whatTitle')}
        </h2>
        <p className="muted">{t('deleteAccount.what')}</p>
        <p className="muted">{t('deleteAccount.waitlist')}</p>
      </section>
    </div>
  );
}
