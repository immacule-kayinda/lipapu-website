import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageIntro } from '@/components/PageIntro';
import { ProvisionalNotice } from '@/components/ProvisionalNotice';
import { TextSections } from '@/components/TextSections';
import { pageMetadata } from '@/lib/metadata';
import styles from './securite.module.css';

type Props = { params: Promise<{ locale: string }> };

const SECTIONS = ['verification', 'moderation', 'report', 'scams'] as const;
const TIPS = ['money', 'meet', 'share', 'trust'] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata({
    locale,
    path: '/securite',
    title: t('safety.meta.title'),
    description: t('safety.meta.description'),
    siteName: t('common.siteName'),
  });
}

export default async function SafetyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="container">
      <PageIntro title={t('safety.title')} lead={t('safety.lead')} />
      <ProvisionalNotice>{t('common.provisionalNotice')}</ProvisionalNotice>
      <TextSections
        items={SECTIONS.map((id) => ({
          id,
          title: t(`safety.sections.${id}.title`),
          body: t(`safety.sections.${id}.body`),
        }))}
      />
      <section aria-labelledby="tips-title" className={styles.tips}>
        <h2 id="tips-title" className="t-headline">
          {t('safety.tips.title')}
        </h2>
        <ul>
          {TIPS.map((id) => (
            <li key={id}>{t(`safety.tips.items.${id}`)}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
