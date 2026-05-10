'use client';
import { useState } from 'react';
import { LOAN_PERIOD_DAYS, daysDiff } from '@/data';
import ReturnModal from './ReturnModal';
import styles from './LoanStatus.module.css';

export default function LoanStatus({ activeLoans, returnedLoans, overdueLoans, onReturn }) {
  const [returnTarget, setReturnTarget] = useState(null);

  return (
    <div>
      <h2 className={styles.title}>대출 현황</h2>

      {overdueLoans.length > 0 && (
        <div className={styles.overdueBanner}>
          <span>⚠️</span>
          <div>
            <strong>연체 도서 {overdueLoans.length}건</strong>
            <p>반납 기한({LOAN_PERIOD_DAYS}일)을 초과한 도서가 있습니다.</p>
          </div>
        </div>
      )}

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>📖 현재 대출중 ({activeLoans.length}건)</h3>
        {activeLoans.length === 0
          ? <p className={styles.empty}>현재 대출 중인 도서가 없습니다.</p>
          : activeLoans.map(loan => {
            const elapsed = daysDiff(loan.loanDate);
            const isOverdue = elapsed > LOAN_PERIOD_DAYS;
            return (
              <div key={loan.id} className={`${styles.card} ${isOverdue ? styles.overdue : styles.active}`}>
                <div className={styles.info}>
                  <strong>{loan.bookTitle}</strong>
                  <span>{loan.author}</span>
                  <span>대출자: {loan.borrower}</span>
                  <span>대출일: {loan.loanDate}</span>
                  {isOverdue
                    ? <span className={styles.overdueLabel}>⚠️ 연체 {elapsed - LOAN_PERIOD_DAYS}일 초과</span>
                    : <span className={styles.ddayLabel}>반납까지 {LOAN_PERIOD_DAYS - elapsed}일 남음</span>
                  }
                </div>
                <button className={styles.returnBtn} onClick={() => setReturnTarget(loan)}>
                  반납 처리
                </button>
              </div>
            );
          })
        }
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>✅ 반납 완료 ({returnedLoans.length}건)</h3>
        {returnedLoans.length === 0
          ? <p className={styles.empty}>반납 완료된 도서가 없습니다.</p>
          : returnedLoans.map(loan => (
            <div key={loan.id} className={`${styles.card} ${styles.returned}`}>
              <div className={styles.info}>
                <strong>{loan.bookTitle}</strong>
                <span>{loan.author}</span>
                <span>대출자: {loan.borrower}</span>
                <span>대출일: {loan.loanDate} → 반납일: {loan.returnDate}</span>
              </div>
              <span className={styles.doneBadge}>반납완료</span>
            </div>
          ))
        }
      </section>

      {returnTarget && (
        <ReturnModal
          loan={returnTarget}
          onConfirm={onReturn}
          onClose={() => setReturnTarget(null)}
        />
      )}
    </div>
  );
}
