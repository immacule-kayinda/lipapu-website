import styles from './TextSections.module.css';

export type TextSection = { id: string; title: string; body: string };

/** Suite de sections titre + paragraphe (pages légales, sécurité, à propos). */
export function TextSections({ items }: { items: TextSection[] }) {
  return (
    <div className={styles.sections}>
      {items.map((item) => (
        <section key={item.id} aria-labelledby={`section-${item.id}`} className={styles.section}>
          <h2 id={`section-${item.id}`} className="t-headline">
            {item.title}
          </h2>
          <p className="muted">{item.body}</p>
        </section>
      ))}
    </div>
  );
}
