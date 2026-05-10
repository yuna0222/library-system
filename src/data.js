export const LOAN_PERIOD_DAYS = 7;

export const CATEGORIES = ['소설', '개발', '역사', '자기계발', '과학', '경제', '철학', '기타'];

// 카테고리별 커버 이미지 (Unsplash 무료 이미지)
export const CATEGORY_COVERS = {
  '소설':    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
  '개발':    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80',
  '역사':    'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&q=80',
  '자기계발':'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=80',
  '과학':    'https://images.unsplash.com/photo-1532094349884-543559059c2b?w=400&q=80',
  '경제':    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80',
  '철학':    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80',
  '기타':    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80',
};

export const SAMPLE_BOOKS = [
  { id: 1, title: '클린 코드', author: '로버트 C. 마틴', category: '개발', total: 3, available: 2 },
  { id: 2, title: '리팩터링', author: '마틴 파울러', category: '개발', total: 2, available: 1 },
  { id: 3, title: '채식주의자', author: '한강', category: '소설', total: 4, available: 3 },
  { id: 4, title: '82년생 김지영', author: '조남주', category: '소설', total: 3, available: 1 },
  { id: 5, title: '사피엔스', author: '유발 하라리', category: '역사', total: 2, available: 2 },
  { id: 6, title: '총균쇠', author: '재레드 다이아몬드', category: '역사', total: 1, available: 1 },
  { id: 7, title: '미움받을 용기', author: '기시미 이치로', category: '자기계발', total: 3, available: 2 },
  { id: 8, title: '아주 작은 습관의 힘', author: '제임스 클리어', category: '자기계발', total: 2, available: 1 },
  { id: 9, title: '데미안', author: '헤르만 헤세', category: '소설', total: 2, available: 2 },
  { id: 10, title: '객체지향의 사실과 오해', author: '조영호', category: '개발', total: 2, available: 2 },
];

const today = new Date();
const daysAgo = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

export const SAMPLE_LOANS = [
  { id: 101, bookId: 2, bookTitle: '리팩터링', author: '마틴 파울러', borrower: '김철수', loanDate: daysAgo(10), returnDate: null, status: '대출중' },
  { id: 102, bookId: 4, bookTitle: '82년생 김지영', author: '조남주', borrower: '이영희', loanDate: daysAgo(3), returnDate: null, status: '대출중' },
  { id: 103, bookId: 8, bookTitle: '아주 작은 습관의 힘', author: '제임스 클리어', borrower: '박민준', loanDate: daysAgo(5), returnDate: null, status: '대출중' },
  { id: 104, bookId: 1, bookTitle: '클린 코드', author: '로버트 C. 마틴', borrower: '최수연', loanDate: daysAgo(20), returnDate: daysAgo(13), status: '반납완료' },
  { id: 105, bookId: 3, bookTitle: '채식주의자', author: '한강', borrower: '정다은', loanDate: daysAgo(15), returnDate: daysAgo(8), status: '반납완료' },
  { id: 106, bookId: 7, bookTitle: '미움받을 용기', author: '기시미 이치로', borrower: '한지수', loanDate: daysAgo(1), returnDate: null, status: '대출중' },
  { id: 107, bookId: 1, bookTitle: '클린 코드', author: '로버트 C. 마틴', borrower: '김철수', loanDate: daysAgo(30), returnDate: daysAgo(23), status: '반납완료' },
  { id: 108, bookId: 5, bookTitle: '사피엔스', author: '유발 하라리', borrower: '이영희', loanDate: daysAgo(25), returnDate: daysAgo(18), status: '반납완료' },
  { id: 109, bookId: 2, bookTitle: '리팩터링', author: '마틴 파울러', borrower: '박민준', loanDate: daysAgo(40), returnDate: daysAgo(33), status: '반납완료' },
  { id: 110, bookId: 3, bookTitle: '채식주의자', author: '한강', borrower: '최수연', loanDate: daysAgo(0), returnDate: null, status: '대출중' },
];

export function daysDiff(dateStr) {
  const today = new Date();
  const d = new Date(dateStr);
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.floor((today - d) / (1000 * 60 * 60 * 24));
}
