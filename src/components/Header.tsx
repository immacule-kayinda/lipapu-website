import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Logo } from './Logo';
import styles from './Header.module.css';

export function Header() {
  const t = useTranslations('nav');
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Logo />
        <nav aria-label={t('main')}>
          <ul className={styles.list}>
            <li>
              <Link href="/securite" className={styles.link}>
                {t('safety')}
              </Link>
            </li>
            <li>
              <Link href="/blog" className={styles.link}>
                {t('blog')}
              </Link>
            </li>
            <li>
              <Link href="/a-propos" className={styles.link}>
                {t('about')}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
