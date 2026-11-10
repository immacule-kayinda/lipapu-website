import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageIntro } from '@/components/PageIntro';
import { ProvisionalNotice } from '@/components/ProvisionalNotice';
import { TextSections } from '@/components/TextSections';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata({
    locale,
    path: '/a-propos',
    title: t('about.meta.title'),
    description: t('about.meta.description'),
    siteName: t('common.siteName'),
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const contact = t('common.contactPlaceholder');

  return (
    <div className="container">
      <PageIntro title={t('about.title')} lead={t('about.lead')} />
      <ProvisionalNotice>{t('common.provisionalNotice')}</ProvisionalNotice>
      <TextSections
        items={[
          {
            id: 'mission',
            title: t('about.sections.mission.title'),
            body: t('about.sections.mission.body'),
          },
          {
            id: 'team',
            title: t('about.sections.team.title'),
            body: t('about.sections.team.body'),
          },
          {
            id: 'moderation',
            title: t('about.sections.moderation.title'),
            body: t('about.sections.moderation.body'),
          },
          {
            id: 'contact',
            title: t('about.sections.contact.title'),
            body: t('about.sections.contact.body', { contact }),
          },
        ]}
      />
    </div>
  );
}
