'use client';
import { useState } from 'react';
import { CATEGORY_COVERS } from '@/data';
import LoanModal from './LoanModal';
import styles from './BookList.module.css';

export default function BookList({ books, onLoan }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('전체');
  const [selectedBook, setSelectedBook] = useState(null);

  const categories = ['전체', ...Array.from(new Set(books.map(b => b.category).filter(Boolean)))];

  const filtered = books.filter(b => {
    const matchSearch = b.title.includes(search) || b.author.includes(search);
    const matchCat = category === '전체' || b.category === category;
    return matchSearch && matchCat;
  });

  const handleLoanClick = (book) => {
    if (book.available === 0) return;
    setSelectedBook(book);
  };

  const handleLoanConfirm = (book, borrower) => {
    onLoan(book, borrower);
    setSelectedBook(null);
  };

  return (
    <div>
      <h2 className={styles.title}>도서 목록</h2>

      <div className={styles.controls}>
        <div className={styles.searchRow}>
          <input
            className={styles.input}
            placeholder="🔍  제목 또는 저자 검색..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.catRow}>
          {categories.map(c => (
            <button
              key={c}
              className={`${styles.catBtn} ${category === c ? styles.catActive : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className={styles.count}>{filtered.length}권의 도서</p>

      <div className={styles.grid}>
        {filtered.length === 0 && <p className={styles.empty}>검색 결과가 없습니다.</p>}
        {filtered.map(book => {
          const cover = CATEGORY_COVERS[book.category] || CATEGORY_COVERS['기타'];
          return (
            <div key={book.id} className={`${styles.card} ${book.available === 0 ? styles.unavailable : ''}`}>
              <div className={styles.coverWrap}>
                <img src={cover} alt={book.category} className={styles.cover} />
                {book.available === 0 && (
                  <div className={styles.coverOverlay}>대출 불가</div>
                )}
              </div>
              <div className={styles.cardBody}>
                <span className={styles.category}>{book.category}</span>
                <h3 className={styles.bookTitle}>{book.title}</h3>
                <p className={styles.author}>✍️ {book.author}</p>
                <span className={`${styles.badge} ${book.available > 0 ? styles.badgeGreen : styles.badgeRed}`}>
                  {book.available > 0 ? `대출 가능 ${book.available}/${book.total}권` : '대출 불가'}
                </span>
                <button
                  className={styles.loanBtn}
                  disabled={book.available === 0}
                  onClick={() => handleLoanClick(book)}
                >
                  {book.available > 0 ? '대출 신청' : '대출 불가'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedBook && (
        <LoanModal
          book={selectedBook}
          onConfirm={handleLoanConfirm}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
}
