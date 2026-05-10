import styles from './Ranking.module.css';

export default function Ranking({ ranking }) {
  const medals = ['🥇', '🥈', '🥉'];
  const max = ranking[0]?.count || 1;

  return (
    <div>
      <h2 className={styles.title}>🏆 인기 도서 랭킹</h2>
      <p className={styles.desc}>전체 대출 기록 기준으로 집계된 인기 도서입니다.</p>
      {ranking.length === 0
        ? <p className={styles.empty}>아직 대출 기록이 없습니다.</p>
        : (
          <div className={styles.list}>
            {ranking.map((item, idx) => (
              <div key={item.bookTitle} className={`${styles.item} ${idx < 3 ? styles[`rank${idx + 1}`] : ''}`}>
                <span className={styles.medal}>{medals[idx] ?? idx + 1}</span>
                <div className={styles.info}>
                  <strong>{item.bookTitle}</strong>
                  <span>{item.author}</span>
                </div>
                <div className={styles.countBox}>
                  <span className={styles.countNum}>{item.count}</span>
                  <span className={styles.countLabel}>회</span>
                </div>
                <div className={styles.barWrap}>
                  <div className={styles.bar} style={{ width: `${(item.count / max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}
