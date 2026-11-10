import type { ReactNode } from 'react';
import styles from './PageIntro.module.css';

type Props = {
  title: string;
  lead?: string;
  overline?: string;
  children?: ReactNode;
};

export function PageIntro({ title, lead, overline, children }: Props) {
  return (
    <header className={styles.intro}>
      {overline && <p className={`t-overline muted ${styles.overline}`}>{overline}</p>}
      <h1 className={`t-title-1 ${styles.title}`}>{title}</h1>
      {lead && <p className={`measure muted ${styles.lead}`}>{lead}</p>}
      {children}
    </header>
  );
}
