import styles from './Dashboard.module.css';

export default function Dashboard({ books, loans, activeLoans, returnedLoans, overdueLoans }) {
  const totalBooks = books.length;
  const totalLoans = loans.length;
  const activeCount = activeLoans.length;
  const returnedCount = returnedLoans.length;
  const overdueCount = overdueLoans.length;
  const availableBooks = books.reduce((s, b) => s + b.available, 0);

  // 최근 7일 대출 추이
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const dailyCounts = last7.map(date => ({
    label: date.slice(5),
    count: loans.filter(l => l.loanDate === date).length,
  }));
  const maxDaily = Math.max(...dailyCounts.map(d => d.count), 1);

  // 카테고리별 대출 통계
  const catMap = {};
  loans.forEach(l => {
    const book = books.find(b => b.id === l.bookId);
    const cat = book?.category || '기타';
    catMap[cat] = (catMap[cat] || 0) + 1;
  });
  const catList = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  const maxCat = catList[0]?.[1] || 1;

  const statCards = [
    { icon: '📚', val: totalBooks, label: '전체 도서 수' },
    { icon: '📤', val: totalLoans, label: '누적 대출 수' },
    { icon: '🔄', val: activeCount, label: '현재 대출중' },
    { icon: '✅', val: returnedCount, label: '반납 완료' },
    { icon: '⚠️', val: overdueCount, label: '연체 건수', warn: true },
    { icon: '📖', val: availableBooks, label: '대출 가능 권수' },
  ];

  return (
    <div>
      <h2 className={styles.title}>📊 대출 통계 대시보드</h2>

      {/* 요약 카드 */}
      <div className={styles.statsGrid}>
        {statCards.map(({ icon, val, label, warn }) => (
          <div key={label} className={`${styles.card} ${warn ? styles.warnCard : ''}`}>
            <span className={styles.icon}>{icon}</span>
            <span className={`${styles.val} ${warn ? styles.warnVal : ''}`}>{val}</span>
            <span className={styles.label}>{label}</span>
          </div>
        ))}
      </div>

      {/* 최근 7일 바 차트 */}
      <div className={styles.chartBox}>
        <h3>📅 최근 7일 대출 추이</h3>
        <div className={styles.barChart}>
          {dailyCounts.map(d => (
            <div key={d.label} className={styles.barCol}>
              <span className={styles.barCount}>{d.count > 0 ? d.count : ''}</span>
              <div className={styles.bar} style={{ height: `${(d.count / maxDaily) * 120 + (d.count > 0 ? 8 : 4)}px` }} />
              <span className={styles.barLabel}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 카테고리별 수평 바 차트 */}
      <div className={styles.chartBox}>
        <h3>🗂️ 카테고리별 대출 현황</h3>
        {catList.length === 0
          ? <p className={styles.empty}>대출 기록이 없습니다.</p>
          : catList.map(([cat, count]) => (
            <div key={cat} className={styles.catRow}>
              <span className={styles.catName}>{cat}</span>
              <div className={styles.catBarWrap}>
                <div className={styles.catBar} style={{ width: `${(count / maxCat) * 100}%` }} />
              </div>
              <span className={styles.catCount}>{count}회</span>
            </div>
          ))
        }
      </div>
    </div>
  );
}
