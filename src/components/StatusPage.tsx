import type { ReactNode } from 'react';
import styles from './StatusPage.module.css';

type Props = { overline: string; title: string; body: string; children: ReactNode };

/** Mise en page commune des pages 404 et d'erreur. */
export function StatusPage({ overline, title, body, children }: Props) {
  return (
    <div className={`container ${styles.page}`}>
      <p className="t-overline muted">{overline}</p>
      <h1 className={`t-title-1 ${styles.title}`}>{title}</h1>
      <p className={`measure muted ${styles.body}`}>{body}</p>
      <div className={styles.actions}>{children}</div>
    </div>
  );
}
