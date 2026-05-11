import React, { useState } from 'react';
import './App.css';
import {
  SAMPLE_BOOKS, SAMPLE_LOANS, CATEGORIES, CATEGORY_COVERS,
  LOAN_PERIOD_DAYS, daysDiff
} from './data';

const TABS = ['도서 목록', '대출 현황', '인기 랭킹', '통계', '도서 관리'];
const LIBRARIAN_PASSWORD = '1234';
let nextBookId = 200;
let nextLoanId = 200;

export default function App() {
  const [tab, setTab] = useState('도서 목록');
  const [books, setBooks] = useState(SAMPLE_BOOKS);
  const [loans, setLoans] = useState(SAMPLE_LOANS);

  // 도서 목록
  const [search, setSearch] = useState('');
  const [selCat, setSelCat] = useState('전체');

  // 대출 모달
  const [loanTarget, setLoanTarget] = useState(null);
  const [borrowerName, setBorrowerName] = useState('');

  // 반납 모달
  const [returnTarget, setReturnTarget] = useState(null);

  // 도서 관리
  const [unlocked, setUnlocked] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [newBook, setNewBook] = useState({ title: '', author: '', category: CATEGORIES[0], total: 1 });
  const [addMsg, setAddMsg] = useState('');

  /* ── 파생 데이터 ── */
  const activeLoans   = loans.filter(l => l.status === '대출중');
  const returnedLoans = loans.filter(l => l.status === '반납완료');
  const overdueLoans  = activeLoans.filter(l => daysDiff(l.loanDate) > LOAN_PERIOD_DAYS);

  const categories = ['전체', ...new Set(books.map(b => b.category))];
  const filtered = books.filter(b => {
    const ms = b.title.includes(search) || b.author.includes(search);
    const mc = selCat === '전체' || b.category === selCat;
    return ms && mc;
  });

  // 인기 랭킹
  const loanCountMap = {};
  loans.forEach(l => {
    if (!loanCountMap[l.bookId]) loanCountMap[l.bookId] = { bookTitle: l.bookTitle, author: l.author, count: 0 };
    loanCountMap[l.bookId].count++;
  });
  const ranking = Object.values(loanCountMap).sort((a, b) => b.count - a.count).slice(0, 10);

  // 통계
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const dailyCounts = last7.map(date => ({
    label: date.slice(5),
    count: loans.filter(l => l.loanDate === date).length,
  }));
  const maxDaily = Math.max(...dailyCounts.map(d => d.count), 1);

  const catMap = {};
  loans.forEach(l => {
    const b = books.find(b => b.id === l.bookId);
    const c = b?.category || '기타';
    catMap[c] = (catMap[c] || 0) + 1;
  });
  const catList = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  const maxCat = catList[0]?.[1] || 1;

  /* ── 대출 ── */
  const confirmLoan = () => {
    if (!borrowerName.trim()) { alert('대출자 이름을 입력해주세요.'); return; }
    const today = new Date().toISOString().slice(0, 10);
    setLoans(prev => [...prev, {
      id: nextLoanId++, bookId: loanTarget.id, bookTitle: loanTarget.title,
      author: loanTarget.author, borrower: borrowerName.trim(),
      loanDate: today, returnDate: null, status: '대출중',
    }]);
    setBooks(prev => prev.map(b => b.id === loanTarget.id ? { ...b, available: b.available - 1 } : b));
    alert(`"${loanTarget.title}" 대출이 완료되었습니다!`);
    setLoanTarget(null); setBorrowerName('');
  };

  /* ── 반납 ── */
  const confirmReturn = () => {
    const today = new Date().toISOString().slice(0, 10);
    setLoans(prev => prev.map(l => l.id === returnTarget.id ? { ...l, returnDate: today, status: '반납완료' } : l));
    setBooks(prev => prev.map(b => b.id === returnTarget.bookId ? { ...b, available: b.available + 1 } : b));
    setReturnTarget(null);
  };

  /* ── 도서 추가/삭제 ── */
  const handleAddBook = (e) => {
    e.preventDefault();
    if (!newBook.title.trim() || !newBook.author.trim()) { setAddMsg('❗ 제목과 저자를 입력해주세요.'); return; }
    const total = Number(newBook.total) || 1;
    setBooks(prev => [...prev, { id: nextBookId++, ...newBook, title: newBook.title.trim(), author: newBook.author.trim(), total, available: total }]);
    setNewBook({ title: '', author: '', category: CATEGORIES[0], total: 1 });
    setAddMsg('✅ 도서가 추가되었습니다!');
    setTimeout(() => setAddMsg(''), 2500);
  };
  const handleDeleteBook = (book) => {
    if (!window.confirm(`"${book.title}"을 삭제하시겠습니까?`)) return;
    setBooks(prev => prev.filter(b => b.id !== book.id));
  };

  /* ── 사서 로그인 ── */
  const tryLogin = (e) => {
    e.preventDefault();
    if (pw === LIBRARIAN_PASSWORD) { setUnlocked(true); setPwError(''); setPw(''); }
    else { setPwError('비밀번호가 올바르지 않습니다.'); setPw(''); }
  };

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="app">
      {/* ── 헤더 ── */}
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
            <div className="stat"><span className="stat-val">{books.length}</span><span className="stat-label">총 도서</span></div>
            <div className="stat"><span className="stat-val">{activeLoans.length}</span><span className="stat-label">대출중</span></div>
            <div className="stat"><span className="stat-val">{books.reduce((s, b) => s + b.available, 0)}</span><span className="stat-label">대출 가능</span></div>
            {overdueLoans.length > 0 && (
              <div className="stat"><span className="stat-val warn">{overdueLoans.length}</span><span className="stat-label">⚠️ 연체</span></div>
            )}
          </div>
        </div>
      </header>

      {/* ── 네비게이션 ── */}
      <nav className="nav">
        {TABS.map(t => (
          <button key={t} className={`nav-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t}
            {t === '대출 현황' && overdueLoans.length > 0 && (
              <span className="nav-badge">{overdueLoans.length}</span>
            )}
          </button>
        ))}
      </nav>

      <main className="main">

        {/* ══════════ 도서 목록 ══════════ */}
        {tab === '도서 목록' && (
          <div>
            <h2 className="sec-title">도서 목록</h2>
            <div className="controls">
              <input className="inp" placeholder="🔍  제목 또는 저자 검색..." value={search} onChange={e => setSearch(e.target.value)} />
              <div className="cat-row">
                {categories.map(c => (
                  <button key={c} className={`cat-btn${selCat === c ? ' active' : ''}`} onClick={() => setSelCat(c)}>{c}</button>
                ))}
              </div>
            </div>
            <p className="result-count">{filtered.length}권의 도서</p>
            <div className="book-grid">
              {filtered.length === 0 && <p className="empty" style={{ gridColumn: '1/-1' }}>검색 결과가 없습니다.</p>}
              {filtered.map(book => (
                <div key={book.id} className={`book-card${book.available === 0 ? ' unavail' : ''}`}>
                  <div className="cover-wrap">
                    <img className="cover-img" src={CATEGORY_COVERS[book.category] || CATEGORY_COVERS['기타']} alt={book.category} loading="lazy" />
                    {book.available === 0 && <div className="cover-overlay">대출 불가</div>}
                  </div>
                  <div className="card-body">
                    <span className="card-cat">{book.category}</span>
                    <h3 className="card-title">{book.title}</h3>
                    <p className="card-author">✍️ {book.author}</p>
                    <span className={`badge ${book.available > 0 ? 'badge-green' : 'badge-red'}`}>
                      {book.available > 0 ? `대출 가능 ${book.available}/${book.total}권` : '대출 불가'}
                    </span>
                    <button className="loan-btn" disabled={book.available === 0} onClick={() => setLoanTarget(book)}>
                      {book.available > 0 ? '대출 신청' : '대출 불가'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════ 대출 현황 ══════════ */}
        {tab === '대출 현황' && (
          <div>
            <h2 className="sec-title">대출 현황</h2>
            {overdueLoans.length > 0 && (
              <div className="overdue-banner">
                <span style={{ fontSize: 24 }}>⚠️</span>
                <div>
                  <strong>연체 도서 {overdueLoans.length}건</strong>
                  <p>반납 기한({LOAN_PERIOD_DAYS}일)을 초과한 도서가 있습니다.</p>
                </div>
              </div>
            )}
            <div className="loan-section">
              <h3 className="loan-sec-title">📖 현재 대출중 ({activeLoans.length}건)</h3>
              {activeLoans.length === 0
                ? <p className="empty">현재 대출 중인 도서가 없습니다.</p>
                : activeLoans.map(loan => {
                  const elapsed = daysDiff(loan.loanDate);
                  const isOverdue = elapsed > LOAN_PERIOD_DAYS;
                  return (
                    <div key={loan.id} className={`loan-card ${isOverdue ? 'overdue-l' : 'active-l'}`}>
                      <div className="loan-info">
                        <strong>{loan.bookTitle}</strong>
                        <span>{loan.author}</span>
                        <span>대출자: {loan.borrower}</span>
                        <span>대출일: {loan.loanDate}</span>
                        {isOverdue
                          ? <span className="overdue-lbl">⚠️ 연체 {elapsed - LOAN_PERIOD_DAYS}일 초과</span>
                          : <span className="dday-lbl">반납까지 {LOAN_PERIOD_DAYS - elapsed}일 남음</span>
                        }
                      </div>
                      <button className="return-btn" onClick={() => setReturnTarget(loan)}>반납 처리</button>
                    </div>
                  );
                })
              }
            </div>
            <div className="loan-section">
              <h3 className="loan-sec-title">✅ 반납 완료 ({returnedLoans.length}건)</h3>
              {returnedLoans.length === 0
                ? <p className="empty">반납 완료된 도서가 없습니다.</p>
                : returnedLoans.map(loan => (
                  <div key={loan.id} className="loan-card returned-l">
                    <div className="loan-info">
                      <strong>{loan.bookTitle}</strong>
                      <span>{loan.author}</span>
                      <span>대출자: {loan.borrower}</span>
                      <span>대출일: {loan.loanDate} → 반납일: {loan.returnDate}</span>
                    </div>
                    <span className="done-badge">반납완료</span>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* ══════════ 인기 랭킹 ══════════ */}
        {tab === '인기 랭킹' && (
          <div>
            <h2 className="sec-title">🏆 인기 도서 랭킹</h2>
            <p className="sec-desc">전체 대출 기록 기준으로 집계된 인기 도서입니다.</p>
            {ranking.length === 0
              ? <p className="empty">아직 대출 기록이 없습니다.</p>
              : ranking.map((item, idx) => (
                <div key={item.bookTitle} className={`rank-item${idx < 3 ? ` r${idx + 1}` : ''}`}>
                  <span className="rank-medal">{medals[idx] ?? idx + 1}</span>
                  <div className="rank-info">
                    <strong>{item.bookTitle}</strong>
                    <span>{item.author}</span>
                  </div>
                  <div className="rank-count">
                    <span className="rank-num">{item.count}</span>
                    <span className="rank-lbl">회</span>
                  </div>
                  <div className="rank-bar-wrap">
                    <div className="rank-bar" style={{ width: `${(item.count / ranking[0].count) * 100}%` }} />
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* ══════════ 통계 ══════════ */}
        {tab === '통계' && (
          <div>
            <h2 className="sec-title">📊 대출 통계 대시보드</h2>
            <div className="stats-grid">
              {[
                { icon: '📚', val: books.length, label: '전체 도서 수' },
                { icon: '📤', val: loans.length, label: '누적 대출 수' },
                { icon: '🔄', val: activeLoans.length, label: '현재 대출중' },
                { icon: '✅', val: returnedLoans.length, label: '반납 완료' },
                { icon: '⚠️', val: overdueLoans.length, label: '연체 건수', warn: true },
                { icon: '📖', val: books.reduce((s, b) => s + b.available, 0), label: '대출 가능 권수' },
              ].map(({ icon, val, label, warn }) => (
                <div key={label} className={`stat-card${warn ? ' warn-c' : ''}`}>
                  <span className="stat-icon">{icon}</span>
                  <span className="stat-val-lg">{val}</span>
                  <span className="stat-label-sm">{label}</span>
                </div>
              ))}
            </div>
            <div className="chart-box">
              <h3>📅 최근 7일 대출 추이</h3>
              <div className="bar-chart">
                {dailyCounts.map(d => (
                  <div key={d.label} className="bar-col">
                    <span className="bar-count">{d.count || ''}</span>
                    <div className="bar-fill" style={{ height: `${(d.count / maxDaily) * 120 + (d.count ? 8 : 4)}px` }} />
                    <span className="bar-lbl">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="chart-box">
              <h3>🗂️ 카테고리별 대출 현황</h3>
              {catList.length === 0
                ? <p className="empty">대출 기록이 없습니다.</p>
                : catList.map(([cat, cnt]) => (
                  <div key={cat} className="cat-stat-row">
                    <span className="cat-stat-name">{cat}</span>
                    <div className="cat-stat-bar-wrap">
                      <div className="cat-stat-bar" style={{ width: `${(cnt / maxCat) * 100}%` }} />
                    </div>
                    <span className="cat-stat-cnt">{cnt}회</span>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* ══════════ 도서 관리 ══════════ */}
        {tab === '도서 관리' && (
          <div>
            {!unlocked ? (
              <div>
                <h2 className="sec-title">도서 관리</h2>
                <div className="lock-screen">
                  <div className="lock-icon">🔒</div>
                  <h3 className="lock-title">사서 전용 페이지</h3>
                  <p className="lock-desc">이 페이지는 <strong>도서관 사서</strong>만 접근할 수 있습니다.<br />도서 추가, 삭제 등 관리 기능을 제공합니다.</p>
                  <form onSubmit={tryLogin} className="lock-form">
                    <input className="inp" type="password" placeholder="사서 비밀번호를 입력하세요"
                      value={pw} onChange={e => { setPw(e.target.value); setPwError(''); }} autoFocus />
                    {pwError && <p className="pw-error">{pwError}</p>}
                    <button type="submit" className="login-btn">접속하기</button>
                  </form>
                  <p className="lock-hint">일반 이용자는 도서 목록 탭에서 대출 신청하세요.</p>
                </div>
              </div>
            ) : (
              <div>
                <div className="manage-header">
                  <div>
                    <h2 className="sec-title" style={{ marginBottom: 2 }}>도서 관리</h2>
                    <p className="manage-mode-label">🔓 사서 모드 · 도서 추가 및 삭제 가능</p>
                  </div>
                  <button className="lock-btn" onClick={() => setUnlocked(false)}>잠금</button>
                </div>
                <div className="form-box">
                  <h3>📥 도서 추가</h3>
                  <form onSubmit={handleAddBook} className="form-grid">
                    <div className="form-field">
                      <label className="form-label">도서 제목 *</label>
                      <input className="inp" placeholder="예) 클린 코드" value={newBook.title}
                        onChange={e => setNewBook({ ...newBook, title: e.target.value })} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">저자 *</label>
                      <input className="inp" placeholder="예) 로버트 C. 마틴" value={newBook.author}
                        onChange={e => setNewBook({ ...newBook, author: e.target.value })} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">카테고리</label>
                      <select className="sel" value={newBook.category}
                        onChange={e => setNewBook({ ...newBook, category: e.target.value })}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="form-field">
                      <label className="form-label">보유 권 수</label>
                      <input className="inp" type="number" min="1" max="99" value={newBook.total}
                        onChange={e => setNewBook({ ...newBook, total: e.target.value })} />
                    </div>
                    <button type="submit" className="add-btn">도서 추가</button>
                  </form>
                  {addMsg && <p className={`add-msg ${addMsg.startsWith('❗') ? 'error' : 'success'}`}>{addMsg}</p>}
                </div>
                <div className="manage-list">
                  <h3>📋 전체 도서 목록 ({books.length}권)</h3>
                  {books.length === 0 && <p className="empty">등록된 도서가 없습니다.</p>}
                  {books.map(book => (
                    <div key={book.id} className="manage-item">
                      <div className="manage-info">
                        <strong>{book.title}</strong>
                        <span>{book.author} · <span className="cat-tag">{book.category}</span></span>
                        <span>보유 {book.total}권 · 대출가능 {book.available}권</span>
                      </div>
                      <button className="del-btn" onClick={() => handleDeleteBook(book)}>삭제</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </main>
      <footer className="footer">LibraryOS · React + CRA · AWS S3 Hosted</footer>

      {/* ── 대출 모달 ── */}
      {loanTarget && (
        <div className="modal-overlay" onClick={() => { setLoanTarget(null); setBorrowerName(''); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setLoanTarget(null); setBorrowerName(''); }}>✕</button>
            <div className="loan-modal-book">
              <img className="loan-modal-cover" src={CATEGORY_COVERS[loanTarget.category] || CATEGORY_COVERS['기타']} alt={loanTarget.category} />
              <div className="loan-modal-meta">
                <span className="loan-modal-cat">{loanTarget.category}</span>
                <h2 className="loan-modal-title">{loanTarget.title}</h2>
                <p className="loan-modal-author">✍️ {loanTarget.author}</p>
                <p className="loan-modal-stock">대출 가능 <strong>{loanTarget.available}</strong> / {loanTarget.total}권</p>
              </div>
            </div>
            <label className="modal-label">대출자 이름</label>
            <input className="inp" placeholder="이름을 입력하세요" value={borrowerName}
              onChange={e => setBorrowerName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && confirmLoan()} autoFocus />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => { setLoanTarget(null); setBorrowerName(''); }}>취소</button>
              <button className="btn-confirm" onClick={confirmLoan}>대출 신청</button>
            </div>
          </div>
        </div>
      )}

      {/* ── 반납 모달 ── */}
      {returnTarget && (
        <div className="modal-overlay" onClick={() => setReturnTarget(null)}>
          <div className="modal return-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setReturnTarget(null)}>✕</button>
            <div className="return-modal-icon">📥</div>
            <h2 className="return-modal-title">반납 처리</h2>
            <p className="return-modal-desc">아래 도서를 반납 처리하시겠습니까?</p>
            <div className="return-info-box">
              {[
                ['도서명', returnTarget.bookTitle],
                ['저자', returnTarget.author],
                ['대출자', returnTarget.borrower],
                ['대출일', returnTarget.loanDate],
              ].map(([label, val]) => (
                <div key={label} className="return-info-row">
                  <span className="return-info-label">{label}</span>
                  <span className="return-info-val">{val}</span>
                </div>
              ))}
              <div className="return-info-row">
                <span className="return-info-label">대출 기간</span>
                <span className={`return-info-val ${daysDiff(returnTarget.loanDate) > LOAN_PERIOD_DAYS ? 'warn' : 'ok'}`}>
                  {daysDiff(returnTarget.loanDate)}일 경과
                  {daysDiff(returnTarget.loanDate) > LOAN_PERIOD_DAYS && ` (${daysDiff(returnTarget.loanDate) - LOAN_PERIOD_DAYS}일 연체)`}
                </span>
              </div>
            </div>
            {daysDiff(returnTarget.loanDate) > LOAN_PERIOD_DAYS && (
              <div className="return-overdue-warn">
                ⚠️ 반납 기한을 {daysDiff(returnTarget.loanDate) - LOAN_PERIOD_DAYS}일 초과한 도서입니다.
              </div>
            )}
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setReturnTarget(null)}>취소</button>
              <button className="btn-confirm" style={{ background: 'var(--accent)' }} onClick={confirmReturn}>반납 확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
