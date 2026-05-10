'use client';
import { useEffect } from 'react';
import { LOAN_PERIOD_DAYS, daysDiff } from '@/data';
import styles from './ReturnModal.module.css';

export default function ReturnModal({ loan, onConfirm, onClose }) {
  const elapsed = daysDiff(loan.loanDate);
  const isOverdue = elapsed > LOAN_PERIOD_DAYS;

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        <div className={styles.icon}>📥</div>
        <h2 className={styles.title}>반납 처리</h2>
        <p className={styles.desc}>아래 도서를 반납 처리하시겠습니까?</p>

        <div className={styles.infoBox}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>도서명</span>
            <span className={styles.infoVal}>{loan.bookTitle}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>저자</span>
            <span className={styles.infoVal}>{loan.author}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>대출자</span>
            <span className={styles.infoVal}>{loan.borrower}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>대출일</span>
            <span className={styles.infoVal}>{loan.loanDate}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>대출 기간</span>
            <span className={`${styles.infoVal} ${isOverdue ? styles.overdueText : styles.normalText}`}>
              {elapsed}일 경과
              {isOverdue && ` (${elapsed - LOAN_PERIOD_DAYS}일 연체)`}
            </span>
          </div>
        </div>

        {isOverdue && (
          <div className={styles.overdueWarning}>
            ⚠️ 반납 기한을 {elapsed - LOAN_PERIOD_DAYS}일 초과한 도서입니다.
          </div>
        )}

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>취소</button>
          <button className={styles.confirmBtn} onClick={() => { onConfirm(loan); onClose(); }}>
            반납 확인
          </button>
        </div>
      </div>
    </div>
  );
}
