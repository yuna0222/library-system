'use client';
import { useState } from 'react';
import { CATEGORIES } from '@/data';
import styles from './BookManage.module.css';

const LIBRARIAN_PASSWORD = '1234'; // 실제 배포 시 변경하세요

export default function BookManage({ books, onAdd, onDelete }) {
  const [unlocked, setUnlocked] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [form, setForm] = useState({ title: '', author: '', category: CATEGORIES[0], total: 1 });
  const [msg, setMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (pw === LIBRARIAN_PASSWORD) {
      setUnlocked(true);
      setPwError('');
    } else {
      setPwError('비밀번호가 올바르지 않습니다.');
      setPw('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) { setMsg('❗ 제목과 저자를 입력해주세요.'); return; }
    onAdd(form);
    setForm({ title: '', author: '', category: CATEGORIES[0], total: 1 });
    setMsg('✅ 도서가 추가되었습니다!');
    setTimeout(() => setMsg(''), 2500);
  };

  // ── 잠금 화면 ──
  if (!unlocked) {
    return (
      <div>
        <h2 className={styles.title}>도서 관리</h2>
        <div className={styles.lockScreen}>
          <div className={styles.lockIcon}>🔒</div>
          <h3 className={styles.lockTitle}>사서 전용 페이지</h3>
          <p className={styles.lockDesc}>
            이 페이지는 <strong>도서관 사서</strong>만 접근할 수 있습니다.<br />
            도서 추가, 삭제 등 관리 기능을 제공합니다.
          </p>
          <form onSubmit={handleLogin} className={styles.lockForm}>
            <input
              className={`${styles.input} ${pwError ? styles.inputError : ''}`}
              type="password"
              placeholder="사서 비밀번호를 입력하세요"
              value={pw}
              onChange={e => { setPw(e.target.value); setPwError(''); }}
              autoFocus
            />
            {pwError && <p className={styles.pwError}>{pwError}</p>}
            <button type="submit" className={styles.loginBtn}>접속하기</button>
          </form>
          <p className={styles.lockHint}>일반 이용자는 도서 목록 탭에서 대출 신청하세요.</p>
        </div>
      </div>
    );
  }

  // ── 사서 관리 화면 ──
  return (
    <div>
      <div className={styles.manageHeader}>
        <div>
          <h2 className={styles.title}>도서 관리</h2>
          <p className={styles.manageDesc}>🔓 사서 모드 · 도서 추가 및 삭제 가능</p>
        </div>
        <button className={styles.logoutBtn} onClick={() => setUnlocked(false)}>잠금</button>
      </div>

      <div className={styles.formBox}>
        <h3>📥 도서 추가</h3>
        <form onSubmit={handleSubmit} className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label}>도서 제목 *</label>
            <input className={styles.input} placeholder="예) 클린 코드" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>저자 *</label>
            <input className={styles.input} placeholder="예) 로버트 C. 마틴" value={form.author}
              onChange={e => setForm({ ...form, author: e.target.value })} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>카테고리</label>
            <select className={styles.select} value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>보유 권 수</label>
            <input className={styles.input} type="number" min="1" max="99" value={form.total}
              onChange={e => setForm({ ...form, total: e.target.value })} />
          </div>
          <button type="submit" className={styles.addBtn}>도서 추가</button>
        </form>
        {msg && <p className={`${styles.msg} ${msg.startsWith('❗') ? styles.msgError : styles.msgSuccess}`}>{msg}</p>}
      </div>

      <div className={styles.listBox}>
        <h3>📋 전체 도서 목록 ({books.length}권)</h3>
        {books.length === 0 && <p className={styles.empty}>등록된 도서가 없습니다.</p>}
        {books.map(book => (
          <div key={book.id} className={styles.item}>
            <div className={styles.info}>
              <strong>{book.title}</strong>
              <span>{book.author} · <span className={styles.cat}>{book.category}</span></span>
              <span>보유 {book.total}권 · 대출가능 {book.available}권</span>
            </div>
            <button className={styles.delBtn} onClick={() => onDelete(book)}>삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
}
