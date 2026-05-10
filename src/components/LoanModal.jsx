'use client';
import { useState, useEffect } from 'react';
import { CATEGORY_COVERS } from '@/data';
import styles from './LoanModal.module.css';

export default function LoanModal({ book, onConfirm, onClose }) {
  const [borrower, setBorrower] = useState('');

  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleConfirm = () => {
    if (!borrower.trim()) { alert('대출자 이름을 입력해주세요.'); return; }
    onConfirm(book, borrower.trim());
    onClose();
  };

  const cover = CATEGORY_COVERS[book.category] || CATEGORY_COVERS['기타'];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        <div className={styles.bookInfo}>
          <img src={cover} alt={book.title} className={styles.cover} />
          <div className={styles.meta}>
            <span className={styles.category}>{book.category}</span>
            <h2 className={styles.title}>{book.title}</h2>
            <p className={styles.author}>✍️ {book.author}</p>
            <p className={styles.stock}>
              대출 가능 <strong>{book.available}</strong> / {book.total}권
            </p>
          </div>
        </div>

        <div className={styles.form}>
          <label className={styles.label}>대출자 이름</label>
          <input
            className={styles.input}
            placeholder="이름을 입력하세요"
            value={borrower}
            onChange={e => setBorrower(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleConfirm(); }}
            autoFocus
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>취소</button>
          <button className={styles.confirmBtn} onClick={handleConfirm}>대출 신청</button>
        </div>
      </div>
    </div>
  );
}
