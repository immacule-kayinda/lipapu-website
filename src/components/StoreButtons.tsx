import { useTranslations } from 'next-intl';
import { STORE_LINKS, type Store } from '@/config/site';
import styles from './StoreButtons.module.css';

const STORES: Store[] = ['ios', 'android'];

/**
 * Boutons des stores : un seul composant, une seule source de vérité (STORE_LINKS).
 * Tant qu'un lien est `null`, le bouton est désactivé et indique « Bientôt ».
 */
export function StoreButtons() {
  const t = useTranslations('store');
  return (
    <ul className={styles.list} aria-label={t('listLabel')}>
      {STORES.map((store) => {
        const href = STORE_LINKS[store];
        const name = t(store);
        const content = (
          <>
            <span className={styles.name}>{name}</span>
            {!href && <span className={styles.soon}>{t('soon')}</span>}
          </>
        );
        return (
          <li key={store}>
            {href ? (
              <a className={`button ${styles.store}`} href={href} rel="noopener">
                {content}
              </a>
            ) : (
              <button
                type="button"
                className={`button button-secondary ${styles.store}`}
                disabled
                aria-label={t('label', { store: name })}
              >
                {content}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
