import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageIntro } from '@/components/PageIntro';
import { ProvisionalNotice } from '@/components/ProvisionalNotice';
import { TextSections } from '@/components/TextSections';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

const SECTIONS = [
  'controller',
  'data',
  'purposes',
  'sensitive',
  'retention',
  'rights',
  'sharing',
] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata({
    locale,
    path: '/legal/confidentialite',
    title: t('legal.privacy.meta.title'),
    description: t('legal.privacy.meta.description'),
    siteName: t('common.siteName'),
  });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="container">
      <PageIntro title={t('legal.privacy.title')} />
      <ProvisionalNotice>{t('common.legalProvisionalNotice')}</ProvisionalNotice>
      <TextSections
        items={SECTIONS.map((id) => ({
          id,
          title: t(`legal.privacy.sections.${id}.title`),
          body: t(`legal.privacy.sections.${id}.body`),
        }))}
      />
      <p className="muted measure section-gap">
        {t('legal.contactLine', { contact: t('common.contactPlaceholder') })}
      </p>
    </div>
  );
}
