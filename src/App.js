import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import './App.css';

const TABS = ['도서 목록', '대출 현황', '인기 랭킹', '통계', '도서 관리'];
const LOAN_PERIOD_DAYS = 7;

function daysDiff(dateStr) {
  const today = new Date();
  const loanDate = new Date(dateStr);
  today.setHours(0, 0, 0, 0);
  loanDate.setHours(0, 0, 0, 0);
  return Math.floor((today - loanDate) / (1000 * 60 * 60 * 24));
}

function App() {
  const [tab, setTab] = useState('도서 목록');
  const [books, setBooks] = useState([]);
  const [loans, setLoans] = useState([]);
  const [search, setSearch] = useState('');
  const [borrower, setBorrower] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [newBook, setNewBook] = useState({ title: '', author: '', category: '', total: 1 });
  const [addMsg, setAddMsg] = useState('');

  const fetchBooks = async () => {
    const q = query(collection(db, 'books'), orderBy('title'));
    const snapshot = await getDocs(q);
    setBooks(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const fetchLoans = async () => {
    const q = query(collection(db, 'loans'), orderBy('loanDate', 'desc'));
    const snapshot = await getDocs(q);
    setLoans(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    Promise.all([fetchBooks(), fetchLoans()]).then(() => setLoading(false));
  }, []);

  const handleLoan = async (book) => {
    if (!borrower.trim()) { alert('대출자 이름을 입력해주세요.'); return; }
    if (book.available <= 0) { alert('대출 가능한 도서가 없습니다.'); return; }
    await addDoc(collection(db, 'loans'), {
      bookId: book.id,
      bookTitle: book.title,
      author: book.author,
      borrower: borrower.trim(),
      loanDate: new Date().toISOString().slice(0, 10),
      returnDate: null,
      status: '대출중',
    });
    await updateDoc(doc(db, 'books', book.id), { available: book.available - 1 });
    setBorrower('');
    await fetchBooks();
    await fetchLoans();
    alert(`"${book.title}" 대출이 완료되었습니다.`);
  };

  const handleReturn = async (loan) => {
    await updateDoc(doc(db, 'loans', loan.id), {
      returnDate: new Date().toISOString().slice(0, 10),
      status: '반납완료',
    });
    const book = books.find(b => b.id === loan.bookId);
    if (book) {
      await updateDoc(doc(db, 'books', loan.bookId), { available: book.available + 1 });
    }
    await fetchBooks();
    await fetchLoans();
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!newBook.title.trim() || !newBook.author.trim()) {
      setAddMsg('제목과 저자를 입력해주세요.'); return;
    }
    await addDoc(collection(db, 'books'), {
      title: newBook.title.trim(),
      author: newBook.author.trim(),
      category: newBook.category.trim() || '기타',
      total: Number(newBook.total),
      available: Number(newBook.total),
    });
    setNewBook({ title: '', author: '', category: '', total: 1 });
    setAddMsg('도서가 추가되었습니다!');
    await fetchBooks();
    setTimeout(() => setAddMsg(''), 2000);
  };

  const handleDeleteBook = async (book) => {
    if (!window.confirm(`"${book.title}"을 삭제하시겠습니까?`)) return;
    await deleteDoc(doc(db, 'books', book.id));
    await fetchBooks();
  };

  // 카테고리 목록
  const categories = ['전체', ...Array.from(new Set(books.map(b => b.category).filter(Boolean)))];

  // 검색 + 카테고리 필터
  const filtered = books.filter(b => {
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === '전체' || b.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const activeLoans = loans.filter(l => l.status === '대출중');
  const returnedLoans = loans.filter(l => l.status === '반납완료');
  const overdueLoans = activeLoans.filter(l => daysDiff(l.loanDate) > LOAN_PERIOD_DAYS);

  // 인기 도서 랭킹
  const loanCountMap = {};
  loans.forEach(l => {
    if (!loanCountMap[l.bookId]) {
      loanCountMap[l.bookId] = { bookTitle: l.bookTitle, author: l.author, count: 0 };
    }
    loanCountMap[l.bookId].count += 1;
  });
  const ranking = Object.values(loanCountMap).sort((a, b) => b.count - a.count).slice(0, 10);

  // 통계
  const totalLoans = loans.length;
  const activeCount = activeLoans.length;
  const returnedCount = returnedLoans.length;
  const overdueCount = overdueLoans.length;
  const totalBooks = books.length;
  const availableBooks = books.reduce((s, b) => s + b.available, 0);

  // 카테고리별 대출 통계
  const categoryStats = {};
  loans.forEach(l => {
    const book = books.find(b => b.id === l.bookId);
    const cat = book?.category || '기타';
    categoryStats[cat] = (categoryStats[cat] || 0) + 1;
  });
  const categoryStatsList = Object.entries(categoryStats).sort((a, b) => b[1] - a[1]);
  const maxCatCount = categoryStatsList[0]?.[1] || 1;

  // 최근 7일 대출 추이
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const dailyCounts = last7.map(date => ({
    date,
    label: date.slice(5),
    count: loans.filter(l => l.loanDate === date).length,
  }));
  const maxDaily = Math.max(...dailyCounts.map(d => d.count), 1);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader" />
        <p>도서관 시스템을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">📚</span>
            <div>
              <h1>LibraryOS</h1>
              <p>스마트 도서 관리 시스템</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-num">{totalBooks}</span>
              <span className="stat-label">총 도서</span>
            </div>
            <div className="stat">
              <span className="stat-num">{activeCount}</span>
              <span className="stat-label">대출중</span>
            </div>
            <div className="stat">
              <span className="stat-num">{availableBooks}</span>
              <span className="stat-label">대출 가능</span>
            </div>
            {overdueCount > 0 && (
              <div className="stat stat-overdue">
                <span className="stat-num">{overdueCount}</span>
                <span className="stat-label">⚠️ 연체</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <nav className="nav">
        {TABS.map(t => (
          <button key={t} className={`nav-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t}
            {t === '대출 현황' && overdueCount > 0 && (
              <span className="overdue-badge">{overdueCount}</span>
            )}
          </button>
        ))}
      </nav>

      <main className="main">

        {/* ── 도서 목록 탭 ── */}
        {tab === '도서 목록' && (
          <div className="section">
            <div className="section-top">
              <h2>도서 목록</h2>
              <div className="search-row">
                <input className="search-input" placeholder="제목 또는 저자 검색..."
                  value={search} onChange={e => setSearch(e.target.value)} />
                <input className="borrower-input" placeholder="대출자 이름"
                  value={borrower} onChange={e => setBorrower(e.target.value)} />
              </div>
              <div className="category-filter">
                {categories.map(cat => (
                  <button key={cat}
                    className={`cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <p className="result-count">{filtered.length}권의 도서</p>
            <div className="book-grid">
              {filtered.length === 0 && <p className="empty">검색 결과가 없습니다.</p>}
              {filtered.map(book => (
                <div key={book.id} className={`book-card ${book.available === 0 ? 'unavailable' : ''}`}>
                  <div className="book-category">{book.category}</div>
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">✍️ {book.author}</p>
                  <div className="book-status">
                    <span className={`badge ${book.available > 0 ? 'badge-green' : 'badge-red'}`}>
                      {book.available > 0 ? `대출 가능 (${book.available}/${book.total})` : '대출 불가'}
                    </span>
                  </div>
                  <button className="loan-btn" disabled={book.available === 0} onClick={() => handleLoan(book)}>
                    {book.available > 0 ? '대출 신청' : '대출 불가'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 대출 현황 탭 ── */}
        {tab === '대출 현황' && (
          <div className="section">
            <h2>대출 현황</h2>
            {overdueLoans.length > 0 && (
              <div className="overdue-banner">
                <span className="overdue-icon">⚠️</span>
                <div>
                  <strong>연체 도서 {overdueLoans.length}건</strong>
                  <p>반납 기한({LOAN_PERIOD_DAYS}일)을 초과한 도서가 있습니다.</p>
                </div>
              </div>
            )}
            <div className="loan-section">
              <h3 className="loan-section-title">📖 현재 대출중 ({activeLoans.length}건)</h3>
              {activeLoans.length === 0 ? (
                <p className="empty">현재 대출 중인 도서가 없습니다.</p>
              ) : (
                <div className="loan-list">
                  {activeLoans.map(loan => {
                    const elapsed = daysDiff(loan.loanDate);
                    const isOverdue = elapsed > LOAN_PERIOD_DAYS;
                    return (
                      <div key={loan.id} className={`loan-card active-loan ${isOverdue ? 'overdue-card' : ''}`}>
                        <div className="loan-info">
                          <strong>{loan.bookTitle}</strong>
                          <span>{loan.author}</span>
                          <span>대출자: {loan.borrower}</span>
                          <span>대출일: {loan.loanDate}</span>
                          {isOverdue ? (
                            <span className="overdue-label">⚠️ 연체 {elapsed - LOAN_PERIOD_DAYS}일 초과</span>
                          ) : (
                            <span className="dday-label">반납까지 {LOAN_PERIOD_DAYS - elapsed}일 남음</span>
                          )}
                        </div>
                        <button className="return-btn" onClick={() => handleReturn(loan)}>반납 처리</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="loan-section">
              <h3 className="loan-section-title">✅ 반납 완료 ({returnedLoans.length}건)</h3>
              {returnedLoans.length === 0 ? (
                <p className="empty">반납 완료된 도서가 없습니다.</p>
              ) : (
                <div className="loan-list">
                  {returnedLoans.map(loan => (
                    <div key={loan.id} className="loan-card returned-loan">
                      <div className="loan-info">
                        <strong>{loan.bookTitle}</strong>
                        <span>{loan.author}</span>
                        <span>대출자: {loan.borrower}</span>
                        <span>대출일: {loan.loanDate} → 반납일: {loan.returnDate}</span>
                      </div>
                      <span className="badge badge-green">반납완료</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 인기 랭킹 탭 ── */}
        {tab === '인기 랭킹' && (
          <div className="section">
            <h2>🏆 인기 도서 랭킹</h2>
            <p className="section-desc">전체 대출 기록 기준으로 집계된 인기 도서입니다.</p>
            {ranking.length === 0 ? (
              <p className="empty">아직 대출 기록이 없습니다.</p>
            ) : (
              <div className="ranking-list">
                {ranking.map((item, idx) => (
                  <div key={item.bookTitle} className={`ranking-item rank-${idx + 1}`}>
                    <div className="rank-num">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`}
                    </div>
                    <div className="rank-info">
                      <strong>{item.bookTitle}</strong>
                      <span>{item.author}</span>
                    </div>
                    <div className="rank-count">
                      <span className="count-num">{item.count}</span>
                      <span className="count-label">회 대출</span>
                    </div>
                    <div className="rank-bar-wrap">
                      <div className="rank-bar" style={{ width: `${(item.count / ranking[0].count) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── 통계 대시보드 탭 ── */}
        {tab === '통계' && (
          <div className="section">
            <h2>📊 대출 통계 대시보드</h2>
            <div className="stats-grid">
              {[
                { icon: '📚', val: totalBooks, label: '전체 도서 수' },
                { icon: '📤', val: totalLoans, label: '누적 대출 수' },
                { icon: '🔄', val: activeCount, label: '현재 대출중' },
                { icon: '✅', val: returnedCount, label: '반납 완료' },
                { icon: '⚠️', val: overdueCount, label: '연체 건수', warn: true },
                { icon: '📖', val: availableBooks, label: '대출 가능 권수' },
              ].map(({ icon, val, label, warn }) => (
                <div key={label} className={`stats-card ${warn ? 'stats-card-warn' : ''}`}>
                  <div className="stats-icon">{icon}</div>
                  <div className="stats-val">{val}</div>
                  <div className="stats-label">{label}</div>
                </div>
              ))}
            </div>

            <div className="chart-box">
              <h3>📅 최근 7일 대출 추이</h3>
              <div className="bar-chart">
                {dailyCounts.map(d => (
                  <div key={d.date} className="bar-col">
                    <div className="bar-count">{d.count > 0 ? d.count : ''}</div>
                    <div className="bar" style={{ height: `${(d.count / maxDaily) * 120 + (d.count > 0 ? 8 : 0)}px` }} />
                    <div className="bar-label">{d.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-box">
              <h3>🗂️ 카테고리별 대출 현황</h3>
              {categoryStatsList.length === 0 ? (
                <p className="empty">대출 기록이 없습니다.</p>
              ) : (
                <div className="category-stats">
                  {categoryStatsList.map(([cat, count]) => (
                    <div key={cat} className="cat-stat-row">
                      <span className="cat-stat-name">{cat}</span>
                      <div className="cat-stat-bar-wrap">
                        <div className="cat-stat-bar" style={{ width: `${(count / maxCatCount) * 100}%` }} />
                      </div>
                      <span className="cat-stat-count">{count}회</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 도서 관리 탭 ── */}
        {tab === '도서 관리' && (
          <div className="section">
            <h2>도서 관리</h2>
            <div className="add-book-form">
              <h3>📥 도서 추가</h3>
              <form onSubmit={handleAddBook} className="form-grid">
                <input className="form-input" placeholder="도서 제목 *" value={newBook.title}
                  onChange={e => setNewBook({ ...newBook, title: e.target.value })} />
                <input className="form-input" placeholder="저자 *" value={newBook.author}
                  onChange={e => setNewBook({ ...newBook, author: e.target.value })} />
                <input className="form-input" placeholder="카테고리 (예: 소설, 개발, 역사)" value={newBook.category}
                  onChange={e => setNewBook({ ...newBook, category: e.target.value })} />
                <input className="form-input" type="number" min="1" placeholder="권 수" value={newBook.total}
                  onChange={e => setNewBook({ ...newBook, total: e.target.value })} />
                <button type="submit" className="add-btn">도서 추가</button>
              </form>
              {addMsg && <p className="add-msg">{addMsg}</p>}
            </div>
            <div className="manage-list">
              <h3>📋 전체 도서 목록</h3>
              {books.length === 0 && <p className="empty">등록된 도서가 없습니다.</p>}
              {books.map(book => (
                <div key={book.id} className="manage-item">
                  <div className="manage-info">
                    <strong>{book.title}</strong>
                    <span>{book.author} · {book.category}</span>
                    <span>보유: {book.total}권 / 대출가능: {book.available}권</span>
                  </div>
                  <button className="delete-btn" onClick={() => handleDeleteBook(book)}>삭제</button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <footer className="footer">
        <p>LibraryOS · Firebase + React · AWS S3 Hosted</p>
      </footer>
    </div>
  );
}

export default App;
