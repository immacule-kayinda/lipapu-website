import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { JsonLd } from '@/components/JsonLd';
import { ProvisionalNotice } from '@/components/ProvisionalNotice';
import { StoreButtons } from '@/components/StoreButtons';
import { WaitlistForm } from '@/components/WaitlistForm';
import { SITE_URL } from '@/config/site';
import { Link } from '@/i18n/navigation';
import { pageMetadata } from '@/lib/metadata';
import styles from './home.module.css';

type Props = { params: Promise<{ locale: string }> };

const STEPS = ['profile', 'discover', 'talk'] as const;
const SAFETY_ITEMS = ['verified', 'moderation', 'report'] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata({
    locale,
    path: '/',
    title: t('home.meta.title'),
    description: t('home.meta.description'),
    siteName: t('common.siteName'),
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'Organization', name: t('common.siteName'), url: SITE_URL },
            {
              '@type': 'WebSite',
              name: t('common.siteName'),
              url: SITE_URL,
              inLanguage: locale,
            },
          ],
        }}
      />

      <section className={`container ${styles.hero}`} aria-labelledby="hero-title">
        <p className="t-overline muted">{t('home.hero.overline')}</p>
        <h1 id="hero-title" className={`t-display ${styles.heroTitle}`}>
          {t('home.hero.title')}
        </h1>
        <p className={`measure ${styles.heroLead}`}>{t('home.hero.lead')}</p>
        <StoreButtons />
        <div className={styles.notice}>
          <ProvisionalNotice>{t('common.provisionalNotice')}</ProvisionalNotice>
        </div>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="how-title">
        <h2 id="how-title" className="t-title-2">
          {t('home.how.title')}
        </h2>
        <ol className={styles.steps}>
          {STEPS.map((step, index) => (
            <li key={step} className={styles.step}>
              <span className={`t-title-2 ${styles.stepNumber}`} aria-hidden="true">
                {index + 1}
              </span>
              <h3 className="t-headline">{t(`home.how.steps.${step}.title`)}</h3>
              <p className="muted">{t(`home.how.steps.${step}.body`)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="safety-title">
        <h2 id="safety-title" className="t-title-2">
          {t('home.safety.title')}
        </h2>
        <p className="measure muted">{t('home.safety.lead')}</p>
        <ul className={styles.safetyList}>
          {SAFETY_ITEMS.map((item) => (
            <li key={item}>{t(`home.safety.items.${item}`)}</li>
          ))}
        </ul>
        <Link href="/securite" className={styles.more}>
          {t('home.safety.cta')}
        </Link>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="waitlist-title">
        <h2 id="waitlist-title" className="t-title-2">
          {t('waitlist.title')}
        </h2>
        <p className="measure muted">{t('waitlist.lead')}</p>
        <WaitlistForm />
      </section>
    </>
  );
}
