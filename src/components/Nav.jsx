import styles from './Nav.module.css';

export default function Nav({ tabs, active, onSelect, overdueCount }) {
  return (
    <nav className={styles.nav}>
      {tabs.map(t => (
        <button
          key={t}
          className={`${styles.btn} ${active === t ? styles.active : ''}`}
          onClick={() => onSelect(t)}
        >
          {t}
          {t === '대출 현황' && overdueCount > 0 && (
            <span className={styles.badge}>{overdueCount}</span>
          )}
        </button>
      ))}
    </nav>
  );
}
