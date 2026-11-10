import { useId } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import styles from './Logo.module.css';

/** Marque : deux anneaux entrelacés (grille de 24, trait de 1,6). */
export function LogoMark({ className }: { className?: string }) {
  const id = useId();
  const topMask = `${id}-top`;
  const bottomMask = `${id}-bottom`;
  // Les anneaux se croisent en (12, 5,68) et (12, 18,32) : un anneau passe dessus, l'autre dessous.
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ strokeWidth: 'var(--icon-stroke)' }}
    >
      <defs>
        <mask id={topMask} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
          <rect width="24" height="24" fill="white" />
          <circle cx="12" cy="5.68" r="2" fill="black" />
        </mask>
        <mask id={bottomMask} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
          <rect width="24" height="24" fill="white" />
          <circle cx="12" cy="18.32" r="2" fill="black" />
        </mask>
      </defs>
      <circle cx="9" cy="12" r="7" mask={`url(#${bottomMask})`} />
      <circle cx="15" cy="12" r="7" mask={`url(#${topMask})`} />
    </svg>
  );
}

export function Logo() {
  const t = useTranslations();
  return (
    <Link href="/" className={styles.logo} aria-label={t('nav.home')}>
      <LogoMark className={styles.mark} />
      <span className={`t-title-2 ${styles.word}`}>{t('common.siteName')}</span>
    </Link>
  );
}
