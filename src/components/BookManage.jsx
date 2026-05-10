'use client';
import { useState } from 'react';
import { CATEGORIES } from '@/data';
import styles from './BookManage.module.css';

export default function BookManage({ books, onAdd, onDelete }) {
  const [form, setForm] = useState({ title: '', author: '', category: CATEGORIES[0], total: 1 });
  const [msg, setMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) {
      setMsg('❗ 제목과 저자를 입력해주세요.');
      return;
    }
    onAdd(form);
    setForm({ title: '', author: '', category: CATEGORIES[0], total: 1 });
    setMsg('✅ 도서가 추가되었습니다!');
    setTimeout(() => setMsg(''), 2500);
  };

  return (
    <div>
      <h2 className={styles.title}>도서 관리</h2>

      <div className={styles.formBox}>
        <h3>📥 도서 추가</h3>
        <form onSubmit={handleSubmit} className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label}>도서 제목 *</label>
            <input
              className={styles.input}
              placeholder="예) 클린 코드"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>저자 *</label>
            <input
              className={styles.input}
              placeholder="예) 로버트 C. 마틴"
              value={form.author}
              onChange={e => setForm({ ...form, author: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>카테고리</label>
            <select
              className={styles.select}
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>보유 권 수</label>
            <input
              className={styles.input}
              type="number"
              min="1"
              max="99"
              value={form.total}
              onChange={e => setForm({ ...form, total: e.target.value })}
            />
          </div>
          <button type="submit" className={styles.addBtn}>도서 추가</button>
        </form>
        {msg && (
          <p className={`${styles.msg} ${msg.startsWith('❗') ? styles.msgError : styles.msgSuccess}`}>
            {msg}
          </p>
        )}
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
