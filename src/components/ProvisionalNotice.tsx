import styles from './ProvisionalNotice.module.css';

/** Bandeau « texte provisoire ». Le texte vient des messages (clé common.*). */
export function ProvisionalNotice({ children }: { children: string }) {
  return (
    <p role="note" className={styles.notice}>
      {children}
    </p>
  );
}
