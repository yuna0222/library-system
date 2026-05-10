'use client';

import { useState } from 'react';
import { SAMPLE_BOOKS, SAMPLE_LOANS, LOAN_PERIOD_DAYS, daysDiff } from '@/data';
import Header from './Header';
import Nav from './Nav';
import BookList from './BookList';
import LoanStatus from './LoanStatus';
import Ranking from './Ranking';
import Dashboard from './Dashboard';
import BookManage from './BookManage';
import styles from './LibraryApp.module.css';

const TABS = ['도서 목록', '대출 현황', '인기 랭킹', '통계', '도서 관리'];

let nextBookId = 100;
let nextLoanId = 200;

export default function LibraryApp() {
  const [tab, setTab] = useState('도서 목록');
  const [books, setBooks] = useState(SAMPLE_BOOKS);
  const [loans, setLoans] = useState(SAMPLE_LOANS);
  const [borrower, setBorrower] = useState('');

  /* ── 대출 신청 ── */
  const handleLoan = (book) => {
    if (!borrower.trim()) { alert('대출자 이름을 입력해주세요.'); return; }
    if (book.available <= 0) { alert('대출 가능한 도서가 없습니다.'); return; }
    const today = new Date().toISOString().slice(0, 10);
    setLoans(prev => [...prev, {
      id: nextLoanId++,
      bookId: book.id,
      bookTitle: book.title,
      author: book.author,
      borrower: borrower.trim(),
      loanDate: today,
      returnDate: null,
      status: '대출중',
    }]);
    setBooks(prev => prev.map(b => b.id === book.id ? { ...b, available: b.available - 1 } : b));
    setBorrower('');
    alert(`"${book.title}" 대출이 완료되었습니다!`);
  };

  /* ── 반납 처리 ── */
  const handleReturn = (loan) => {
    const today = new Date().toISOString().slice(0, 10);
    setLoans(prev => prev.map(l =>
      l.id === loan.id ? { ...l, returnDate: today, status: '반납완료' } : l
    ));
    setBooks(prev => prev.map(b =>
      b.id === loan.bookId ? { ...b, available: b.available + 1 } : b
    ));
  };

  /* ── 도서 추가 ── */
  const handleAddBook = (newBook) => {
    const total = Number(newBook.total) || 1;
    setBooks(prev => [...prev, {
      id: nextBookId++,
      title: newBook.title.trim(),
      author: newBook.author.trim(),
      category: newBook.category.trim() || '기타',
      total,
      available: total,
    }]);
  };

  /* ── 도서 삭제 ── */
  const handleDeleteBook = (book) => {
    if (!window.confirm(`"${book.title}"을 삭제하시겠습니까?`)) return;
    setBooks(prev => prev.filter(b => b.id !== book.id));
  };

  /* ── 파생 데이터 ── */
  const activeLoans = loans.filter(l => l.status === '대출중');
  const returnedLoans = loans.filter(l => l.status === '반납완료');
  const overdueLoans = activeLoans.filter(l => daysDiff(l.loanDate) > LOAN_PERIOD_DAYS);

  const loanCountMap = {};
  loans.forEach(l => {
    if (!loanCountMap[l.bookId])
      loanCountMap[l.bookId] = { bookTitle: l.bookTitle, author: l.author, count: 0 };
    loanCountMap[l.bookId].count++;
  });
  const ranking = Object.values(loanCountMap).sort((a, b) => b.count - a.count).slice(0, 10);

  return (
    <div className={styles.app}>
      <Header
        totalBooks={books.length}
        activeCount={activeLoans.length}
        availableBooks={books.reduce((s, b) => s + b.available, 0)}
        overdueCount={overdueLoans.length}
      />
      <Nav tabs={TABS} active={tab} onSelect={setTab} overdueCount={overdueLoans.length} />
      <main className={styles.main}>
        {tab === '도서 목록' && (
          <BookList
            books={books}
            borrower={borrower}
            setBorrower={setBorrower}
            onLoan={handleLoan}
          />
        )}
        {tab === '대출 현황' && (
          <LoanStatus
            activeLoans={activeLoans}
            returnedLoans={returnedLoans}
            overdueLoans={overdueLoans}
            onReturn={handleReturn}
          />
        )}
        {tab === '인기 랭킹' && <Ranking ranking={ranking} />}
        {tab === '통계' && (
          <Dashboard
            books={books}
            loans={loans}
            activeLoans={activeLoans}
            returnedLoans={returnedLoans}
            overdueLoans={overdueLoans}
          />
        )}
        {tab === '도서 관리' && (
          <BookManage
            books={books}
            onAdd={handleAddBook}
            onDelete={handleDeleteBook}
          />
        )}
      </main>
      <footer className={styles.footer}>
        <p>LibraryOS · Next.js + Firebase · AWS S3 Hosted</p>
      </footer>
    </div>
  );
}
