import styles from './Header.module.css';

export default function Header({ totalBooks, activeCount, availableBooks, overdueCount }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <span className={styles.icon}>📚</span>
          <div>
            <h1 className={styles.title}>LibraryOS</h1>
            <p className={styles.sub}>스마트 도서 관리 시스템</p>
          </div>
        </div>
        <div className={styles.stats}>
          <Stat label="총 도서" value={totalBooks} />
          <Stat label="대출중" value={activeCount} />
          <Stat label="대출 가능" value={availableBooks} />
          {overdueCount > 0 && <Stat label="⚠️ 연체" value={overdueCount} warn />}
        </div>
      </div>
    </header>
  );
}

function Stat({ label, value, warn }) {
  return (
    <div className={styles.stat}>
      <span className={`${styles.val} ${warn ? styles.warn : ''}`}>{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
