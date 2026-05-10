'use client';
import { useState } from 'react';
import styles from './BookManage.module.css';

export default function BookManage({ books, onAdd, onDelete }) {
  const [form, setForm] = useState({ title: '', author: '', category: '', total: 1 });
  const [msg, setMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) { setMsg('제목과 저자를 입력해주세요.'); return; }
    onAdd(form);
    setForm({ title: '', author: '', category: '', total: 1 });
    setMsg('도서가 추가되었습니다!');
    setTimeout(() => setMsg(''), 2500);
  };

  return (
    <div>
      <h2 className={styles.title}>도서 관리</h2>

      <div className={styles.formBox}>
        <h3>📥 도서 추가</h3>
        <form onSubmit={handleSubmit} className={styles.grid}>
          <input className={styles.input} placeholder="도서 제목 *" value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} />
          <input className={styles.input} placeholder="저자 *" value={form.author}
            onChange={e => setForm({ ...form, author: e.target.value })} />
          <input className={styles.input} placeholder="카테고리 (예: 소설, 개발, 역사)" value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })} />
          <input className={styles.input} type="number" min="1" placeholder="권 수" value={form.total}
            onChange={e => setForm({ ...form, total: e.target.value })} />
          <button type="submit" className={styles.addBtn}>도서 추가</button>
        </form>
        {msg && <p className={styles.msg}>{msg}</p>}
      </div>

      <div className={styles.listBox}>
        <h3>📋 전체 도서 목록</h3>
        {books.length === 0 && <p className={styles.empty}>등록된 도서가 없습니다.</p>}
        {books.map(book => (
          <div key={book.id} className={styles.item}>
            <div className={styles.info}>
              <strong>{book.title}</strong>
              <span>{book.author} · {book.category}</span>
              <span>보유 {book.total}권 / 대출가능 {book.available}권</span>
            </div>
            <button className={styles.delBtn} onClick={() => onDelete(book)}>삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
}
