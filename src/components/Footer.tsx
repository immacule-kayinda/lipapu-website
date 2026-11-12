import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ThemeToggle } from './ThemeToggle';
import styles from './Footer.module.css';

export function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={`t-prompt ${styles.tagline}`}>{t('tagline')}</p>
        <nav aria-label={t('navLabel')}>
          <h2 className="visually-hidden">{t('legalHeading')}</h2>
          <ul className={styles.list}>
            <li>
              <Link href="/legal/cgu" className={styles.link}>
                {t('cgu')}
              </Link>
            </li>
            <li>
              <Link href="/legal/confidentialite" className={styles.link}>
                {t('privacy')}
              </Link>
            </li>
            <li>
              <Link href="/legal/cookies" className={styles.link}>
                {t('cookies')}
              </Link>
            </li>
            <li>
              <Link href="/suppression-de-compte" className={styles.link}>
                {t('deleteAccount')}
              </Link>
            </li>
          </ul>
        </nav>
        <div className={styles.bottom}>
          <p className={styles.copy}>{t('copyright', { year })}</p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
