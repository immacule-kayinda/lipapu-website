import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageIntro } from '@/components/PageIntro';
import { getPosts } from '@/lib/blog';
import { pageMetadata } from '@/lib/metadata';
import styles from './blog.module.css';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata({
    locale,
    path: '/blog',
    title: t('blog.meta.title'),
    description: t('blog.meta.description'),
    siteName: t('common.siteName'),
  });
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('blog');
  const posts = getPosts();

  return (
    <div className="container">
      <PageIntro title={t('title')} lead={t('lead')} />
      {posts.length === 0 ? (
        <div className={styles.empty}>
          <h2 className="t-headline">{t('empty.title')}</h2>
          <p className="muted">{t('empty.body')}</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {posts.map((post) => (
            <li key={post.slug}>{post.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
